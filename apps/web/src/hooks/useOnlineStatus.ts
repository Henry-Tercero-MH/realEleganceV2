import { useEffect, useRef, useState } from 'react';

/**
 * Cada cuánto se comprueba de verdad estando en línea. Al sospechar que no
 * hay conexión se reintenta más seguido (para confirmar rápido) y, una vez
 * confirmado offline, para notar la vuelta rápido también.
 */
const CHECK_INTERVAL_ONLINE_MS = 8_000;
const RETRY_MS = 2_500;
const CHECK_INTERVAL_OFFLINE_MS = 3_000;
const TIMEOUT_MS = 6_000;
/** Cuántas veces debe fallar SEGUIDAS antes de dar por sentado que no hay
 * internet — un solo intento lento (compitiendo con la carga inicial de la
 * página, por ejemplo) no debe bastar para mostrar la pantalla de "sin
 * conexión" con internet de verdad. */
const FAILURES_BEFORE_OFFLINE = 2;

/** Pide la portada: si el navegador no puede completarla, no hay internet de verdad. */
async function probeConnection(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // GET, no HEAD: algunos hosts/CDN (Vercel con *rewrites* incluido) no
    // tratan HEAD igual de bien en todas las rutas.
    await fetch('/', { method: 'GET', cache: 'no-store', signal: controller.signal });
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
 * sitio cada cierto tiempo. Pero un solo intento fallido no basta —eso
 * causaba falsos positivos (la pantalla de "sin conexión" aparecía con
 * internet de verdad, por un intento lento nada más)—, así que hace falta
 * que falle `FAILURES_BEFORE_OFFLINE` veces seguidas para darlo por offline.
 * Un solo éxito, en cambio, restaura el estado "en línea" de inmediato.
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);
  // Evita que una comprobación vieja que responde tarde pise a una más nueva.
  const requestId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let consecutiveFailures = 0;

    async function check() {
      const id = ++requestId.current;
      const reachable = await probeConnection();
      if (cancelled || id !== requestId.current) return;

      if (reachable) {
        consecutiveFailures = 0;
        setIsOnline(true);
        timer = setTimeout(check, CHECK_INTERVAL_ONLINE_MS);
        return;
      }

      consecutiveFailures += 1;
      if (consecutiveFailures < FAILURES_BEFORE_OFFLINE) {
        // Podría ser un intento suelto lento: se reintenta pronto antes de
        // darlo por offline de verdad.
        timer = setTimeout(check, RETRY_MS);
        return;
      }

      setIsOnline(false);
      timer = setTimeout(check, CHECK_INTERVAL_OFFLINE_MS);
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
