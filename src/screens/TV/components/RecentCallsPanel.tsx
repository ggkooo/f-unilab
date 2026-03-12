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
        <section className="flex-1 flex flex-col bg-white/90 rounded-[3rem] shadow-xl border border-slate-100 p-8 lg:p-12 min-w-0">
            <h3 className="text-3xl lg:text-4xl font-bold text-[#003B71] mb-8 border-b-2 border-slate-100 pb-4 text-center">
                Ultimas Chamadas
            </h3>

            <div className="flex flex-col gap-6 flex-shrink-0">
                {isLoading ? (
                    <div className="text-2xl text-slate-400">Carregando...</div>
                ) : error ? (
                    <div className="text-2xl text-red-500">{error}</div>
                ) : tickets.length === 0 ? (
                    <div className="text-2xl text-slate-400">Nenhuma senha chamada</div>
                ) : (
                    tickets.map((ticket, index) => (
                        <div
                            key={ticket.id}
                            className={`flex items-center justify-between gap-4 p-6 lg:p-8 rounded-2xl transition-all duration-300 ${index === 0 ? 'bg-blue-50 border-2 border-blue-200 shadow-lg scale-105' : 'bg-slate-50/50'}`}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <span className="text-4xl lg:text-5xl font-bold text-slate-700 truncate">
                                    {ticket.key}
                                </span>
                            </div>

                            <div className="flex flex-col items-end min-w-0">
                                <Badge color="#003B71">{ticket.serviceType}</Badge>
                                <span className="text-xl lg:text-2xl text-slate-500 block mt-2 text-right">
                                    Guiche{' '}
                                    <span className="text-4xl lg:text-5xl font-bold text-[#003B71] ml-2">
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