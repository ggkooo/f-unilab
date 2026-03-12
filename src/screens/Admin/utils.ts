export const formatLoginLabel = (value: string): string => {
    return value.replace(/_/g, ' ').replace(/^guiche\b/i, 'Guiche');
};

export const formatDateTime = (value?: string): string => {
    if (!value) {
        return '-';
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return '-';
    }

    return parsed.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
