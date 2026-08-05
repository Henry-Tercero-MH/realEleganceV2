import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ToastViewport } from '@/components/ui/Toast';
import type { ToastData, ToastTone } from '@/components/ui/Toast';
import { randomId } from '@/lib/id';

interface ToastInput {
  title: string;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milisegundos antes de desaparecer solo. `0` lo deja fijo. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toast: (input: ToastInput) => string;
  success: (title: string, description?: ReactNode) => string;
  error: (title: string, description?: ReactNode) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Avisos efímeros. Es estado de cliente puro (no viene del servidor), así que
 * Context es el sitio correcto.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    ({ title, description, tone = 'info', duration = 5000, action }: ToastInput) => {
      const id = randomId('toast');
      setToasts((current) => [...current, { id, tone, title, description, action }]);

      if (duration > 0) {
        timers.current.set(
          id,
          window.setTimeout(() => dismiss(id), duration),
        );
      }
      return id;
    },
    [dismiss],
  );

  const success = useCallback(
    (title: string, description?: ReactNode) => toast({ title, description, tone: 'success' }),
    [toast],
  );

  const error = useCallback(
    // Los errores duran más: hay que poder leerlos y actuar.
    (title: string, description?: ReactNode) =>
      toast({ title, description, tone: 'error', duration: 8000 }),
    [toast],
  );

  const value = useMemo(
    () => ({ toast, success, error, dismiss }),
    [toast, success, error, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast debe usarse dentro de <ToastProvider>.');
  return context;
}
