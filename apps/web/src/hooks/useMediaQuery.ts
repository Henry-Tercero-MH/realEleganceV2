import { useSyncExternalStore } from 'react';

/**
 * Suscribe a una media query.
 *
 * Usa `useSyncExternalStore` en vez de `useState + useEffect`: así el primer
 * render ya devuelve el valor correcto y no hay un parpadeo de layout.
 */
export function useMediaQuery(query: string): boolean {
  function subscribe(onChange: () => void) {
    const list = window.matchMedia(query);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }

  function getSnapshot() {
    return window.matchMedia(query).matches;
  }

  // En SSR o en un test sin `matchMedia` asumimos escritorio.
  function getServerSnapshot() {
    return false;
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Puntos de corte de la app, para no repetir la cadena de la query. */
export const useIsMobile = () => useMediaQuery('(max-width: 720px)');
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
