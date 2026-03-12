import React from 'react';

interface ReportSectionProps {
    startDate: string;
    endDate: string;
    reportError: string | null;
    reportSuccess: string | null;
    isDownloadingReport: boolean;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onDownloadReport: (e: React.FormEvent) => Promise<void>;
}

const ReportSection: React.FC<ReportSectionProps> = ({
    startDate,
    endDate,
    reportError,
    reportSuccess,
    isDownloadingReport,
    onStartDateChange,
    onEndDateChange,
    onDownloadReport,
}) => {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg lg:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Exportacao de dados</h2>
            <p className="mt-2 text-sm text-slate-500">Informe um periodo para gerar e baixar o PDF com as informacoes.</p>

            {reportError && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{reportError}</div>}
            {reportSuccess && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{reportSuccess}</div>}

            <form onSubmit={(event) => void onDownloadReport(event)} className="mt-6 space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Data inicial</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Data final</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isDownloadingReport}
                    className="w-full rounded-2xl bg-slate-900 px-5 py-4 text-base font-bold text-white shadow-md transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isDownloadingReport ? 'Gerando PDF...' : 'Baixar PDF do periodo'}
                </button>
            </form>
        </section>
    );
};

export default ReportSection;
