import React from 'react';

type VariantType = 'primary' | 'success' | 'warning';

interface ActionCardProps {
    icon: string;
    title: string;
    variant: VariantType;
    subtitle?: string;
    onClick?: () => void;
}

const variantStyles: Record<VariantType, { icon: string; ring: string; arrow: string }> = {
    primary: {
        icon: 'bg-blue-50 text-primary',
        ring: 'hover:border-blue-200 focus-visible:ring-blue-100',
        arrow: 'text-primary',
    },
    success: {
        icon: 'bg-emerald-50 text-success',
        ring: 'hover:border-emerald-200 focus-visible:ring-emerald-100',
        arrow: 'text-success',
    },
    warning: {
        icon: 'bg-orange-50 text-warning',
        ring: 'hover:border-orange-200 focus-visible:ring-orange-100',
        arrow: 'text-warning',
    },
};

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, subtitle, variant, onClick }) => {
    const styles = variantStyles[variant];

    return (
        <button
            onClick={onClick}
            className={`group relative flex w-full flex-col rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_35px_-18px_rgba(15,23,42,0.4)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 sm:p-6 ${styles.ring}`}
        >
            <div className="mb-4 flex items-start justify-between gap-4">
                <span className={`material-icons-outlined flex h-14 w-14 items-center justify-center rounded-2xl text-3xl sm:h-16 sm:w-16 sm:text-4xl ${styles.icon}`}>
                    {icon}
                </span>
                <span className={`material-icons-outlined translate-x-0 text-3xl transition-transform duration-300 group-hover:translate-x-1 ${styles.arrow}`}>
                    arrow_forward
                </span>
            </div>
            <span className="text-2xl font-semibold leading-tight text-slate-900 sm:text-[1.75rem]">{title}</span>
            {subtitle && (
                <span className="mt-2 text-sm font-medium leading-relaxed text-slate-500 sm:text-base">{subtitle}</span>
            )}
            <span className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-400">Toque para continuar</span>
        </button>
    );
};

export default ActionCard;
