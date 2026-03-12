import React from 'react';
import type { Ticket } from '../types';
import {
    getServiceBadgeClassName,
    getWaitingCardClassName,
    getWaitingTimeLabel,
} from '../utils';

interface WaitingQueueSectionProps {
    queue: Ticket[];
    isLoadingQueue: boolean;
    callingTicketId: string | null;
    clockTick: number;
    onCallSpecificTicket: (ticketId: string) => void;
}

const WaitingQueueSection: React.FC<WaitingQueueSectionProps> = ({
    queue,
    isLoadingQueue,
    callingTicketId,
    clockTick,
    onCallSpecificTicket,
}) => {
    return (
        <div className="bg-white rounded-[2rem] shadow-md border border-slate-100 flex flex-col overflow-hidden max-h-[58vh]">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-700 flex items-center justify-between">
                    Aguardando <span className="bg-[#003B71] text-white text-sm px-3 py-1 rounded-full">{queue.length}</span>
                </h3>
            </div>
            <div className="overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-3">
                {isLoadingQueue && <div className="text-center text-slate-400 py-6 italic">Carregando fila...</div>}

                {queue.map((ticket) => (
                    <div
                        key={ticket.id}
                        className={`border rounded-xl p-3 flex items-center gap-2 shadow-sm min-w-0 transition-colors ${getWaitingCardClassName(ticket.timestamp)}`}
                    >
                        <span className="font-bold text-xl text-slate-700 min-w-[6rem] text-left">{ticket.number}</span>
                        <span
                            className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap truncate max-w-[12rem] ${getServiceBadgeClassName(ticket.serviceType)}`}
                            title={ticket.serviceType}
                        >
                            {ticket.serviceType}
                        </span>
                        <span
                            key={`${ticket.id}-${clockTick}`}
                            className="text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-500 whitespace-nowrap"
                            title="Tempo aguardando"
                        >
                            {getWaitingTimeLabel(ticket.timestamp)}
                        </span>
                        <button
                            type="button"
                            onClick={() => onCallSpecificTicket(ticket.id)}
                            disabled={isLoadingQueue || callingTicketId !== null}
                            className="ml-auto border border-primary bg-white text-primary hover:bg-primary hover:text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed text-sm font-bold px-3 py-2 rounded-lg transition-all"
                        >
                            {callingTicketId === ticket.id ? 'Chamando...' : 'Chamar'}
                        </button>
                    </div>
                ))}

                {!isLoadingQueue && queue.length === 0 && (
                    <div className="text-center text-slate-400 py-6 italic">Fila vazia</div>
                )}
            </div>
        </div>
    );
};

export default WaitingQueueSection;
