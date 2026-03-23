export interface TvTicket {
    id: number;
    key: string;
    serviceType: string;
    createdAt: Date;
    updatedAt: Date;
    counterName: string;
    calledAt?: Date;
}

export type TvMediaType = 'video' | 'image';

export interface TvMedia {
    filename: string;
    url: string;
    type: TvMediaType;
    createdAt?: string;
}