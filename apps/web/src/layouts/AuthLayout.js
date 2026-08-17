import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { PageLoader } from '@/components/PageLoader';
import { paths } from '@/routes/paths';
import s from './AuthLayout.module.css';
/**
 * Pantalla partida para entrar y crear cuenta.
 *
 * Sin cabecera ni carrito: en este momento solo hay una cosa que hacer, y el
 * panel izquierdo está para recordar dónde se está entrando.
 */
export function AuthLayout() {
    return (_jsxs("div", { className: s.layout, children: [_jsxs("aside", { className: s.brandPanel, children: [_jsx(Link, { to: paths.home, className: s.brandLink, children: _jsx(Logo, {}) }), _jsxs("blockquote", { className: s.quote, children: [_jsx("p", { children: "\u00ABUn traje a medida no se compra: se encarga, se prueba y se espera. Lo dem\u00E1s es ropa.\u00BB" }), _jsx("footer", { children: "\u2014 Marta Qui\u00F1\u00F3nez, maestra cortadora" })] }), _jsxs("ul", { role: "list", className: s.points, children: [_jsx("li", { children: "Corte y confecci\u00F3n artesanal en nuestro taller" }), _jsx("li", { children: "Seguimiento en l\u00EDnea de cada etapa de tu traje" }), _jsx("li", { children: "Pruebas y ajustes incluidos hasta que caiga bien" })] })] }), _jsx("main", { className: s.formPanel, id: "contenido", children: _jsx("div", { className: s.formInner, children: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Outlet, {}) }) }) })] }));
}
//# sourceMappingURL=AuthLayout.js.map