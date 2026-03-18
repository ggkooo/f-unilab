import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { clearAuthSession, getAccessToken, getAuthSession } from '../../auth/session';
import {
    deleteAdminUser,
    deleteAdminVideo,
    fetchAdminUsers,
    fetchAdminVideos,
    fetchAttendanceReport,
    registerAdminUser,
    toggleUserAdminRole,
    type ApiUser,
    updateAdminUser,
} from '../../services/adminService';
import AdminHero from './components/AdminHero';
import ConfirmActionDialog from './components/ConfirmActionDialog';
import ReportSection from './components/ReportSection';
import SummaryCards from './components/SummaryCards';
import UsersSection from './components/UsersSection';
import VideosSection from './components/VideosSection';
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

    const [users, setUsers] = useState<ApiUser[]>([]);
    const [videos, setVideos] = useState<{ filename: string; url: string; created_at?: string }[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm);
    const [registerUserForm, setRegisterUserForm] = useState<RegisterUserFormState>(emptyRegisterUserForm);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isLoadingVideos, setIsLoadingVideos] = useState(true);
    const [isSavingUser, setIsSavingUser] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isDownloadingReport, setIsDownloadingReport] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
    const [togglingAdminId, setTogglingAdminId] = useState<number | null>(null);
    const [deletingVideoName, setDeletingVideoName] = useState<string | null>(null);

    const [usersError, setUsersError] = useState<string | null>(null);
    const [videosError, setVideosError] = useState<string | null>(null);
    const [reportError, setReportError] = useState<string | null>(null);
    const [userSuccess, setUserSuccess] = useState<string | null>(null);
    const [reportSuccess, setReportSuccess] = useState<string | null>(null);
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
        setIsLoadingVideos(true);
        setVideosError(null);

        try {
            setVideos(await fetchAdminVideos(accessToken));
        } catch (error) {
            setVideosError(error instanceof Error ? error.message : 'Falha ao buscar vídeos.');
            setVideos([]);
        } finally {
            setIsLoadingVideos(false);
        }
    };

    useEffect(() => {
        void fetchUsers();
        void fetchVideos();
    }, []);

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

    const deleteVideo = async (filename: string) => {
        setDeletingVideoName(filename);
        setVideosError(null);

        try {
            await deleteAdminVideo(filename, accessToken);

            await fetchVideos();
        } catch (error) {
            setVideosError(error instanceof Error ? error.message : 'Falha ao remover vídeo.');
        } finally {
            setDeletingVideoName(null);
        }
    };

    const handleDeleteVideo = (filename: string) => {
        setConfirmDialog({
            title: 'Remover vídeo',
            message: `Deseja realmente remover o vídeo ${filename}? Esta ação não pode ser desfeita.`,
            confirmLabel: 'Remover vídeo',
            onConfirm: async () => {
                await deleteVideo(filename);
            },
        });
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
        clearAuthSession();
        navigate('/login', { replace: true });
    };

    return (
        <Layout contentClassName="mx-auto flex w-[97%] flex-grow flex-col items-center justify-start py-8 sm:w-[95%] md:py-10 lg:w-[92%] xl:w-[90%]">
            <section className="w-full max-w-[112rem]">
                <AdminHero
                    administratorName={currentUser?.name ?? '-'}
                    loginLabel={formatLoginLabel(currentUser?.login ?? '-')}
                    onLogout={handleLogout}
                />

                <div className="grid gap-8 xl:grid-cols-[1.25fr_0.95fr]">
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

                        <VideosSection
                            videos={videos}
                            videosError={videosError}
                            isLoadingVideos={isLoadingVideos}
                            deletingVideoName={deletingVideoName}
                            onRefreshVideos={fetchVideos}
                            onDeleteVideo={handleDeleteVideo}
                        />
                    </div>

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

                        <SummaryCards
                            usersCount={users.length}
                            adminsCount={users.filter((item) => item.is_admin).length}
                            videosCount={videos.length}
                        />
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