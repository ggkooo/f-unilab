import React from 'react';
import { Navigate } from 'react-router-dom';
import { DEFAULT_UNILAB_LOCATION, buildLocationHomePath } from '.';
import { useRouteLocation } from './useRouteLocation';

interface LocationRouteGuardProps {
    children: React.ReactElement;
}

const LocationRouteGuard: React.FC<LocationRouteGuardProps> = ({ children }) => {
    const routeLocation = useRouteLocation();

    if (!routeLocation) {
        return <Navigate to={buildLocationHomePath(DEFAULT_UNILAB_LOCATION)} replace />;
    }

    return children;
};

export default LocationRouteGuard;