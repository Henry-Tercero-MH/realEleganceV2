import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import s from './Table.module.css';

export interface Column<T> {
  id: string;
  header: ReactNode;
  /** Cómo se pinta la celda. Recibe la fila completa. */
  cell: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Ancho fijo o mínimo de la columna (`'160px'`, `'20%'`). */
  width?: string;
  /** Se oculta por debajo de 900px, para que la tabla quepa en móvil. */
  hideOnMobile?: boolean;
}

export interface TableProps<T> {
  columns: Array<Column<T>>;
  rows: T[];
  /** Clave estable de cada fila (nunca el índice). */
  rowKey: (row: T) => string | number;
  /** Fila clicable: navega al detalle. */
  onRowClick?: (row: T) => void;
  /** Qué pintar cuando no hay filas. */
  empty?: ReactNode;
  caption?: string;
  className?: string;
}

/**
 * Tabla del back-office.
 *
 * Es una `<table>` de verdad (no un grid de divs) para conservar la semántica
 * de encabezado/celda que usan los lectores de pantalla.
 */
export function Table<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  empty,
  caption,
  className,
}: TableProps<T>) {
  if (rows.length === 0 && empty) {
    return <div className={cx(s.emptyWrap, className)}>{empty}</div>;
  }

  return (
    <div className={cx(s.scroller, className)}>
      <table className={s.table}>
        {caption ? <caption className="re-sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                style={{ width: column.width, textAlign: column.align ?? 'left' }}
                className={cx(column.hideOnMobile && s.hideOnMobile)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={cx(onRowClick && s.clickable)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (event) => {
                      if (event.key === 'Enter') onRowClick(row);
                    }
                  : undefined
              }
            >
              {columns.map((column) => (
                <td
                  key={column.id}
                  style={{ textAlign: column.align ?? 'left' }}
                  className={cx(column.hideOnMobile && s.hideOnMobile)}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
