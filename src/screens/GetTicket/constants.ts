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
    },
    {
        icon: 'inventory_2',
        title: 'Entrega de Exames',
        subtitle: 'Solicite a entrega de exames concluidos no sistema.',
        variant: 'success',
    },
    {
        icon: 'science',
        title: 'Recebimento de Amostras',
        subtitle: 'Registre o recebimento de amostras para analise.',
        variant: 'primary',
    },
];
