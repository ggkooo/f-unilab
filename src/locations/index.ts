export const UNILAB_LOCATIONS = ['campus', 'centro'] as const;

export type UnilabLocation = (typeof UNILAB_LOCATIONS)[number];

export const DEFAULT_UNILAB_LOCATION: UnilabLocation = 'campus';
export const UNILAB_ROUTE_PREFIX = '/unilab';
export const PUBLIC_LOCATION_QUERY_PARAM = 'location';

const LOCATION_LABELS: Record<UnilabLocation, string> = {
    campus: 'Unilab Campus',
    centro: 'Unilab Centro',
};

export const locationOptions = UNILAB_LOCATIONS.map((location) => ({
    value: location,
    label: LOCATION_LABELS[location],
}));

export const isValidLocation = (value: string): value is UnilabLocation =>
    UNILAB_LOCATIONS.includes(value as UnilabLocation);

export const normalizeLocation = (value?: string | null): UnilabLocation | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const normalizedValue = value.trim().toLowerCase();

    return isValidLocation(normalizedValue) ? normalizedValue : null;
};

export const getLocationLabel = (value?: string | null) => {
    const normalizedValue = normalizeLocation(value);

    return LOCATION_LABELS[normalizedValue ?? DEFAULT_UNILAB_LOCATION];
};

export const buildLocationBasePath = (location: UnilabLocation) => `${UNILAB_ROUTE_PREFIX}/${location}`;

export const buildLocationPath = (location: UnilabLocation, suffix = '') => {
    const normalizedSuffix = suffix.replace(/^\/+/, '');

    return normalizedSuffix.length > 0
        ? `${buildLocationBasePath(location)}/${normalizedSuffix}`
        : buildLocationBasePath(location);
};

export const buildLocationHomePath = (location: UnilabLocation) => buildLocationPath(location);

export const buildLocationTvPath = (location: UnilabLocation) => buildLocationPath(location, 'tv');

export const buildLocationLoginPath = (location: UnilabLocation) => buildLocationPath(location, 'login');

export const buildLocationAttendantPath = (location: UnilabLocation) => buildLocationPath(location, 'attendent');

export const buildLocationAdminPath = (location: UnilabLocation) => buildLocationPath(location, 'admin');

export const withLocationQuery = (path: string, location: UnilabLocation) => {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}${PUBLIC_LOCATION_QUERY_PARAM}=${encodeURIComponent(location)}`;
};
