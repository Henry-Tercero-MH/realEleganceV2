import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from '@/lib/cx';
import s from './Spinner.module.css';
/**
 * Indicador de carga: un arco dorado girando, no un círculo completo, para que
 * se lea como una hilvanada en movimiento.
 */
export function Spinner({ size = 18, className, label }) {
    return (_jsxs("span", { className: cx(s.wrapper, className), role: "status", "aria-live": "polite", children: [_jsxs("svg", { className: s.svg, width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [_jsx("circle", { className: s.track, cx: "12", cy: "12", r: "9", strokeWidth: "2" }), _jsx("circle", { className: s.arc, cx: "12", cy: "12", r: "9", strokeWidth: "2", strokeLinecap: "round", strokeDasharray: "16 40" })] }), _jsx("span", { className: "re-sr-only", children: label ?? 'Cargando' })] }));
}
//# sourceMappingURL=Spinner.js.map