import { apiConfig, buildApiUrl } from './apiConfig';

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
    attendances_by_outcome: Record<string, number>;
    total_attendances: number;
}

export interface UpdateUserPayload {
    name: string;
    login: string;
    active: boolean;
    is_admin: boolean;
    password?: string;
}

const API_KEY = import.meta.env.VITE_API_KEY ?? apiConfig.apiKey;
const USERS_PATH = import.meta.env.VITE_USERS_PATH ?? '/users';
const MAKE_ADMIN_SUFFIX = '/make-admin';
const REMOVE_ADMIN_SUFFIX = '/remove-admin';
const VIDEOS_PATH = import.meta.env.VITE_VIDEOS_PATH ?? '/videos';
const VIDEOS_UPLOAD_PATH = import.meta.env.VITE_VIDEOS_UPLOAD_PATH ?? '/videos/upload';
const ATTENDANCE_REPORT_PATH = import.meta.env.VITE_REPORT_PDF_PATH ?? '/reports/attendances';

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
            throw new Error('A requisição demorou demais. Tente novamente.');
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Falha de comunicação com a API.');
    } finally {
        timeout.clear();
    }
};

export const fetchAdminUsers = async (accessToken?: string) => {
    const response = await request(
        buildApiUrl(USERS_PATH),
        {
            method: 'GET',
            headers: buildAuthHeaders(accessToken),
        },
        'Não foi possível carregar os usuários.',
    );

    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as ApiUser[]) : [];
};

export const updateAdminUser = async (userId: number, payload: UpdateUserPayload, accessToken?: string) => {
    await request(
        buildApiUrl(`${USERS_PATH}/${userId}`),
        {
            method: 'PATCH',
            headers: buildJsonHeaders(accessToken),
            body: JSON.stringify(payload),
        },
        'Não foi possível atualizar o usuário.',
    );
};

export const deleteAdminUser = async (userId: number, accessToken?: string) => {
    await request(
        buildApiUrl(`${USERS_PATH}/${userId}`),
        {
            method: 'DELETE',
            headers: buildAuthHeaders(accessToken),
        },
        'Não foi possível remover o usuário.',
    );
};

export const toggleUserAdminRole = async (user: ApiUser, accessToken?: string) => {
    const endpointSuffix = user.is_admin ? REMOVE_ADMIN_SUFFIX : MAKE_ADMIN_SUFFIX;

    await request(
        buildApiUrl(`${USERS_PATH}/${user.id}${endpointSuffix}`),
        {
            method: 'PATCH',
            headers: buildAuthHeaders(accessToken),
        },
        'Não foi possível alterar o perfil administrativo.',
    );
};

export const fetchAdminVideos = async (accessToken?: string) => {
    const response = await request(
        buildApiUrl(VIDEOS_PATH),
        {
            method: 'GET',
            headers: buildAuthHeaders(accessToken),
        },
        'Não foi possível carregar os vídeos.',
    );

    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as ApiVideo[]) : [];
};

export const uploadAdminVideo = async (file: File, accessToken?: string) => {
    const formData = new FormData();
    formData.append('video', file);

    await request(
        buildApiUrl(VIDEOS_UPLOAD_PATH),
        {
            method: 'POST',
            headers: buildAuthHeaders(accessToken),
            body: formData,
        },
        'Não foi possível enviar o vídeo.',
    );
};

export const deleteAdminVideo = async (filename: string, accessToken?: string) => {
    await request(
        buildApiUrl(`${VIDEOS_PATH}/${encodeURIComponent(filename)}`),
        {
            method: 'DELETE',
            headers: buildAuthHeaders(accessToken),
        },
        'Não foi possível remover o vídeo.',
    );
};

export const fetchAttendanceReport = async (startDate: string, endDate: string, accessToken?: string) => {
    const queryString = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
    });

    const response = await request(
        `${buildApiUrl(ATTENDANCE_REPORT_PATH)}?${queryString.toString()}`,
        {
            method: 'GET',
            headers: buildAuthHeaders(accessToken),
        },
        'Não foi possível gerar o relatório do período informado.',
    );

    return (await response.json()) as AttendanceReportResponse;
};
