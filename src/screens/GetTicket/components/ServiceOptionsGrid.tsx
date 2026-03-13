import React from 'react';
import ActionCard from '../../../components/ui/ActionCard';
import type { ServiceOption } from '../types';

type ServiceOptionsGridProps = {
    options: ServiceOption[];
    isSubmitting: boolean;
    selectedService: string | null;
    onSelectService: (serviceType: string) => void;
};

const ServiceOptionsGrid: React.FC<ServiceOptionsGridProps> = ({
    options,
    isSubmitting,
    selectedService,
    onSelectService,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
            {options.map((service) => (
                <div key={service.title} className={service.fullWidth ? 'sm:col-span-2' : undefined}>
                    <ActionCard
                        icon={service.icon}
                        title={service.title}
                        subtitle={isSubmitting && selectedService === service.title ? 'Enviando solicitacao...' : service.subtitle}
                        variant={service.variant}
                        badges={service.badges}
                        onClick={() => onSelectService(service.title)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ServiceOptionsGrid;
