import React from 'react';
import { Navigate } from 'react-router-dom';
import { clearAuthSession, getAuthSession, hasAdminAccess } from '../../auth/session';
import {
    DEFAULT_UNILAB_LOCATION,
    buildLocationAttendantPath,
    buildLocationLoginPath,
} from '../../locations';
import { useRouteLocation } from '../../locations/useRouteLocation';

interface ProtectedRouteProps {
    children: React.ReactElement;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const authSession = getAuthSession();
    const routeLocation = useRouteLocation();
    const loginPath = buildLocationLoginPath(routeLocation ?? DEFAULT_UNILAB_LOCATION);
    const attendantPath = buildLocationAttendantPath(routeLocation ?? DEFAULT_UNILAB_LOCATION);

    if (!authSession?.data?.access_token) {
        return <Navigate to={loginPath} replace />;
    }

    if (!authSession.data.user.location || (routeLocation && authSession.data.user.location !== routeLocation)) {
        clearAuthSession();
        return <Navigate to={loginPath} replace />;
    }

    if (requireAdmin && !hasAdminAccess()) {
        return <Navigate to={attendantPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
