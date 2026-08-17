import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './Stepper.module.css';
/**
 * Indicador de progreso del flujo del cliente (explorar → … → entrega) y del
 * avance en el taller.
 *
 * La línea que une los pasos es el motivo de marca: una cinta métrica con sus
 * ticks. El tramo recorrido se pinta en dorado sólido.
 */
export function Stepper({ steps, current, orientation = 'horizontal', onStepClick, className, 'aria-label': ariaLabel = 'Progreso', }) {
    return (_jsx("ol", { className: cx(s.stepper, s[orientation], className), "aria-label": ariaLabel, children: steps.map((step, index) => {
            const isDone = index < current;
            const isCurrent = index === current;
            const canNavigate = Boolean(onStepClick) && isDone;
            const content = (_jsxs(_Fragment, { children: [_jsx("span", { className: s.marker, "aria-hidden": "true", children: isDone ? _jsx(Icon, { name: "check", size: 14 }) : _jsx("span", { className: s.number, children: index + 1 }) }), _jsxs("span", { className: s.text, children: [_jsx("span", { className: s.label, children: step.label }), step.description ? _jsx("span", { className: s.description, children: step.description }) : null, step.meta ? _jsx("span", { className: s.meta, children: step.meta }) : null] })] }));
            return (_jsx("li", { className: cx(s.step, isDone && s.done, isCurrent && s.current), "aria-current": isCurrent ? 'step' : undefined, children: canNavigate ? (_jsxs("button", { type: "button", className: s.trigger, onClick: () => onStepClick?.(index, step), children: [content, _jsx("span", { className: "re-sr-only", children: "\u2014 paso completado, volver" })] })) : (_jsx("span", { className: s.trigger, children: content })) }, step.id));
        }) }));
}
//# sourceMappingURL=Stepper.js.map