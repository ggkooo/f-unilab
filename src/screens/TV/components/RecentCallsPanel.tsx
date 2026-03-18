import { useEffect, useRef, useState } from 'react';
import Badge from '../../../components/ui/Badges';
import type { TvTicket } from '../types';
import { formatCounterLabel, getServiceBadgeColor } from '../utils';

interface RecentCallsPanelProps {
    tickets: TvTicket[];
    isLoading: boolean;
    error: string | null;
}

interface ServiceTypeBadgeProps {
    serviceType: string;
    color: string;
}

const ServiceTypeBadge = ({ serviceType, color }: ServiceTypeBadgeProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const updateOverflow = () => {
            if (!containerRef.current || !measureRef.current) {
                return;
            }

            setIsOverflowing(measureRef.current.scrollWidth > containerRef.current.clientWidth);
        };

        updateOverflow();
        window.addEventListener('resize', updateOverflow);

        return () => window.removeEventListener('resize', updateOverflow);
    }, [serviceType]);

    return (
        <div className="w-1/2 min-w-[9rem]">
            <Badge color={color} neonBorder={true} className="w-full px-3 sm:px-4 py-2 sm:py-2.5">
                <div ref={containerRef} className="relative w-full overflow-hidden">
                    <span ref={measureRef} className="invisible absolute whitespace-nowrap">
                        {serviceType}
                    </span>

                    {isOverflowing ? (
                        <div className="badge-marquee-track">
                            <span className="badge-marquee-text">{serviceType}</span>
                            <span className="badge-marquee-text" aria-hidden="true">{serviceType}</span>
                        </div>
                    ) : (
                        <span className="block w-full text-center whitespace-nowrap">{serviceType}</span>
                    )}
                </div>
            </Badge>
        </div>
    );
};

const RecentCallsPanel = ({ tickets, isLoading, error }: RecentCallsPanelProps) => {
    const recentTickets = tickets.slice(0, 3);

    return (
        <section className="flex-1 min-h-0 flex flex-col bg-white/90 rounded-[1.5rem] lg:rounded-[2rem] shadow-xl border border-slate-100 p-4 sm:p-5 lg:p-6 2xl:p-7 min-w-0">
            <h3 className="text-[clamp(0.95rem,1.5vw,1.6rem)] font-bold text-[#003B71] mb-3 lg:mb-4 border-b-2 border-slate-100 pb-2 text-center">
                Últimas Chamadas
            </h3>

            <div className="flex flex-col gap-2 lg:gap-3 flex-1 min-h-0 overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="text-[clamp(0.85rem,1.2vw,1.3rem)] text-slate-400">Carregando...</div>
                ) : error ? (
                    <div className="text-[clamp(0.85rem,1.1vw,1.2rem)] text-red-500">{error}</div>
                ) : recentTickets.length === 0 ? (
                    <div className="text-[clamp(0.85rem,1.2vw,1.3rem)] text-slate-400">Nenhuma senha chamada</div>
                ) : (
                    recentTickets.map((ticket, index) => (
                        <div
                            key={ticket.id}
                            className={`flex items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 rounded-lg lg:rounded-xl transition-all duration-300 ${index === 0 ? 'bg-slate-50/80 scale-[1.01]' : 'bg-slate-50/40'}`}
                        >
                            <div className="w-1/2 min-w-0 max-w-1/2 flex items-center gap-3">
                                <span className="text-[clamp(1.1rem,2.2vw,2.4rem)] font-bold text-slate-700 truncate leading-none">
                                    {ticket.key}
                                </span>
                            </div>

                            <div className="w-1/2 min-w-0 max-w-1/2 flex flex-col items-end gap-1">
                                <div className="w-full flex justify-end">
                                    <ServiceTypeBadge
                                        serviceType={ticket.serviceType}
                                        color={getServiceBadgeColor(ticket.serviceType)}
                                    />
                                </div>
                                <span className="text-[clamp(0.7rem,1rem,1.1rem)] text-slate-500 block text-right whitespace-nowrap">
                                    Guichê{' '}
                                    <span className="text-[clamp(1rem,1.8vw,2rem)] font-bold text-[#003B71] ml-1 leading-none align-middle">
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