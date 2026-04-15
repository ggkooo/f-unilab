import React from 'react';
import type { PrinterConnectionType } from '../../../services/adminService';

type PrinterFormState = {
    enabled: boolean;
    connectionType: PrinterConnectionType;
    host: string;
    port: string;
    sharePath: string;
    profile: string;
    header: string;
};

interface PrinterSettingsCardProps {
    form: PrinterFormState;
    isLoading: boolean;
    isSaving: boolean;
    successMessage: string | null;
    errorMessage: string | null;
    onEnabledChange: (value: boolean) => void;
    onConnectionTypeChange: (value: PrinterConnectionType) => void;
    onHostChange: (value: string) => void;
    onPortChange: (value: string) => void;
    onSharePathChange: (value: string) => void;
    onProfileChange: (value: string) => void;
    onHeaderChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onReload: () => Promise<void>;
}

const PrinterSettingsCard: React.FC<PrinterSettingsCardProps> = ({
    form,
    isLoading,
    isSaving,
    successMessage,
    errorMessage,
    onEnabledChange,
    onConnectionTypeChange,
    onHostChange,
    onPortChange,
    onSharePathChange,
    onProfileChange,
    onHeaderChange,
    onSubmit,
    onReload,
}) => {
    const isNetwork = form.connectionType === 'network';

    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg lg:p-8">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Configuracao de impressora</h2>
                    <p className="text-sm text-slate-500">Defina o modo de conexao e os parametros obrigatorios para impressao.</p>
                </div>
                <button
                    type="button"
                    onClick={() => void onReload()}
                    disabled={isLoading}
                    className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? 'Atualizando...' : 'Atualizar'}
                </button>
            </div>

            {errorMessage ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</div> : null}
            {successMessage ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{successMessage}</div> : null}

            <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    <input
                        type="checkbox"
                        checked={form.enabled}
                        onChange={(e) => onEnabledChange(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300"
                    />
                    Impressao habilitada
                </label>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Tipo de conexao</label>
                    <select
                        value={form.connectionType}
                        onChange={(e) => onConnectionTypeChange(e.target.value as PrinterConnectionType)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                    >
                        <option value="network">Impressora de rede</option>
                        <option value="shared_windows">Impressora compartilhada Windows</option>
                    </select>
                </div>

                {isNetwork ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Host</label>
                            <input
                                type="text"
                                value={form.host}
                                onChange={(e) => onHostChange(e.target.value)}
                                placeholder="Ex.: 10.0.0.25"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Porta</label>
                            <input
                                type="number"
                                value={form.port}
                                onChange={(e) => onPortChange(e.target.value)}
                                placeholder="9100"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Caminho UNC (share_path)</label>
                        <input
                            type="text"
                            value={form.sharePath}
                            onChange={(e) => onSharePathChange(e.target.value)}
                            placeholder="\\\\200.132.194.29\\EPSON-TM-T20X"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                        />
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Profile</label>
                        <input
                            type="text"
                            value={form.profile}
                            onChange={(e) => onProfileChange(e.target.value)}
                            placeholder="simple"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Header</label>
                        <input
                            type="text"
                            value={form.header}
                            onChange={(e) => onHeaderChange(e.target.value)}
                            placeholder="SENHA DE ATENDIMENTO"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full rounded-2xl bg-slate-900 px-5 py-4 text-base font-bold text-white shadow-md transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isSaving ? 'Salvando configuracao...' : 'Salvar configuracao da impressora'}
                </button>
            </form>
        </section>
    );
};

export default PrinterSettingsCard;
