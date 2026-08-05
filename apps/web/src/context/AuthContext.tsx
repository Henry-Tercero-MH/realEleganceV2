import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthSession, AuthUser, Role } from '@real-elegance/shared';
import { api } from '@/api';
import { readStorage, writeStorage, removeStorage, STORAGE_KEYS } from '@/lib/storage';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** `true` mientras hay un login/registro en vuelo. */
  isPending: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<AuthUser>;
  logout: () => void;
  /** Comprueba el rol; `admin` pasa por todas las puertas del back-office. */
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Sesión del usuario.
 *
 * Solo guarda **la sesión**, no datos del servidor: los pedidos, las citas y el
 * catálogo del usuario los pide React Query. Aquí solo vive quién es y su token.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    readStorage<AuthSession | null>(STORAGE_KEYS.auth, null),
  );
  const [isPending, setPending] = useState(false);

  const persist = useCallback((next: AuthSession) => {
    setSession(next);
    writeStorage(STORAGE_KEYS.auth, next);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setPending(true);
      try {
        const next = await api.auth.login(email, password);
        persist(next);
        return next.user;
      } finally {
        setPending(false);
      }
    },
    [persist],
  );

  const register = useCallback(
    async (input: { email: string; password: string; firstName: string; lastName: string }) => {
      setPending(true);
      try {
        const next = await api.auth.register(input);
        persist(next);
        return next.user;
      } finally {
        setPending(false);
      }
    },
    [persist],
  );

  const logout = useCallback(() => {
    setSession(null);
    removeStorage(STORAGE_KEYS.auth);
  }, []);

  const hasRole = useCallback(
    (...roles: Role[]) => {
      if (!session) return false;
      if (session.user.role === 'admin') return true;
      return roles.includes(session.user.role);
    },
    [session],
  );

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      isPending,
      login,
      register,
      logout,
      hasRole,
    }),
    [session, isPending, login, register, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return context;
}
