import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '@/api';
import { readStorage, writeStorage, removeStorage, STORAGE_KEYS } from '@/lib/storage';
const AuthContext = createContext(null);
/**
 * Sesión del usuario.
 *
 * Solo guarda **la sesión**, no datos del servidor: los pedidos, las citas y el
 * catálogo del usuario los pide React Query. Aquí solo vive quién es y su token.
 */
export function AuthProvider({ children }) {
    const [session, setSession] = useState(() => readStorage(STORAGE_KEYS.auth, null));
    const [isPending, setPending] = useState(false);
    const persist = useCallback((next) => {
        setSession(next);
        writeStorage(STORAGE_KEYS.auth, next);
    }, []);
    const login = useCallback(async (email, password) => {
        setPending(true);
        try {
            const next = await api.auth.login(email, password);
            persist(next);
            return next.user;
        }
        finally {
            setPending(false);
        }
    }, [persist]);
    const register = useCallback(async (input) => {
        setPending(true);
        try {
            const next = await api.auth.register(input);
            persist(next);
            return next.user;
        }
        finally {
            setPending(false);
        }
    }, [persist]);
    const logout = useCallback(() => {
        setSession(null);
        removeStorage(STORAGE_KEYS.auth);
    }, []);
    const hasRole = useCallback((...roles) => {
        if (!session)
            return false;
        if (session.user.role === 'admin')
            return true;
        return roles.includes(session.user.role);
    }, [session]);
    const value = useMemo(() => ({
        user: session?.user ?? null,
        isAuthenticated: Boolean(session),
        isPending,
        login,
        register,
        logout,
        hasRole,
    }), [session, isPending, login, register, logout, hasRole]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
    return context;
}
//# sourceMappingURL=AuthContext.js.map