export interface TvTicket {
    id: number;
    key: string;
    serviceType: string;
    createdAt: Date;
    updatedAt: Date;
    counterName: string;
    calledAt?: Date;
}

export interface TvVideo {
    filename: string;
    url: string;
    createdAt?: string;
}