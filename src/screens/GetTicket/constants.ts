import type { ServiceOption } from './types';

export const SERVICE_OPTIONS: ServiceOption[] = [
    {
        icon: 'support_agent',
        title: 'Atendimento Normal',
        subtitle: 'Atendimento geral para orientacoes e solicitacoes comuns.',
        variant: 'primary',
    },
    {
        icon: 'priority_high',
        title: 'Atendimento Preferencial',
        subtitle: 'Prioridade para os publicos com atendimento preferencial.',
        variant: 'warning',
        badges: [
            { icon: 'elderly', label: '60+' },
            { icon: 'pregnant_woman', label: 'Gestante' },
            { icon: 'accessible', label: 'Deficiente' },
        ],
    },
    {
        icon: 'inventory_2',
        title: 'Recebimento de Exames ou Entrega de Amostras',
        subtitle: 'Atendimento para recebimento de exames ou entrega de amostras.',
        variant: 'success',
        fullWidth: true,
    },
];
