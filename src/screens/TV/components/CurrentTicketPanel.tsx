import Badge from '../../../components/ui/Badges';
import type { TvTicket } from '../types';
import { formatCounterLabel } from '../utils';

interface CurrentTicketPanelProps {
    ticket: TvTicket | null;
    isLoading: boolean;
    error: string | null;
}

const CurrentTicketPanel = ({ ticket, isLoading, error }: CurrentTicketPanelProps) => {
    return (
        <section className="flex-[2] flex flex-col justify-center items-center bg-white/90 rounded-[3rem] shadow-2xl border border-slate-100 p-10 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50/50 animate-pulse rounded-[3rem] z-0" />

            <div className="relative z-10 w-full flex flex-col items-center">
                <span className="text-3xl lg:text-5xl font-bold text-slate-500 uppercase tracking-widest mb-4 lg:mb-8">
                    Senha Chamada
                </span>

                {isLoading ? (
                    <div className="text-4xl text-slate-400 mt-10">Carregando...</div>
                ) : error ? (
                    <div className="text-4xl text-red-500 mt-10">{error}</div>
                ) : ticket ? (
                    <>
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="text-[7rem] lg:text-[18rem] font-bold text-[#003B71] leading-none drop-shadow-md">
                                {ticket.key}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="flex items-center justify-center gap-4">
                                <span className="inline-flex items-center bg-gradient-to-r from-blue-500 to-sky-500 text-white px-10 py-6 rounded-[2.5rem] shadow-2xl text-5xl lg:text-7xl font-extrabold tracking-widest drop-shadow-lg">
                                    Guiche
                                    <span className="ml-6 text-7xl lg:text-9xl font-black text-white drop-shadow-xl">
                                        {formatCounterLabel(ticket.counterName)}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-3xl lg:text-4xl text-slate-500 font-medium flex items-center gap-4 justify-center">
                            <Badge color="#003B71" size="hero">{ticket.serviceType}</Badge>
                        </div>
                    </>
                ) : (
                    <div className="text-4xl text-slate-400 mt-10">Nenhuma senha chamada</div>
                )}
            </div>
        </section>
    );
};

export default CurrentTicketPanel;