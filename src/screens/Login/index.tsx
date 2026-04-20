import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { getAuthSession, setAuthSession } from '../../auth/session';
import {
    DEFAULT_UNILAB_LOCATION,
    buildLocationAdminPath,
    buildLocationAttendantPath,
} from '../../locations';
import { useRouteLocation } from '../../locations/useRouteLocation';
import { loginWithCredentials } from '../../services/authService';
import LoginCard from './components/LoginCard';
import LoginForm from './components/LoginForm';

const getPostLoginPath = (location: NonNullable<ReturnType<typeof useRouteLocation>>, isAdmin: boolean) => (
    isAdmin ? buildLocationAdminPath(location) : buildLocationAttendantPath(location)
);

const Login: React.FC = () => {
    const navigate = useNavigate();
    const routeLocation = useRouteLocation();
    const activeLocation = routeLocation ?? DEFAULT_UNILAB_LOCATION;
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const authSession = getAuthSession();

        if (authSession?.data?.access_token) {
            navigate(
                getPostLoginPath(
                    authSession.data.user.location,
                    authSession.data.user.is_admin || authSession.data.user.is_super_admin,
                ),
                { replace: true },
            );
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!login || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const sessionData = await loginWithCredentials({ login, password, location: activeLocation });
            setAuthSession(sessionData);
            navigate(
                getPostLoginPath(
                    sessionData.data.user.location,
                    sessionData.data.user.is_admin || sessionData.data.user.is_super_admin,
                ),
            );
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Erro ao realizar login.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout contentClassName="mx-auto flex w-[94%] flex-grow items-center justify-center py-4 sm:w-[90%] lg:w-[78%] xl:w-[70%]">
            <div className="w-full max-w-[460px] animate-fade-in-up">
                <LoginCard>
                    <LoginForm
                        login={login}
                        password={password}
                        error={error}
                        isSubmitting={isSubmitting}
                        onLoginChange={setLogin}
                        onPasswordChange={setPassword}
                        onSubmit={handleLogin}
                    />
                </LoginCard>
            </div>
        </Layout>
    );
};

export default Login;
