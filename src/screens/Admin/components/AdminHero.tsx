import React from 'react';

interface AdminHeroProps {
    administratorName: string;
    loginLabel: string;
    onLogout: () => void;
}

const AdminHero: React.FC<AdminHeroProps> = ({ administratorName, loginLabel, onLogout }) => {
    return (
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl lg:p-10">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-slate-600">
                        Administracao
                    </span>
                    <h1 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">Painel Administrativo</h1>
                    <p className="mt-2 max-w-3xl text-base text-slate-500 lg:text-lg">
                        Gerencie usuarios, videos institucionais e exportacoes em PDF sem sair da aplicacao.
                    </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-slate-700">
                    <div><span className="font-semibold text-slate-900">Administrador:</span> {administratorName}</div>
                    <div><span className="font-semibold text-slate-900">Login:</span> {loginLabel}</div>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="mt-3 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminHero;
