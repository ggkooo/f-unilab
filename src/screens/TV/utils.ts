import type { TvTicket, TvVideo } from './types';

export const formatCounterLabel = (counterName: string) => counterName.replace(/^guiche_/i, '');

export const getTicketsSignature = (tickets: TvTicket[]) =>
    tickets.map((ticket) => `${ticket.id}:${ticket.updatedAt.getTime()}:${ticket.counterName}`).join('|');

export const getVideosSignature = (videos: TvVideo[]) =>
    videos.map((video) => `${video.filename}:${video.createdAt ?? ''}`).join('|');