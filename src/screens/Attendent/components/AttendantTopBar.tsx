import React from 'react';

interface AttendantTopBarProps {
    loggedCounter: string;
    queueLength: number;
    onLogout: () => void;
}

const AttendantTopBar: React.FC<AttendantTopBarProps> = ({ loggedCounter, queueLength, onLogout }) => {
    return (
        <div className="bg-white rounded-3xl shadow-md px-4 py-5 lg:px-5 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <label className="text-slate-600 font-semibold">Meu Guiche:</label>
                <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-2 text-base font-bold text-slate-700 border border-slate-200">
                    {loggedCounter}
                </span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-slate-500 font-medium">
                    Fila Total: <span className="text-[#003B71] font-bold">{queueLength}</span>
                </div>
                <button
                    type="button"
                    onClick={onLogout}
                    className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                >
                    Sair
                </button>
            </div>
        </div>
    );
};

export default AttendantTopBar;
