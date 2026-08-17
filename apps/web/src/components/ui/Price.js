import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatCurrency } from '@/lib/format';
import { cx } from '@/lib/cx';
import s from './Price.module.css';
/**
 * Importe con el tratamiento tipográfico de la marca: cifras tabulares (para
 * que las columnas de precios queden alineadas) y el sufijo en versalita.
 */
export function Price({ amount, compareAt, size = 'md', prefix, suffix, className }) {
    const hasDiscount = typeof compareAt === 'number' && compareAt > amount;
    return (_jsxs("span", { className: cx(s.price, s[size], className), children: [prefix ? _jsx("span", { className: s.prefix, children: prefix }) : null, hasDiscount ? (_jsxs("span", { className: s.compare, children: [_jsx("span", { className: "re-sr-only", children: "Precio anterior: " }), formatCurrency(compareAt)] })) : null, _jsx("span", { className: s.amount, children: formatCurrency(amount) }), suffix ? _jsx("span", { className: s.suffix, children: suffix }) : null] }));
}
//# sourceMappingURL=Price.js.map