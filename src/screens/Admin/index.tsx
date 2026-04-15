import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { clearAuthSession, getAccessToken, getAuthSession } from '../../auth/session';
import { buildLocationLoginPath } from '../../locations';
import {
    deleteAdminUser,
    fetchAdminUsers,
    fetchAdminVideos,
    fetchAttendanceReport,
    fetchPrinterSettings,
    registerAdminUser,
    savePrinterSettings,
    toggleUserAdminRole,
    type ApiUser,
    type PrinterConnectionType,
    updateAdminUser,
} from '../../services/adminService';
import AdminHero from './components/AdminHero';
import ConfirmActionDialog from './components/ConfirmActionDialog';
import ReportSection from './components/ReportSection';
import SummaryCards from './components/SummaryCards';
import PrinterSettingsCard from './components/PrinterSettingsCard';
import UsersSection from './components/UsersSection';
import { createAttendanceReportPdf } from './reportPdf';
import {
    emptyRegisterUserForm,
    emptyUserForm,
    type ConfirmDialogConfig,
    type RegisterUserFormState,
    type UserFormState,
} from './types';
import { formatLoginLabel } from './utils';

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const authSession = getAuthSession();
    const currentUser = authSession?.data.user;
    const accessToken = getAccessToken() ?? undefined;
    const isSuperAdmin = currentUser?.is_super_admin ?? false;
    const hasAdminPanelAccess = Boolean(currentUser?.is_admin || currentUser?.is_super_admin);

    const [users, setUsers] = useState<ApiUser[]>([]);
    const [videos, setVideos] = useState<{ filename: string; url: string; created_at?: string }[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm);
    const [registerUserForm, setRegisterUserForm] = useState<RegisterUserFormState>(emptyRegisterUserForm);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [printerForm, setPrinterForm] = useState({
        enabled: true,
        connectionType: 'network' as PrinterConnectionType,
        host: '',
        port: '9100',
        sharePath: '',
        profile: 'simple',
        header: 'SENHA DE ATENDIMENTO',
    });

    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isSavingUser, setIsSavingUser] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isDownloadingReport, setIsDownloadingReport] = useState(false);
    const [isLoadingPrinterSettings, setIsLoadingPrinterSettings] = useState(false);
    const [isSavingPrinterSettings, setIsSavingPrinterSettings] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
    const [togglingAdminId, setTogglingAdminId] = useState<number | null>(null);

    const [usersError, setUsersError] = useState<string | null>(null);
    const [reportError, setReportError] = useState<string | null>(null);
    const [printerError, setPrinterError] = useState<string | null>(null);
    const [userSuccess, setUserSuccess] = useState<string | null>(null);
    const [reportSuccess, setReportSuccess] = useState<string | null>(null);
    const [printerSuccess, setPrinterSuccess] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogConfig | null>(null);
    const [isConfirmingAction, setIsConfirmingAction] = useState(false);

    const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;

    const syncUserForm = (user: ApiUser | null) => {
        if (!user) {
            setUserForm(emptyUserForm);
            return;
        }

        setUserForm({
            name: user.name,
            login: user.login,
            password: '',
            active: user.active,
            is_admin: user.is_admin,
        });
    };

    const fetchUsers = async () => {
        if (!isSuperAdmin) {
            return;
        }

        setIsLoadingUsers(true);
        setUsersError(null);

        try {
            const parsedUsers = await fetchAdminUsers(accessToken);
            setUsers(parsedUsers);

            if (parsedUsers.length === 0) {
                setSelectedUserId(null);
                syncUserForm(null);
                return;
            }

            if (selectedUserId === null) {
                setSelectedUserId(parsedUsers[0].id);
                syncUserForm(parsedUsers[0]);
                return;
            }

            const updatedUser = parsedUsers.find((item) => item.id === selectedUserId) ?? null;

            if (!updatedUser) {
                setSelectedUserId(parsedUsers[0].id);
                syncUserForm(parsedUsers[0]);
                return;
            }

            syncUserForm(updatedUser);
        } catch (error) {
            setUsersError(error instanceof Error ? error.message : 'Falha ao buscar usuários.');
            setUsers([]);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const fetchVideos = async () => {
        if (!isSuperAdmin) {
            return;
        }

        try {
            setVideos(await fetchAdminVideos(accessToken));
        } catch {
            setVideos([]);
        }
    };

    const refreshPrinterSettings = async () => {
        if (!isSuperAdmin) {
            return;
        }

        setIsLoadingPrinterSettings(true);
        setPrinterError(null);

        try {
            const settings = await fetchPrinterSettings(accessToken);

            setPrinterForm({
                enabled: settings.enabled ?? true,
                connectionType: settings.connection_type ?? 'network',
                host: settings.host ?? '',
                port: String(settings.port ?? 9100),
                sharePath: settings.share_path ?? '',
                profile: settings.profile ?? 'simple',
                header: settings.header ?? 'SENHA DE ATENDIMENTO',
            });
        } catch (error) {
            setPrinterError(error instanceof Error ? error.message : 'Falha ao carregar configuracao da impressora.');
        } finally {
            setIsLoadingPrinterSettings(false);
        }
    };

    useEffect(() => {
        if (!hasAdminPanelAccess) {
            return;
        }

        if (isSuperAdmin) {
            void fetchUsers();
            void fetchVideos();
            void refreshPrinterSettings();
            return;
        }

        setUsers([]);
        setVideos([]);
        setSelectedUserId(null);
        syncUserForm(null);
        setRegisterUserForm(emptyRegisterUserForm);
        setIsLoadingUsers(false);
    }, [hasAdminPanelAccess, isSuperAdmin]);

    const handlePrinterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setPrinterError(null);
        setPrinterSuccess(null);

        if (printerForm.connectionType === 'network' && !printerForm.host.trim()) {
            setPrinterError('Host e obrigatorio para impressora de rede.');
            return;
        }

        if (printerForm.connectionType === 'shared_windows' && !printerForm.sharePath.trim()) {
            setPrinterError('share_path e obrigatorio para impressora compartilhada no Windows.');
            return;
        }

        const normalizedPort = Number(printerForm.port || '9100');

        if (printerForm.connectionType === 'network' && (!Number.isFinite(normalizedPort) || normalizedPort <= 0)) {
            setPrinterError('Informe uma porta valida para impressora de rede.');
            return;
        }

        setIsSavingPrinterSettings(true);

        try {
            const saved = await savePrinterSettings(
                {
                    enabled: printerForm.enabled,
                    connection_type: printerForm.connectionType,
                    host: printerForm.connectionType === 'network' ? printerForm.host.trim() : undefined,
                    port: printerForm.connectionType === 'network' ? normalizedPort : undefined,
                    share_path: printerForm.connectionType === 'shared_windows' ? printerForm.sharePath.trim() : undefined,
                    profile: printerForm.profile.trim() || 'simple',
                    header: printerForm.header.trim() || 'SENHA DE ATENDIMENTO',
                },
                accessToken,
            );

            setPrinterForm({
                enabled: saved.enabled ?? printerForm.enabled,
                connectionType: saved.connection_type ?? printerForm.connectionType,
                host: saved.host ?? '',
                port: String(saved.port ?? 9100),
                sharePath: saved.share_path ?? '',
                profile: saved.profile ?? 'simple',
                header: saved.header ?? 'SENHA DE ATENDIMENTO',
            });

            setPrinterSuccess('Configuracao da impressora salva com sucesso.');
        } catch (error) {
            setPrinterError(error instanceof Error ? error.message : 'Falha ao salvar configuracao da impressora.');
        } finally {
            setIsSavingPrinterSettings(false);
        }
    };

    const handleSelectUser = (user: ApiUser) => {
        setSelectedUserId(user.id);
        setUsersError(null);
        setUserSuccess(null);
        syncUserForm(user);
    };

    const handleUserFieldChange = <K extends keyof UserFormState>(field: K, value: UserFormState[K]) => {
        setUserForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleRegisterFieldChange = <K extends keyof RegisterUserFormState>(field: K, value: RegisterUserFormState[K]) => {
        setRegisterUserForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleRegisterUser = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = registerUserForm.name.trim();
        const trimmedLogin = registerUserForm.login.trim();

        if (!trimmedName || !trimmedLogin || !registerUserForm.password || !registerUserForm.passwordConfirmation) {
            setUsersError('Preencha nome, login, senha e confirmação de senha para cadastrar o usuário.');
            return;
        }

        if (registerUserForm.password !== registerUserForm.passwordConfirmation) {
            setUsersError('A confirmação de senha não confere.');
            return;
        }

        setIsCreatingUser(true);
        setUsersError(null);
        setUserSuccess(null);

        try {
            await registerAdminUser(
                {
                    name: trimmedName,
                    login: trimmedLogin,
                    password: registerUserForm.password,
                    password_confirmation: registerUserForm.passwordConfirmation,
                },
                accessToken,
            );

            setRegisterUserForm(emptyRegisterUserForm);
            setUserSuccess('Usuário cadastrado com sucesso.');
            await fetchUsers();
        } catch (error) {
            setUsersError(error instanceof Error ? error.message : 'Falha ao cadastrar usuário.');
        } finally {
            setIsCreatingUser(false);
        }
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUserId) {
            setUsersError('Selecione um usuário para editar.');
            return;
        }

        setIsSavingUser(true);
        setUsersError(null);
        setUserSuccess(null);

        try {
            const payload: {
                name: string;
                login: string;
                active: boolean;
                is_admin: boolean;
                password?: string;
            } = {
                name: userForm.name,
                login: userForm.login,
                active: userForm.active,
                is_admin: userForm.is_admin,
            };

            if (userForm.password.trim()) {
                payload.password = userForm.password;
            }

            await updateAdminUser(selectedUserId, payload, accessToken);

            setUserSuccess('Usuário atualizado com sucesso.');
            await fetchUsers();
        } catch (error) {
            setUsersError(error instanceof Error ? error.message : 'Falha ao salvar usuário.');
        } finally {
            setIsSavingUser(false);
        }
    };

    const deleteUser = async (userId: number) => {
        setDeletingUserId(userId);
        setUsersError(null);
        setUserSuccess(null);

        try {
            await deleteAdminUser(userId, accessToken);

            if (selectedUserId === userId) {
                setSelectedUserId(null);
                syncUserForm(null);
            }

            setUserSuccess('Usuário removido com sucesso.');
            await fetchUsers();
        } catch (error) {
            setUsersError(error instanceof Error ? error.message : 'Falha ao remover usuário.');
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleDeleteUser = (userId: number) => {
        setConfirmDialog({
            title: 'Remover usuário',
            message: 'Deseja realmente remover este usuário? Esta ação não pode ser desfeita.',
            confirmLabel: 'Remover usuário',
            onConfirm: async () => {
                await deleteUser(userId);
            },
        });
    };

    const handleToggleAdmin = async (user: ApiUser) => {
        setTogglingAdminId(user.id);
        setUsersError(null);
        setUserSuccess(null);

        try {
            await toggleUserAdminRole(user, accessToken);

            setUserSuccess(!user.is_admin ? 'Usuário promovido para administrador.' : 'Perfil administrativo removido.');
            await fetchUsers();
        } catch (error) {
            setUsersError(error instanceof Error ? error.message : 'Falha ao alterar perfil administrativo.');
        } finally {
            setTogglingAdminId(null);
        }
    };

    const handleCloseConfirmDialog = () => {
        if (isConfirmingAction) {
            return;
        }

        setConfirmDialog(null);
    };

    const handleConfirmDialog = async () => {
        if (!confirmDialog) {
            return;
        }

        setIsConfirmingAction(true);

        try {
            await confirmDialog.onConfirm();
        } finally {
            setIsConfirmingAction(false);
            setConfirmDialog(null);
        }
    };

    const handleDownloadReport = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setReportError('Informe a data inicial e a data final.');
            return;
        }

        setIsDownloadingReport(true);
        setReportError(null);
        setReportSuccess(null);

        try {
            const reportData = await fetchAttendanceReport(startDate, endDate, accessToken);

            createAttendanceReportPdf(reportData);
            setReportSuccess('PDF gerado com sucesso.');
        } catch (error) {
            setReportError(error instanceof Error ? error.message : 'Falha ao gerar PDF.');
        } finally {
            setIsDownloadingReport(false);
        }
    };

    const handleLogout = () => {
        const nextLoginPath = buildLocationLoginPath(currentUser?.location ?? 'campus');
        clearAuthSession();
        navigate(nextLoginPath, { replace: true });
    };

    return (
        <Layout contentClassName="mx-auto flex w-[97%] flex-grow flex-col items-center justify-start py-8 sm:w-[95%] md:py-10 lg:w-[92%] xl:w-[90%]">
            <section className="w-full max-w-[112rem]">
                <AdminHero
                    administratorName={currentUser?.name ?? '-'}
                    loginLabel={formatLoginLabel(currentUser?.login ?? '-')}
                    canManage={isSuperAdmin}
                    onLogout={handleLogout}
                />

                <div className={`grid gap-8 ${isSuperAdmin ? 'xl:grid-cols-[1.25fr_0.95fr]' : 'xl:grid-cols-1'}`}>
                    {isSuperAdmin ? (
                        <div className="flex flex-col gap-8">
                            <UsersSection
                                users={users}
                                selectedUserId={selectedUserId}
                                selectedUser={selectedUser}
                                userForm={userForm}
                                registerUserForm={registerUserForm}
                                usersError={usersError}
                                userSuccess={userSuccess}
                                isLoadingUsers={isLoadingUsers}
                                isSavingUser={isSavingUser}
                                isCreatingUser={isCreatingUser}
                                deletingUserId={deletingUserId}
                                togglingAdminId={togglingAdminId}
                                onRefreshUsers={fetchUsers}
                                onSelectUser={handleSelectUser}
                                onToggleAdmin={handleToggleAdmin}
                                onDeleteUser={handleDeleteUser}
                                onSaveUser={handleSaveUser}
                                onRegisterUser={handleRegisterUser}
                                onRegisterNameChange={(value) => handleRegisterFieldChange('name', value)}
                                onRegisterLoginChange={(value) => handleRegisterFieldChange('login', value)}
                                onRegisterPasswordChange={(value) => handleRegisterFieldChange('password', value)}
                                onRegisterPasswordConfirmationChange={(value) => handleRegisterFieldChange('passwordConfirmation', value)}
                                onNameChange={(value) => handleUserFieldChange('name', value)}
                                onLoginChange={(value) => handleUserFieldChange('login', value)}
                                onPasswordChange={(value) => handleUserFieldChange('password', value)}
                                onActiveChange={(value) => handleUserFieldChange('active', value)}
                                onIsAdminChange={(value) => handleUserFieldChange('is_admin', value)}
                            />
                        </div>
                    ) : (
                        <div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-6 text-slate-700 shadow-sm lg:p-8">
                            <h2 className="text-xl font-bold text-slate-900">Acesso de consulta</h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 lg:text-base">
                                Seu perfil de administrador permite apenas consulta e exportacao de relatorios.
                                Funcoes de gestao de usuarios e configuracoes ficam disponiveis apenas para superadministrador.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-8">
                        <ReportSection
                            startDate={startDate}
                            endDate={endDate}
                            reportError={reportError}
                            reportSuccess={reportSuccess}
                            isDownloadingReport={isDownloadingReport}
                            onStartDateChange={setStartDate}
                            onEndDateChange={setEndDate}
                            onDownloadReport={handleDownloadReport}
                        />

                        {isSuperAdmin ? (
                            <PrinterSettingsCard
                                form={printerForm}
                                isLoading={isLoadingPrinterSettings}
                                isSaving={isSavingPrinterSettings}
                                successMessage={printerSuccess}
                                errorMessage={printerError}
                                onEnabledChange={(value) => setPrinterForm((prev) => ({ ...prev, enabled: value }))}
                                onConnectionTypeChange={(value) => setPrinterForm((prev) => ({ ...prev, connectionType: value }))}
                                onHostChange={(value) => setPrinterForm((prev) => ({ ...prev, host: value }))}
                                onPortChange={(value) => setPrinterForm((prev) => ({ ...prev, port: value }))}
                                onSharePathChange={(value) => setPrinterForm((prev) => ({ ...prev, sharePath: value }))}
                                onProfileChange={(value) => setPrinterForm((prev) => ({ ...prev, profile: value }))}
                                onHeaderChange={(value) => setPrinterForm((prev) => ({ ...prev, header: value }))}
                                onSubmit={handlePrinterSubmit}
                                onReload={refreshPrinterSettings}
                            />
                        ) : null}

                        {isSuperAdmin ? (
                            <SummaryCards
                                usersCount={users.length}
                                adminsCount={users.filter((item) => item.is_admin).length}
                                videosCount={videos.length}
                            />
                        ) : null}
                    </div>
                </div>
            </section>

            <ConfirmActionDialog
                dialog={confirmDialog}
                isConfirmingAction={isConfirmingAction}
                onClose={handleCloseConfirmDialog}
                onConfirm={handleConfirmDialog}
            />
        </Layout>
    );
};

export default Admin;