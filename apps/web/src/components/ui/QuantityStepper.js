import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './QuantityStepper.module.css';
/**
 * Selector de cantidad del carrito.
 *
 * El número es un `<input type="number">` real para que se pueda escribir
 * directamente «12» en lugar de pulsar «+» doce veces.
 */
export function QuantityStepper({ value, onChange, min = 1, max = 99, label = 'Cantidad', disabled = false, size = 'md', className, }) {
    const id = useId();
    function clamp(next) {
        if (Number.isNaN(next))
            return min;
        return Math.min(max, Math.max(min, next));
    }
    return (_jsxs("div", { className: cx(s.stepper, s[size], disabled && s.disabled, className), children: [_jsx("button", { type: "button", className: s.button, onClick: () => onChange(clamp(value - 1)), disabled: disabled || value <= min, "aria-label": `Quitar uno — ${label}`, children: _jsx(Icon, { name: "minus", size: size === 'sm' ? 14 : 16 }) }), _jsx("label", { htmlFor: id, className: "re-sr-only", children: label }), _jsx("input", { id: id, type: "number", className: s.value, value: value, min: min, max: max, step: 1, disabled: disabled, onChange: (event) => onChange(clamp(Number(event.target.value))) }), _jsx("button", { type: "button", className: s.button, onClick: () => onChange(clamp(value + 1)), disabled: disabled || value >= max, "aria-label": `Añadir uno — ${label}`, children: _jsx(Icon, { name: "plus", size: size === 'sm' ? 14 : 16 }) })] }));
}
//# sourceMappingURL=QuantityStepper.js.map