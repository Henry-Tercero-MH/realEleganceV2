import { useEffect } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function focusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

/**
 * Atrapa el foco dentro de un contenedor mientras está activo (modales, drawer).
 *
 * Hace tres cosas que un diálogo accesible necesita y suelen olvidarse:
 * mover el foco al abrir, hacer que Tab dé la vuelta dentro, y **devolver el
 * foco al elemento que lo abrió** al cerrar.
 */
export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const container = ref.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    function focusInitial() {
      // Enfoca el primer elemento útil; si no hay ninguno, el propio contenedor.
      const initial = focusableWithin(container!)[0] ?? container!;
      initial.focus({ preventScroll: true });
    }

    // Modal/Drawer se montan ya visibles: enfocar de inmediato funciona. El
    // menú móvil del Header, en cambio, sigue siempre en el DOM y solo pasa
    // de `visibility: hidden` a visible por una transición CSS — mientras
    // dura, el navegador no considera enfocable nada de dentro y `.focus()`
    // no hace nada. En ese caso se espera a que la transición termine de
    // verdad (con un plazo de respaldo por si no hay transición, p. ej. con
    // `prefers-reduced-motion`).
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    function onTransitionEnd(event: TransitionEvent) {
      if (event.target !== container || event.propertyName !== 'visibility') return;
      container!.removeEventListener('transitionend', onTransitionEnd);
      clearTimeout(fallbackTimer);
      focusInitial();
    }

    if (getComputedStyle(container).visibility === 'hidden') {
      container.addEventListener('transitionend', onTransitionEnd);
      fallbackTimer = setTimeout(focusInitial, 400);
    } else {
      focusInitial();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab' || !container) return;

      const items = focusableWithin(container);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0]!;
      const last = items[items.length - 1]!;
      const activeEl = document.activeElement;

      if (event.shiftKey && (activeEl === first || activeEl === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(fallbackTimer);
      container.removeEventListener('transitionend', onTransitionEnd);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [ref, active]);
}
