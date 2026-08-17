import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { Icon } from './Icon';
import { formatCurrency } from '@/lib/format';
import { cx } from '@/lib/cx';
import s from './OptionCard.module.css';
/**
 * Opción seleccionable del personalizador: solapa, forro, botones, tela.
 *
 * Por dentro es un `<input type="radio">` real —teclado con flechas, un solo
 * seleccionado por grupo, envío nativo— con la caja dibujada encima.
 */
export function OptionCard({ name, value, checked, onChange, title, description, priceDelta, swatchColor, imageUrl, disabled = false, layout = 'row', className, }) {
    const id = useId();
    const hasSwatch = Boolean(imageUrl || swatchColor);
    return (_jsxs("div", { className: cx(s.option, s[layout], checked && s.checked, disabled && s.disabled, className), children: [_jsx("input", { id: id, type: "radio", name: name, value: value, checked: checked, disabled: disabled, onChange: () => onChange(value), className: s.input }), _jsxs("label", { htmlFor: id, className: s.label, children: [hasSwatch ? (_jsx("span", { className: s.swatch, style: { backgroundColor: swatchColor ?? undefined }, children: imageUrl ? _jsx("img", { src: imageUrl, alt: "", loading: "lazy" }) : null })) : null, _jsxs("span", { className: s.text, children: [_jsx("span", { className: s.title, children: title }), description ? _jsx("span", { className: s.description, children: description }) : null] }), typeof priceDelta === 'number' ? (_jsx("span", { className: cx(s.price, priceDelta === 0 && s.included), children: priceDelta === 0
                            ? 'Incluido'
                            : `${priceDelta > 0 ? '+' : '−'}${formatCurrency(Math.abs(priceDelta))}` })) : null, _jsx("span", { className: s.mark, "aria-hidden": "true", children: _jsx(Icon, { name: "check", size: 12 }) })] })] }));
}
//# sourceMappingURL=OptionCard.js.map