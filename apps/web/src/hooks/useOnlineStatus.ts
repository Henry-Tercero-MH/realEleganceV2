import { useEffect, useRef, useState } from 'react';

/**
 * Cada cuánto se comprueba de verdad (con el sitio ya conectado). Cuando se
 * detecta sin conexión, se comprueba más seguido (abajo) para notar la
 * vuelta rápido.
 */
const CHECK_INTERVAL_ONLINE_MS = 6_000;
const CHECK_INTERVAL_OFFLINE_MS = 3_000;
const TIMEOUT_MS = 4_000;

/** Pide la portada con `HEAD`: si el navegador no puede completarla, no hay internet de verdad. */
async function probeConnection(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    await fetch('/', { method: 'HEAD', cache: 'no-store', signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * `navigator.onLine` y los eventos `online`/`offline` del navegador solo
 * reflejan si el adaptador de red está activo — no si hay internet de
 * verdad. Es un bug clásico: apagar el wifi en escritorio muchas veces no
 * los actualiza, así que el sitio se seguía viendo "conectado" sin estarlo.
 *
 * Por eso, además de escuchar esos eventos (para reaccionar rápido cuando sí
 * disparan), se comprueba la conexión de verdad pidiendo la portada del
 * sitio cada cierto tiempo — eso es lo que de verdad decide el estado.
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);
  // Evita que una comprobación vieja que responde tarde pise a una más nueva.
  const requestId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function check() {
      const id = ++requestId.current;
      const online = await probeConnection();
      if (cancelled || id !== requestId.current) return;

      setIsOnline(online);
      timer = setTimeout(check, online ? CHECK_INTERVAL_ONLINE_MS : CHECK_INTERVAL_OFFLINE_MS);
    }

    // Los eventos del navegador no son confiables solos, pero cuando sí
    // disparan (p. ej. en móvil, modo avión) conviene comprobar de inmediato
    // en vez de esperar al siguiente intervalo.
    function handleBrowserEvent() {
      clearTimeout(timer);
      check();
    }

    check();
    window.addEventListener('online', handleBrowserEvent);
    window.addEventListener('offline', handleBrowserEvent);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener('online', handleBrowserEvent);
      window.removeEventListener('offline', handleBrowserEvent);
    };
  }, []);

  return isOnline;
}
