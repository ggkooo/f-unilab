import { apiConfig, buildApiUrl } from './apiConfig';
import type { ApiTicket, Ticket } from '../screens/Attendent/types';

const createTimeoutController = (timeoutMs: number) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    return {
        signal: controller.signal,
        clear: () => window.clearTimeout(timeoutId),
    };
};

const getApiHeaders = (accessToken?: string) => ({
    'Content-Type': 'application/json',
    ...(apiConfig.apiKey ? { 'X-API-KEY': apiConfig.apiKey } : {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
});

const mapWaitingTicket = (ticket: ApiTicket): Ticket => ({
    id: String(ticket.id),
    number: ticket.key,
    serviceType: ticket.service_type,
    status: 'Waiting',
    timestamp: new Date(ticket.created_at),
});

const mapCompletedTicket = (ticket: ApiTicket, fallbackCounter: string): Ticket => {
    const counterFromApi = typeof ticket.guiche === 'string' ? ticket.guiche.trim() : '';

    return {
        id: String(ticket.id),
        number: ticket.key,
        serviceType: ticket.service_type,
        status: 'Called',
        timestamp: new Date(ticket.completed_at ?? ticket.updated_at ?? ticket.created_at),
        createdAt: new Date(ticket.created_at),
        calledAt: ticket.called_at ? new Date(ticket.called_at) : undefined,
        counterName: counterFromApi || fallbackCounter,
    };
};

const request = async (path: string, init: RequestInit = {}) => {
    const timeout = createTimeoutController(apiConfig.timeoutMs);

    try {
        const response = await fetch(buildApiUrl(path), {
            ...init,
            signal: timeout.signal,
        });

        if (!response.ok) {
            throw new Error('Falha de comunicação com a API de atendimento.');
        }

        return response;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('A requisição de atendimento demorou demais. Tente novamente.');
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Falha de comunicação com a API de atendimento.');
    } finally {
        timeout.clear();
    }
};

export const fetchWaitingTickets = async () => {
    const response = await request(apiConfig.ticketsPath, {
        method: 'GET',
        headers: getApiHeaders(),
    });

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
        return [];
    }

    return (data as ApiTicket[])
        .filter((ticket) => !ticket.completed)
        .map(mapWaitingTicket);
};

export const fetchCompletedTickets = async (fallbackCounter: string) => {
    const response = await request(`${apiConfig.ticketsPath}/completed`, {
        method: 'GET',
        headers: getApiHeaders(),
    });

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
        return [];
    }

    return (data as ApiTicket[])
        .map((ticket) => mapCompletedTicket(ticket, fallbackCounter))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 20);
};

export const callTicket = async (ticketId: string, counterName: string, accessToken: string) => {
    await request(`${apiConfig.ticketsPath}/${ticketId}/call`, {
        method: 'POST',
        headers: getApiHeaders(accessToken),
        body: JSON.stringify({ guiche: counterName }),
    });
};

export const completeTicket = async (ticketId: string, accessToken: string) => {
    await request(`${apiConfig.ticketsPath}/${ticketId}/complete`, {
        method: 'PATCH',
        headers: getApiHeaders(accessToken),
    });
};

export const cancelTicket = async (ticketId: string, accessToken: string) => {
    await request(`${apiConfig.ticketsPath}/${ticketId}/cancel`, {
        method: 'PATCH',
        headers: getApiHeaders(accessToken),
    });
};

export const recallTicket = async (ticketId: string, accessToken: string) => {
    await request(`${apiConfig.ticketsPath}/${ticketId}/recall`, {
        method: 'POST',
        headers: getApiHeaders(accessToken),
    });
};
