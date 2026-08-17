import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from '@/lib/cx';
import s from './Skeleton.module.css';
/**
 * Hueco de carga. Se usa **con la forma del contenido real** (mismo alto, mismo
 * ancho aproximado) para que al llegar los datos nada salte de sitio.
 */
export function Skeleton({ width, height, shape = 'block', radius, className, style }) {
    return (_jsx("span", { className: cx(s.skeleton, s[shape], className), style: { width, height, borderRadius: radius, ...style }, "aria-hidden": "true" }));
}
export function SkeletonText({ lines = 3, className }) {
    return (_jsx("span", { className: cx(s.textGroup, className), "aria-hidden": "true", children: Array.from({ length: lines }, (_, i) => (_jsx(Skeleton, { shape: "text", width: i === lines - 1 ? '62%' : '100%' }, i))) }));
}
/** Silueta de una tarjeta de catálogo, para las rejillas mientras cargan. */
export function SkeletonCard({ className }) {
    return (_jsxs("span", { className: cx(s.card, className), "aria-hidden": "true", children: [_jsx(Skeleton, { height: "0", style: { aspectRatio: '3 / 4', height: 'auto' }, radius: "0" }), _jsxs("span", { className: s.cardBody, children: [_jsx(Skeleton, { shape: "text", width: "40%", height: "10px" }), _jsx(Skeleton, { shape: "text", width: "80%", height: "20px" }), _jsx(Skeleton, { shape: "text", width: "35%", height: "14px" })] })] }));
}
//# sourceMappingURL=Skeleton.js.map