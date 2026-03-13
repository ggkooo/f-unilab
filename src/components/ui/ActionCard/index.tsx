import React from 'react';

type VariantType = 'primary' | 'success' | 'warning';

interface ActionCardProps {
    icon: string;
    title: string;
    variant: VariantType;
    subtitle?: string;
    badges?: Array<{
        icon: string;
        label: string;
    }>;
    onClick?: () => void;
}

const variantStyles: Record<VariantType, { icon: string; ring: string; arrow: string; card: string; bg: string }> = {
    primary: {
        icon: 'bg-blue-100 text-blue-700',
        ring: 'focus-visible:ring-blue-300',
        arrow: 'text-blue-700',
        card: 'border-blue-400/90 hover:border-blue-400 neon-pulse-blue hover:shadow-[0_0_0_1px_rgba(59,130,246,0.72),0_0_36px_rgba(59,130,246,0.66)]',
        bg: 'bg-blue-50/70',
    },
    success: {
        icon: 'bg-amber-100 text-amber-700',
        ring: 'focus-visible:ring-amber-300',
        arrow: 'text-amber-700',
        card: 'border-amber-400/90 hover:border-amber-400 neon-pulse-amber hover:shadow-[0_0_0_1px_rgba(251,191,36,0.72),0_0_36px_rgba(251,191,36,0.66)]',
        bg: 'bg-amber-50/70',
    },
    warning: {
        icon: 'bg-red-100 text-red-700',
        ring: 'focus-visible:ring-red-300',
        arrow: 'text-red-700',
        card: 'border-red-400/90 hover:border-red-400 neon-pulse-red hover:shadow-[0_0_0_1px_rgba(248,113,113,0.72),0_0_36px_rgba(248,113,113,0.66)]',
        bg: 'bg-red-50/70',
    },
};

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, subtitle, variant, badges, onClick }) => {
    const styles = variantStyles[variant];

    return (
        <button
            onClick={onClick}
            className={`group relative flex w-full flex-col rounded-3xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 sm:p-6 ${styles.bg} ${styles.card} ${styles.ring}`}
        >
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className={`material-icons-outlined flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl sm:h-16 sm:w-16 sm:text-4xl ${styles.icon}`}>
                        {icon}
                    </span>

                    {badges && badges.length > 0 && (
                        <div className="flex flex-wrap items-center content-center gap-2">
                            {badges.map((badge) => (
                                <span
                                    key={badge.label}
                                    className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700"
                                >
                                    <span className="material-icons-outlined text-sm leading-none">{badge.icon}</span>
                                    <span>{badge.label}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
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
