import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';
import s from './Skeleton.module.css';

export interface SkeletonProps {
  /** Cualquier medida CSS válida. */
  width?: string | number;
  height?: string | number;
  /** `text` redondea poco y respeta la altura de línea; `block`, un panel; `circle`, un avatar. */
  shape?: 'text' | 'block' | 'circle';
  radius?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Hueco de carga. Se usa **con la forma del contenido real** (mismo alto, mismo
 * ancho aproximado) para que al llegar los datos nada salte de sitio.
 */
export function Skeleton({ width, height, shape = 'block', radius, className, style }: SkeletonProps) {
  return (
    <span
      className={cx(s.skeleton, s[shape], className)}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export interface SkeletonTextProps {
  /** Número de renglones. El último sale más corto, como un párrafo real. */
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <span className={cx(s.textGroup, className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} shape="text" width={i === lines - 1 ? '62%' : '100%'} />
      ))}
    </span>
  );
}

/** Silueta de una tarjeta de catálogo, para las rejillas mientras cargan. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <span className={cx(s.card, className)} aria-hidden="true">
      <Skeleton height="0" style={{ aspectRatio: '3 / 4', height: 'auto' }} radius="0" />
      <span className={s.cardBody}>
        <Skeleton shape="text" width="40%" height="10px" />
        <Skeleton shape="text" width="80%" height="20px" />
        <Skeleton shape="text" width="35%" height="14px" />
      </span>
    </span>
  );
}
