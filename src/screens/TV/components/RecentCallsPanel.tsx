import Badge from '../../../components/ui/Badges';
import type { TvTicket } from '../types';
import { formatCounterLabel } from '../utils';

interface RecentCallsPanelProps {
    tickets: TvTicket[];
    isLoading: boolean;
    error: string | null;
}

const RecentCallsPanel = ({ tickets, isLoading, error }: RecentCallsPanelProps) => {
    return (
        <section className="flex-1 min-h-0 flex flex-col bg-white/90 rounded-[1.5rem] lg:rounded-[2rem] shadow-xl border border-slate-100 p-4 sm:p-5 lg:p-7 2xl:p-8 min-w-0">
            <h3 className="text-[clamp(1.1rem,1.7vw,2rem)] font-bold text-[#003B71] mb-4 lg:mb-5 border-b-2 border-slate-100 pb-3 text-center">
                Últimas Chamadas
            </h3>

            <div className="flex flex-col gap-3 lg:gap-4 flex-1 min-h-0 overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="text-[clamp(1rem,1.4vw,1.6rem)] text-slate-400">Carregando...</div>
                ) : error ? (
                    <div className="text-[clamp(1rem,1.3vw,1.5rem)] text-red-500">{error}</div>
                ) : tickets.length === 0 ? (
                    <div className="text-[clamp(1rem,1.4vw,1.6rem)] text-slate-400">Nenhuma senha chamada</div>
                ) : (
                    tickets.map((ticket, index) => (
                        <div
                            key={ticket.id}
                            className={`flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 rounded-xl lg:rounded-2xl transition-all duration-300 ${index === 0 ? 'bg-blue-50 border-2 border-blue-200 shadow-lg scale-[1.01]' : 'bg-slate-50/50'}`}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <span className="text-[clamp(1.5rem,3vw,3.2rem)] font-bold text-slate-700 truncate leading-none">
                                    {ticket.key}
                                </span>
                            </div>

                            <div className="flex flex-col items-end min-w-0">
                                <Badge color="#003B71">{ticket.serviceType}</Badge>
                                <span className="text-[clamp(0.9rem,1.3vw,1.5rem)] text-slate-500 block mt-1.5 text-right whitespace-nowrap">
                                    Guichê{' '}
                                    <span className="text-[clamp(1.5rem,2.8vw,3.2rem)] font-bold text-[#003B71] ml-1.5 leading-none align-middle">
                                        {formatCounterLabel(ticket.counterName)}
                                    </span>
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default RecentCallsPanel;