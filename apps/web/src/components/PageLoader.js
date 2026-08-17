import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spinner } from './ui/Spinner';
import s from './PageLoader.module.css';
/**
 * Estado de carga de una ruta perezosa.
 *
 * Reserva la altura de una pantalla para que el pie de página no salte hacia
 * arriba mientras baja el chunk.
 */
export function PageLoader({ label = 'Cargando la página' }) {
    return (_jsxs("div", { className: s.loader, children: [_jsx(Spinner, { size: 26, label: label }), _jsx("p", { className: s.text, children: "Un momento\u2026" })] }));
}
//# sourceMappingURL=PageLoader.js.map