import React from 'react';
import type { FeedbackType } from '../types';

type GetTicketFeedbackProps = {
    message: string;
    type: Exclude<FeedbackType, null>;
};

const GetTicketFeedback: React.FC<GetTicketFeedbackProps> = ({ message, type }) => {
    return (
        <div
            className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold sm:text-base ${type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
                }`}
        >
            {message}
        </div>
    );
};

export default GetTicketFeedback;
