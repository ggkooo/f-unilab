import React from 'react';

interface SummaryCardsProps {
    usersCount: number;
    adminsCount: number;
    videosCount: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ usersCount, adminsCount, videosCount }) => {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg lg:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Resumo</h2>
            <div className="mt-6 grid gap-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Usuários cadastrados</div>
                    <div className="mt-2 text-4xl font-black text-slate-900">{usersCount}</div>
                </div>
                <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
                    <div className="text-sm font-semibold uppercase tracking-wide text-blue-600">Administradores</div>
                    <div className="mt-2 text-4xl font-black text-slate-900">{adminsCount}</div>
                </div>
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                    <div className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Vídeos cadastrados</div>
                    <div className="mt-2 text-4xl font-black text-slate-900">{videosCount}</div>
                </div>
            </div>
        </section>
    );
};

export default SummaryCards;
