import type { ServiceOption } from './types';

export const SERVICE_OPTIONS: ServiceOption[] = [
    {
        icon: 'support_agent',
        title: 'Atendimento Normal',
        subtitle: 'Atendimento geral para orienta??es e solicita??es comuns.',
        variant: 'primary',
    },
    {
        icon: 'priority_high',
        title: 'Atendimento Preferencial',
        subtitle: 'Prioridade para os p?blicos com atendimento preferencial.',
        variant: 'warning',
        badges: [
            { icon: 'elderly', label: '60+' },
            { icon: 'pregnant_woman', label: 'Gestante' },
            { icon: 'child_care', label: 'Crian?a de colo' },
            { imageSrc: '/assets/img/icons/campanha-de-fita-autismo.png', label: 'Autista' },
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

