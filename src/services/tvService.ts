import { apiConfig, buildApiUrl } from './apiConfig';
import type { TvTicket, TvVideo } from '../screens/TV/types';

interface ApiTvTicket {
    id: number;
    key: string;
    service_type: string;
    created_at: string;
    updated_at: string;
    guiche: string;
    called_at?: string;
}

interface ApiTvVideo {
    filename: string;
    url: string;
    created_at?: string;
}

type ApiErrorBody = {
    message?: string;
    error?: string;
};

const DEFAULT_API_KEY = 'e15e7aaff2ec79683370eef2fdd01ec0c2ffe94706e73cca7062e026617cc2fb';
const API_KEY = import.meta.env.VITE_API_KEY ?? apiConfig.apiKey ?? DEFAULT_API_KEY;
const RECENTLY_CALLED_PATH = import.meta.env.VITE_TV_RECENTLY_CALLED_PATH ?? `${apiConfig.ticketsPath}/recently-called`;
const VIDEOS_PATH = import.meta.env.VITE_VIDEOS_PATH ?? '/videos';

const createTimeoutController = (timeoutMs: number) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    return {
        signal: controller.signal,
        clear: () => window.clearTimeout(timeoutId),
    };
};

const getApiHeaders = (): HeadersInit => ({
    ...(API_KEY ? { 'X-API-KEY': API_KEY } : {}),
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

const request = async (path: string, init: RequestInit = {}, fallbackMessage: string) => {
    const timeout = createTimeoutController(apiConfig.timeoutMs);

    try {
        const response = await fetch(buildApiUrl(path), {
            ...init,
            headers: {
                ...getApiHeaders(),
                ...init.headers,
            },
            signal: timeout.signal,
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response, fallbackMessage));
        }

        return response;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('A requisição da TV demorou demais. Tente novamente.');
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Falha de comunicação com a API da TV.');
    } finally {
        timeout.clear();
    }
};

const mapTicket = (ticket: ApiTvTicket): TvTicket => ({
    id: ticket.id,
    key: ticket.key,
    serviceType: ticket.service_type,
    createdAt: new Date(ticket.created_at),
    updatedAt: new Date(ticket.updated_at),
    counterName: ticket.guiche,
    calledAt: ticket.called_at ? new Date(ticket.called_at) : undefined,
});

const mapVideo = (video: ApiTvVideo): TvVideo => ({
    filename: video.filename,
    url: video.url,
    createdAt: video.created_at,
});

export const fetchRecentlyCalledTickets = async () => {
    const response = await request(RECENTLY_CALLED_PATH, { method: 'GET' }, 'Não foi possível carregar as senhas chamadas.');
    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
        return [];
    }

    return (data as ApiTvTicket[]).map(mapTicket);
};

export const fetchTvVideos = async () => {
    const response = await request(VIDEOS_PATH, { method: 'GET' }, 'Não foi possível carregar os vídeos da TV.');
    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
        return [];
    }

    return (data as ApiTvVideo[]).map(mapVideo);
};

export const fetchTvVideoBlob = async (filename: string) => {
    const response = await request(
        `${VIDEOS_PATH}/${encodeURIComponent(filename)}`,
        { method: 'GET' },
        'Não foi possível carregar o vídeo selecionado.',
    );

    return response.blob();
};