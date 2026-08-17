import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { paths } from './paths';
/**
 * Puerta de acceso por rol.
 *
 * Es una comodidad de la interfaz, **no** una medida de seguridad: quien de
 * verdad decide es el `requireRole` del backend. Aquí solo evitamos enseñar
 * pantallas que la persona no va a poder usar.
 */
export function RequireRole({ roles, children }) {
    const { isAuthenticated, hasRole } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) {
        // Guardamos de dónde venía para devolverla ahí tras iniciar sesión.
        return _jsx(Navigate, { to: paths.login, state: { from: location }, replace: true });
    }
    if (roles && !hasRole(...roles)) {
        return _jsx(Navigate, { to: paths.home, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
//# sourceMappingURL=RequireRole.js.map