import React from 'react';
import ActionCard from '../../../components/ui/ActionCard';
import type { ServiceOption } from '../types';

type ServiceOptionsGridProps = {
    options: ServiceOption[];
    isSubmitting: boolean;
    selectedService: string | null;
    isBlocked: boolean;
    blockedSubtitle?: string;
    onSelectService: (serviceType: string) => void;
};

const ServiceOptionsGrid: React.FC<ServiceOptionsGridProps> = ({
    options,
    isSubmitting,
    selectedService,
    isBlocked,
    blockedSubtitle,
    onSelectService,
}) => {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:gap-5">
            {options.map((service) => (
                <div key={service.title} className={service.fullWidth ? 'h-full sm:col-span-2' : 'h-full'}>
                    <ActionCard
                        icon={service.icon}
                        title={service.title}
                        subtitle={isSubmitting && selectedService === service.title ? 'Enviando solicitação...' : isBlocked ? blockedSubtitle : service.subtitle}
                        variant={service.variant}
                        badges={service.badges}
                        onClick={() => onSelectService(service.title)}
                        disabled={isBlocked}
                    />
                </div>
            ))}
        </div>
    );
};

export default ServiceOptionsGrid;
