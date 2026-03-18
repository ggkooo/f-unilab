import React from 'react';
import type { ApiUser } from '../../../services/adminService';
import type { RegisterUserFormState, UserFormState } from '../types';
import { formatDateTime } from '../utils';

interface UsersSectionProps {
    users: ApiUser[];
    selectedUserId: number | null;
    selectedUser: ApiUser | null;
    userForm: UserFormState;
    registerUserForm: RegisterUserFormState;
    usersError: string | null;
    userSuccess: string | null;
    isLoadingUsers: boolean;
    isSavingUser: boolean;
    isCreatingUser: boolean;
    deletingUserId: number | null;
    togglingAdminId: number | null;
    onRefreshUsers: () => Promise<void>;
    onSelectUser: (user: ApiUser) => void;
    onToggleAdmin: (user: ApiUser) => Promise<void>;
    onDeleteUser: (userId: number) => void;
    onSaveUser: (e: React.FormEvent) => Promise<void>;
    onRegisterUser: (e: React.FormEvent) => Promise<void>;
    onRegisterNameChange: (value: string) => void;
    onRegisterLoginChange: (value: string) => void;
    onRegisterPasswordChange: (value: string) => void;
    onRegisterPasswordConfirmationChange: (value: string) => void;
    onNameChange: (value: string) => void;
    onLoginChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onActiveChange: (value: boolean) => void;
    onIsAdminChange: (value: boolean) => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({
    users,
    selectedUserId,
    selectedUser,
    userForm,
    registerUserForm,
    usersError,
    userSuccess,
    isLoadingUsers,
    isSavingUser,
    isCreatingUser,
    deletingUserId,
    togglingAdminId,
    onRefreshUsers,
    onSelectUser,
    onToggleAdmin,
    onDeleteUser,
    onSaveUser,
    onRegisterUser,
    onRegisterNameChange,
    onRegisterLoginChange,
    onRegisterPasswordChange,
    onRegisterPasswordConfirmationChange,
    onNameChange,
    onLoginChange,
    onPasswordChange,
    onActiveChange,
    onIsAdminChange,
}) => {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg lg:p-8">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Usuários</h2>
                    <p className="text-sm text-slate-500">Liste, edite, remova e altere privilégios administrativos.</p>
                </div>
                <button
                    type="button"
                    onClick={() => void onRefreshUsers()}
                    className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                    Atualizar lista
                </button>
            </div>

            {usersError && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{usersError}</div>}
            {userSuccess && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{userSuccess}</div>}

            <div className="grid gap-6">
                <form onSubmit={(event) => void onRegisterUser(event)} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-slate-800">Cadastro de usuário</h3>
                        <p className="text-sm text-slate-500">Crie novos usuários com nome, login, senha e confirmação de senha.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Nome</label>
                            <input
                                type="text"
                                value={registerUserForm.name}
                                onChange={(e) => onRegisterNameChange(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                                placeholder="Ex.: Maria Silva"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Login</label>
                            <input
                                type="text"
                                value={registerUserForm.login}
                                onChange={(e) => onRegisterLoginChange(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                                placeholder="Ex.: maria.silva"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Senha</label>
                            <input
                                type="password"
                                value={registerUserForm.password}
                                onChange={(e) => onRegisterPasswordChange(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                                placeholder="Informe a senha"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Confirmar senha</label>
                            <input
                                type="password"
                                value={registerUserForm.passwordConfirmation}
                                onChange={(e) => onRegisterPasswordConfirmationChange(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                                placeholder="Repita a senha"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isCreatingUser}
                        className="mt-5 w-full rounded-2xl bg-primary px-5 py-4 text-base font-bold text-white shadow-md transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {isCreatingUser ? 'Cadastrando usuário...' : 'Cadastrar usuário'}
                    </button>
                </form>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800">Lista de usuários</h3>
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">{users.length}</span>
                    </div>

                    <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                        {isLoadingUsers && <div className="py-6 text-center text-slate-400 italic">Carregando usuários...</div>}
                        {!isLoadingUsers && users.length === 0 && <div className="py-6 text-center text-slate-400 italic">Nenhum usuário encontrado.</div>}
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className={`rounded-2xl border p-4 transition ${selectedUserId === user.id ? 'border-primary bg-blue-50' : 'border-slate-200 bg-white'}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 text-left">
                                        <div className="truncate text-base font-bold text-slate-800">{user.name}</div>
                                        <div className="truncate text-sm text-slate-500">{user.login}</div>
                                    </div>
                                    <div className="flex flex-wrap justify-end gap-2">
                                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {user.active ? 'Ativo' : 'Inativo'}
                                        </span>
                                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${user.is_admin ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {user.is_admin ? 'Admin' : 'Operador'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onSelectUser(user)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void onToggleAdmin(user)}
                                        disabled={togglingAdminId === user.id}
                                        className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {togglingAdminId === user.id ? 'Salvando...' : user.is_admin ? 'Remover admin' : 'Tornar admin'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDeleteUser(user.id)}
                                        disabled={deletingUserId === user.id}
                                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {deletingUserId === user.id ? 'Removendo...' : 'Remover'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={(event) => void onSaveUser(event)} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-slate-800">Edição de usuário</h3>
                        <p className="text-sm text-slate-500">Selecione um usuário na lista para editar os dados.</p>
                    </div>

                    {selectedUser ? (
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Nome</label>
                                <input
                                    type="text"
                                    value={userForm.name}
                                    onChange={(e) => onNameChange(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Login</label>
                                <input
                                    type="text"
                                    value={userForm.login}
                                    onChange={(e) => onLoginChange(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Nova senha</label>
                                <input
                                    type="password"
                                    value={userForm.password}
                                    onChange={(e) => onPasswordChange(e.target.value)}
                                    placeholder="Preencha apenas se quiser alterar"
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
                                />
                            </div>

                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={userForm.active}
                                    onChange={(e) => onActiveChange(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                                Usuário ativo
                            </label>

                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={userForm.is_admin}
                                    onChange={(e) => onIsAdminChange(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                                Perfil administrador
                            </label>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                <div><span className="font-semibold text-slate-700">Criado em:</span> {formatDateTime(selectedUser.created_at)}</div>
                                <div><span className="font-semibold text-slate-700">Atualizado em:</span> {formatDateTime(selectedUser.updated_at)}</div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSavingUser}
                                className="w-full rounded-2xl bg-primary px-5 py-4 text-base font-bold text-white shadow-md transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {isSavingUser ? 'Salvando alterações...' : 'Salvar alterações'}
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-400">
                            Selecione um usuário para editar.
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
};

export default UsersSection;
