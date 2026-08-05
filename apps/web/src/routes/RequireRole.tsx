import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Role } from '@real-elegance/shared';
import { useAuth } from '@/context/AuthContext';
import { paths } from './paths';

interface RequireRoleProps {
  /** Roles admitidos. `admin` siempre pasa (lo resuelve `hasRole`). */
  roles?: Role[];
  children: ReactNode;
}

/**
 * Puerta de acceso por rol.
 *
 * Es una comodidad de la interfaz, **no** una medida de seguridad: quien de
 * verdad decide es el `requireRole` del backend. Aquí solo evitamos enseñar
 * pantallas que la persona no va a poder usar.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Guardamos de dónde venía para devolverla ahí tras iniciar sesión.
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  }

  if (roles && !hasRole(...roles)) {
    return <Navigate to={paths.home} replace />;
  }

  return <>{children}</>;
}
