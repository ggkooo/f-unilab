import type { TvMedia, TvTicket } from './types';

export const formatCounterLabel = (counterName: string) => counterName.replace(/^guiche_/i, '');

type ServiceVariant = 'primary' | 'warning' | 'success';

const getServiceVariant = (serviceType?: string): ServiceVariant => {
    const normalized = serviceType?.toLowerCase() ?? '';

    if (normalized.includes('preferencial')) {
        return 'warning';
    }

    if (normalized.includes('retirada') || normalized.includes('entrega')) {
        return 'success';
    }

    return 'primary';
};

export const getServiceBadgeColor = (serviceType: string): string => {
    const variant = getServiceVariant(serviceType);

    if (variant === 'warning') {
        return '#EF4444';
    }

    if (variant === 'success') {
        return '#F59E0B';
    }

    return '#3B82F6';
};

export const getServicePanelTheme = (serviceType?: string) => {
    const variant = getServiceVariant(serviceType);

    if (variant === 'warning') {
        return {
            card: 'bg-red-50/70 border-red-400/90 neon-pulse-red',
            aura: 'bg-red-100/50',
            counterGradient: 'from-red-500 to-rose-500',
        };
    }

    if (variant === 'success') {
        return {
            card: 'bg-amber-50/70 border-amber-400/90 neon-pulse-amber',
            aura: 'bg-amber-100/50',
            counterGradient: 'from-amber-500 to-yellow-500',
        };
    }

    return {
        card: 'bg-blue-50/70 border-blue-400/90 neon-pulse-blue',
        aura: 'bg-blue-100/50',
        counterGradient: 'from-blue-500 to-sky-500',
    };
};

export const getTicketsSignature = (tickets: TvTicket[]) =>
    tickets.map((ticket) => `${ticket.id}:${ticket.updatedAt.getTime()}:${ticket.counterName}`).join('|');

export const getMediaSignature = (mediaItems: TvMedia[]) =>
    mediaItems.map((media) => `${media.type}:${media.filename}:${media.url}:${media.createdAt ?? ''}`).join('|');