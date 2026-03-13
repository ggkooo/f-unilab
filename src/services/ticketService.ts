import { apiConfig, buildApiUrl } from './apiConfig';

type CreateTicketInput = {
    serviceType: string;
};

type ApiErrorBody = {
    message?: string;
};

const createTimeoutController = (timeoutMs: number) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    return {
        signal: controller.signal,
        clear: () => window.clearTimeout(timeoutId),
    };
};

const getErrorMessage = async (response: Response) => {
    try {
        const body = (await response.json()) as ApiErrorBody;

        if (body.message) {
            return body.message;
        }
    } catch {
        // Ignore parse errors and fallback to default message.
    }

    return 'Não foi possível abrir o atendimento. Tente novamente.';
};

export const createTicket = async ({ serviceType }: CreateTicketInput) => {
    const timeout = createTimeoutController(apiConfig.timeoutMs);

    try {
        const response = await fetch(buildApiUrl(apiConfig.ticketsPath), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(apiConfig.apiKey ? { 'X-API-KEY': apiConfig.apiKey } : {}),
            },
            body: JSON.stringify({
                service_type: serviceType,
            }),
            signal: timeout.signal,
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }
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
