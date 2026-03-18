export type ServiceOption = {
    icon: string;
    title: string;
    subtitle: string;
    variant: 'primary' | 'success' | 'warning';
    fullWidth?: boolean;
    badges?: Array<{
        icon?: string;
        imageSrc?: string;
        label: string;
    }>;
};

export type FeedbackType = 'success' | 'error' | null;
