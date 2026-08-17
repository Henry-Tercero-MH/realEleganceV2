import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ToastViewport } from '@/components/ui/Toast';
import { randomId } from '@/lib/id';
const ToastContext = createContext(null);
/**
 * Avisos efímeros. Es estado de cliente puro (no viene del servidor), así que
 * Context es el sitio correcto.
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());
    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((item) => item.id !== id));
        const timer = timers.current.get(id);
        if (timer) {
            window.clearTimeout(timer);
            timers.current.delete(id);
        }
    }, []);
    const toast = useCallback(({ title, description, tone = 'info', duration = 5000, action }) => {
        const id = randomId('toast');
        setToasts((current) => [...current, { id, tone, title, description, action }]);
        if (duration > 0) {
            timers.current.set(id, window.setTimeout(() => dismiss(id), duration));
        }
        return id;
    }, [dismiss]);
    const success = useCallback((title, description) => toast({ title, description, tone: 'success' }), [toast]);
    const error = useCallback(
    // Los errores duran más: hay que poder leerlos y actuar.
    (title, description) => toast({ title, description, tone: 'error', duration: 8000 }), [toast]);
    const value = useMemo(() => ({ toast, success, error, dismiss }), [toast, success, error, dismiss]);
    return (_jsxs(ToastContext.Provider, { value: value, children: [children, _jsx(ToastViewport, { toasts: toasts, onDismiss: dismiss })] }));
}
export function useToast() {
    const context = useContext(ToastContext);
    if (!context)
        throw new Error('useToast debe usarse dentro de <ToastProvider>.');
    return context;
}
//# sourceMappingURL=ToastContext.js.map