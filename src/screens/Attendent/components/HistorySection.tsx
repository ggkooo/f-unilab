import React from 'react';
import type { Ticket } from '../types';
import { formatCounterLabel, getDurationLabel, getServiceBadgeClassName } from '../utils';

interface HistorySectionProps {
    history: Ticket[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ history }) => {
    return (
        <div className="bg-white rounded-[2rem] shadow-md border border-slate-100 flex flex-col overflow-hidden max-h-[40vh]">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-700">Historico</h3>
            </div>
            <div className="overflow-y-auto p-4 flex flex-col gap-3">
                {history.map((ticket) => {
                    const durationStart = ticket.createdAt ?? ticket.timestamp;
                    const durationLabel = getDurationLabel(durationStart, ticket.timestamp);

                    return (
                        <div key={ticket.id} className="flex items-center gap-2 py-2 border-b border-slate-50 last:border-0 min-w-0">
                            <span className="font-bold text-lg text-slate-600 min-w-[5rem]">{ticket.number}</span>
                            <span
                                className={`text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap truncate max-w-[10rem] ${getServiceBadgeClassName(ticket.serviceType)}`}
                                title={ticket.serviceType}
                            >
                                {ticket.serviceType}
                            </span>
                            <span
                                className="text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap"
                                title="Tempo total (criacao ate conclusao)"
                            >
                                {durationLabel}
                            </span>
                            <span
                                className="text-[11px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700 whitespace-nowrap"
                                title="Guiche do atendimento"
                            >
                                {formatCounterLabel(ticket.counterName)}
                            </span>
                            <span className="ml-auto text-sm text-slate-400 whitespace-nowrap">
                                {ticket.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}

                {history.length === 0 && (
                    <div className="text-center text-slate-400 py-4 italic">Nenhum historico</div>
                )}
            </div>
        </div>
    );
};

export default HistorySection;
