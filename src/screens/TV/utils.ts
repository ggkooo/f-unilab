import type { TvTicket, TvVideo } from './types';

export const formatCounterLabel = (counterName: string) => counterName.replace(/^guiche_/i, '');

export const getServiceBadgeColor = (serviceType: string): string => {
    const normalized = serviceType.toLowerCase();

    // Red for Preferential services
    if (normalized.includes('preferencial')) {
        return '#EF4444'; // red-500
    }

    // Amber for Delivery/Pickup services
    if (normalized.includes('retirada') || normalized.includes('entrega')) {
        return '#F59E0B'; // amber-500
    }

    // Blue for general services (default)
    return '#3B82F6'; // blue-500
};

export const getTicketsSignature = (tickets: TvTicket[]) =>
    tickets.map((ticket) => `${ticket.id}:${ticket.updatedAt.getTime()}:${ticket.counterName}`).join('|');

export const getVideosSignature = (videos: TvVideo[]) =>
    videos.map((video) => `${video.filename}:${video.createdAt ?? ''}`).join('|');