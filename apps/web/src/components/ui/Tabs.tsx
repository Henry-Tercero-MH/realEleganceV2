import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import s from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: ReactNode;
  /** Contador a la derecha de la etiqueta (p. ej. nº de pedidos en ese estado). */
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** `underline` para navegación de contenido; `pill` para filtros. */
  variant?: 'underline' | 'pill';
  className?: string;
  'aria-label': string;
}

/**
 * Pestañas con navegación por teclado según el patrón ARIA: flechas para
 * moverse, Inicio/Fin para ir a los extremos.
 *
 * Solo pinta la barra: el panel lo renderiza quien la usa, para poder cambiar
 * de pestaña sin desmontar el contenido si no conviene.
 */
export function Tabs({
  tabs,
  value,
  onChange,
  variant = 'underline',
  className,
  'aria-label': ariaLabel,
}: TabsProps) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const enabled = tabs.filter((tab) => !tab.disabled);
    const currentIndex = enabled.findIndex((tab) => tab.id === value);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % enabled.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = enabled.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();

    const next = enabled[nextIndex];
    if (!next) return;
    onChange(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`#${CSS.escape(`${baseId}-${next.id}`)}`)?.focus();
  }

  return (
    <div
      ref={listRef}
      className={cx(s.tabs, s[variant], className)}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            id={`${baseId}-${tab.id}`}
            type="button"
            role="tab"
            className={cx(s.tab, selected && s.selected)}
            aria-selected={selected}
            aria-controls={`${baseId}-${tab.id}-panel`}
            /* Solo la pestaña activa entra en el orden de tabulación: el resto
               se alcanza con las flechas, como manda el patrón ARIA. */
            tabIndex={selected ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {typeof tab.count === 'number' ? <span className={s.count}>{tab.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
