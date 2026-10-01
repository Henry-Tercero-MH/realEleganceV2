import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './Stepper.module.css';

export interface StepperStep {
  id: string;
  label: string;
  description?: ReactNode;
  /** Fecha o dato al pie del paso (útil en el seguimiento del pedido). */
  meta?: ReactNode;
  /**
   * Contenido ampliado que se despliega al lado del disco al pasar el cursor
   * o el foco (empuja a los pasos siguientes, como un carrusel). Solo tiene
   * efecto en orientación `horizontal`.
   */
  detail?: ReactNode;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Índice del paso actual (0-based). Todo lo anterior se marca completado. */
  current: number;
  /** `horizontal` para el flujo de compra; `vertical` para el seguimiento. */
  orientation?: 'horizontal' | 'vertical';
  /** Si se pasa, los pasos ya completados se vuelven clicables. */
  onStepClick?: (index: number, step: StepperStep) => void;
  className?: string;
  'aria-label'?: string;
}

/**
 * Indicador de progreso del flujo del cliente (explorar → … → entrega) y del
 * avance en el taller.
 *
 * La línea que une los pasos es el motivo de marca: una cinta métrica con sus
 * ticks. El tramo recorrido se pinta en dorado sólido.
 */
export function Stepper({
  steps,
  current,
  orientation = 'horizontal',
  onStepClick,
  className,
  'aria-label': ariaLabel = 'Progreso',
}: StepperProps) {
  return (
    <ol className={cx(s.stepper, s[orientation], className)} aria-label={ariaLabel}>
      {steps.map((step, index) => {
        const isDone = index < current;
        const isCurrent = index === current;
        const canNavigate = Boolean(onStepClick) && isDone;
        const detailId = step.detail ? `${step.id}-detail` : undefined;

        const content = (
          <>
            <span className={s.marker} aria-hidden="true">
              {isDone ? <Icon name="check" size={14} /> : <span className={s.number}>{index + 1}</span>}
            </span>
            <span className={s.text}>
              <span className={s.label}>{step.label}</span>
              {step.description ? <span className={s.description}>{step.description}</span> : null}
              {step.meta ? <span className={s.meta}>{step.meta}</span> : null}
            </span>
          </>
        );

        return (
          <li
            key={step.id}
            className={cx(s.step, isDone && s.done, isCurrent && s.current, detailId && s.hasPanel)}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {canNavigate ? (
              <button
                type="button"
                className={s.trigger}
                onClick={() => onStepClick?.(index, step)}
                aria-describedby={detailId}
              >
                {content}
                <span className="re-sr-only">— paso completado, volver</span>
              </button>
            ) : (
              <span className={s.trigger} tabIndex={detailId ? 0 : undefined} aria-describedby={detailId}>
                {content}
              </span>
            )}
            {step.detail ? (
              <div className={s.panel} id={detailId}>
                <div className={s.panelInner}>
                  <p className={s.panelTitle}>{step.label}</p>
                  {step.detail}
                </div>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
