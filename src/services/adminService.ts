import { apiConfig } from './apiConfig';

export interface ApiUser {
    id: number;
    uuid: string;
    name: string;
    login: string;
    active: boolean;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

export interface ApiVideo {
    filename: string;
    url: string;
    created_at?: string;
}

export interface AttendanceReportResponse {
    period: {
        start_date: string;
        end_date: string;
        days: number;
    };
    average_wait_time: {
        seconds: number;
        formatted: string;
    };
    average_attendances_per_day: number;
    attendances_per_day: Record<string, number>;
    attendances_by_type: Record<string, number>;
    total_attendances: number;
}

export interface UpdateUserPayload {
    name: string;
    login: string;
    active: boolean;
    is_admin: boolean;
    password?: string;
}

const API_KEY = import.meta.env.VITE_API_KEY ?? apiConfig.apiKey ?? 'e15e7aaff2ec79683370eef2fdd01ec0c2ffe94706e73cca7062e026617cc2fb';
const USERS_ENDPOINT = import.meta.env.VITE_USERS_ENDPOINT ?? 'http://localhost:8000/api/users';
const MAKE_ADMIN_SUFFIX = '/make-admin';
const REMOVE_ADMIN_SUFFIX = '/remove-admin';
const VIDEOS_ENDPOINT = import.meta.env.VITE_VIDEOS_ENDPOINT ?? 'http://localhost:8000/api/videos';
const VIDEOS_UPLOAD_ENDPOINT = import.meta.env.VITE_VIDEOS_UPLOAD_ENDPOINT ?? 'http://localhost:8000/api/videos/upload';
const ATTENDANCE_REPORT_ENDPOINT = import.meta.env.VITE_REPORT_PDF_ENDPOINT ?? 'http://localhost:8000/api/reports/attendances';

type ApiErrorBody = {
    message?: string;
    error?: string;
};

const createTimeoutController = (timeoutMs: number) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    return {
        signal: controller.signal,
        clear: () => window.clearTimeout(timeoutId),
    };
};

const buildAuthHeaders = (accessToken?: string): HeadersInit => ({
    'X-API-KEY': API_KEY,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
});

const buildJsonHeaders = (accessToken?: string): HeadersInit => ({
    ...buildAuthHeaders(accessToken),
    'Content-Type': 'application/json',
});

const getErrorMessage = async (response: Response, fallbackMessage: string) => {
    try {
        const body = (await response.json()) as ApiErrorBody;

        if (body.message) {
            return body.message;
        }

        if (body.error) {
            return body.error;
        }
    } catch {
        // Ignore parse errors and fallback to default error.
    }

    return fallbackMessage;
};

const request = async (url: string, init: RequestInit, fallbackMessage: string) => {
    const timeout = createTimeoutController(apiConfig.timeoutMs);

    try {
        const response = await fetch(url, {
            ...init,
            signal: timeout.signal,
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response, fallbackMessage));
        }

        return response;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('A requisicao demorou demais. Tente novamente.');
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Falha de comunicacao com a API.');
    } finally {
        timeout.clear();
    }
};

export const fetchAdminUsers = async (accessToken?: string) => {
    const response = await request(
        USERS_ENDPOINT,
        {
            method: 'GET',
            headers: buildAuthHeaders(accessToken),
        },
        'Nao foi possivel carregar os usuarios.',
    );

    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as ApiUser[]) : [];
};

export const updateAdminUser = async (userId: number, payload: UpdateUserPayload, accessToken?: string) => {
    await request(
        `${USERS_ENDPOINT}/${userId}`,
        {
            method: 'PATCH',
            headers: buildJsonHeaders(accessToken),
            body: JSON.stringify(payload),
        },
        'Nao foi possivel atualizar o usuario.',
    );
};

export const deleteAdminUser = async (userId: number, accessToken?: string) => {
    await request(
        `${USERS_ENDPOINT}/${userId}`,
        {
            method: 'DELETE',
            headers: buildAuthHeaders(accessToken),
        },
        'Nao foi possivel remover o usuario.',
    );
};

export const toggleUserAdminRole = async (user: ApiUser, accessToken?: string) => {
    const endpointSuffix = user.is_admin ? REMOVE_ADMIN_SUFFIX : MAKE_ADMIN_SUFFIX;

    await request(
        `${USERS_ENDPOINT}/${user.id}${endpointSuffix}`,
        {
            method: 'PATCH',
            headers: buildAuthHeaders(accessToken),
        },
        'Nao foi possivel alterar o perfil administrativo.',
    );
};

export const fetchAdminVideos = async (accessToken?: string) => {
    const response = await request(
        VIDEOS_ENDPOINT,
        {
            method: 'GET',
            headers: buildAuthHeaders(accessToken),
        },
        'Nao foi possivel carregar os videos.',
    );

    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as ApiVideo[]) : [];
};

export const uploadAdminVideo = async (file: File, accessToken?: string) => {
    const formData = new FormData();
    formData.append('video', file);

    await request(
        VIDEOS_UPLOAD_ENDPOINT,
        {
            method: 'POST',
            headers: buildAuthHeaders(accessToken),
            body: formData,
        },
        'Nao foi possivel enviar o video.',
    );
};

export const deleteAdminVideo = async (filename: string, accessToken?: string) => {
    await request(
        `${VIDEOS_ENDPOINT}/${encodeURIComponent(filename)}`,
        {
            method: 'DELETE',
            headers: buildAuthHeaders(accessToken),
        },
        'Nao foi possivel remover o video.',
    );
};

export const fetchAttendanceReport = async (startDate: string, endDate: string, accessToken?: string) => {
    const queryString = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
    });

    const response = await request(
        `${ATTENDANCE_REPORT_ENDPOINT}?${queryString.toString()}`,
        {
            method: 'GET',
            headers: buildAuthHeaders(accessToken),
        },
        'Nao foi possivel gerar o relatorio do periodo informado.',
    );

    return (await response.json()) as AttendanceReportResponse;
};
