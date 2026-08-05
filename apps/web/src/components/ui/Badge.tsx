import type { HTMLAttributes, ReactNode } from 'react';
import type { OrderStatusCode, ProductionStageCode } from '@real-elegance/shared';
import { ORDER_STATUS_LABELS, PRODUCTION_STAGE_LABELS } from '@real-elegance/shared';
import { cx } from '@/lib/cx';
import s from './Badge.module.css';

export type BadgeTone = 'neutral' | 'gold' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** `soft` rellena con un velo; `outline` deja solo el filete. */
  appearance?: 'soft' | 'outline';
  size?: 'sm' | 'md';
  /** Punto de color a la izquierda: útil en listas densas de estados. */
  withDot?: boolean;
  children: ReactNode;
}

export function Badge({
  tone = 'neutral',
  appearance = 'soft',
  size = 'md',
  withDot = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cx(s.badge, s[tone], s[appearance], s[size], className)} {...rest}>
      {withDot ? <span className={s.dot} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/**
 * Mapa estado de pedido → tono. Vive aquí (y no en cada página) para que un
 * pedido «Entregado» se vea igual en la tienda, en «Mis pedidos» y en el taller.
 */
const ORDER_STATUS_TONES: Record<OrderStatusCode, BadgeTone> = {
  pending_deposit: 'warning',
  confirmed: 'info',
  in_production: 'gold',
  fitting: 'gold',
  ready: 'success',
  delivered: 'success',
  cancelled: 'danger',
};

export interface OrderStatusBadgeProps {
  status: OrderStatusCode;
  size?: 'sm' | 'md';
  className?: string;
}

export function OrderStatusBadge({ status, size = 'md', className }: OrderStatusBadgeProps) {
  return (
    <Badge tone={ORDER_STATUS_TONES[status]} size={size} withDot className={className}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}

export interface StageBadgeProps {
  stage: ProductionStageCode;
  size?: 'sm' | 'md';
  className?: string;
}

export function StageBadge({ stage, size = 'sm', className }: StageBadgeProps) {
  return (
    <Badge tone="gold" appearance="outline" size={size} className={className}>
      {PRODUCTION_STAGE_LABELS[stage]}
    </Badge>
  );
}
