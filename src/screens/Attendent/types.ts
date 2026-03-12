export type TicketStatus = 'Waiting' | 'Called';

export interface Ticket {
    id: string;
    number: string;
    serviceType: string;
    status: TicketStatus;
    timestamp: Date;
    createdAt?: Date;
    calledAt?: Date;
    counterName?: string;
}

export interface ApiTicket {
    id: number;
    key: string;
    service_type: string;
    completed: boolean;
    created_at: string;
    updated_at?: string;
    completed_at?: string;
    called_at?: string;
    guiche?: string;
}

export interface SelectOption {
    label: string;
    value: string;
}
