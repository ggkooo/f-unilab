import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthSession, isAdminUser } from '../../auth/session';

interface ProtectedRouteProps {
    children: React.ReactElement;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const authSession = getAuthSession();

    if (!authSession?.data?.access_token) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdminUser()) {
        return <Navigate to="/atendente" replace />;
    }

    return children;
};

export default ProtectedRoute;
