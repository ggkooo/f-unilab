import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { normalizeLocation } from '.';

export const useRouteLocation = () => {
    const { location } = useParams();

    return useMemo(() => normalizeLocation(location), [location]);
};
