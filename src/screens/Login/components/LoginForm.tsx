import React from 'react';

interface LoginFormProps {
    login: string;
    password: string;
    error: string | null;
    isSubmitting: boolean;
    onLoginChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    login,
    password,
    error,
    isSubmitting,
    onLoginChange,
    onPasswordChange,
    onSubmit,
}) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label className="text-slate-600 font-semibold pl-2">Nome de Usuário</label>
                <input
                    type="text"
                    value={login}
                    onChange={(event) => onLoginChange(event.target.value)}
                    placeholder="Digite seu nome de usuário"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-primary focus:bg-white focus:shadow-sm transition-all"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-slate-600 font-semibold pl-2">Senha de Acesso</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => onPasswordChange(event.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-primary focus:bg-white focus:shadow-sm transition-all"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-blue-600 active:scale-[0.98] transition-all w-full text-white font-bold text-lg py-4 rounded-2xl shadow-md mt-2 flex items-center justify-center gap-2.5"
            >
                <span>{isSubmitting ? 'Entrando...' : 'Entrar no Sistema'}</span>
                <span className="material-icons-outlined">login</span>
            </button>
        </form>
    );
};

export default LoginForm;
