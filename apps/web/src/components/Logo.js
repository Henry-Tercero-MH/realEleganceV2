import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from '@/lib/cx';
import s from './Logo.module.css';
/**
 * Identidad de Real Elegance.
 *
 * El monograma «RE» va enmarcado por dos filetes con ticks de cinta métrica —
 * el mismo motivo que recorre toda la interfaz.
 */
export function Logo({ variant = 'full', className }) {
    return (_jsxs("span", { className: cx(s.logo, className), children: [_jsx("span", { className: s.mark, "aria-hidden": "true", children: "RE" }), variant === 'full' ? (_jsxs("span", { className: s.words, children: [_jsx("span", { className: s.name, children: "Real Elegance" }), _jsx("span", { className: s.tagline, children: "Sastrer\u00EDa artesanal" })] })) : null, _jsx("span", { className: "re-sr-only", children: "Real Elegance \u2014 sastrer\u00EDa artesanal" })] }));
}
//# sourceMappingURL=Logo.js.map