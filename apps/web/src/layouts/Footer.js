import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/ui';
import { paths } from '@/routes/paths';
import s from './Footer.module.css';
const COLUMNS = [
    {
        title: 'Tienda',
        links: [
            { to: paths.catalog, label: 'Catálogo de trajes' },
            { to: paths.fabrics, label: 'Muestrario de telas' },
            { to: paths.accessories, label: 'Accesorios' },
            { to: paths.bookAppointment, label: 'Agendar una cita' },
        ],
    },
    {
        title: 'Tu pedido',
        links: [
            { to: paths.tracking, label: 'Seguimiento en línea' },
            { to: paths.orders, label: 'Mis pedidos' },
            { to: paths.measurements, label: 'Mis medidas' },
            { to: paths.cart, label: 'Carrito' },
        ],
    },
    {
        title: 'La casa',
        links: [
            { to: paths.about, label: 'El taller' },
            { to: paths.login, label: 'Entrar' },
            { to: paths.register, label: 'Crear cuenta' },
        ],
    },
];
export function Footer() {
    return (_jsxs("footer", { className: s.footer, children: [_jsxs("div", { className: `re-container ${s.inner}`, children: [_jsxs("div", { className: s.brandColumn, children: [_jsx(Logo, {}), _jsx("p", { className: s.pitch, children: "Trajes cortados a mano, uno cada vez. Desde 1998 en la Ciudad de Guatemala." }), _jsxs("address", { className: s.contact, children: [_jsxs("a", { href: "tel:+50222345678", children: [_jsx(Icon, { name: "clock", size: 15 }), " Lun a s\u00E1b \u00B7 9:00 \u2013 18:00"] }), _jsxs("a", { href: "mailto:contacto@realelegance.com", children: [_jsx(Icon, { name: "info", size: 15 }), " contacto@realelegance.com"] })] })] }), COLUMNS.map((column) => (_jsxs("nav", { className: s.column, "aria-label": column.title, children: [_jsx("h2", { className: s.columnTitle, children: column.title }), _jsx("ul", { role: "list", className: s.links, children: column.links.map((link) => (_jsx("li", { children: _jsx(Link, { to: link.to, className: s.link, children: link.label }) }, link.to))) })] }, column.title)))] }), _jsxs("div", { className: `re-container ${s.legal}`, children: [_jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " Real Elegance. Todos los derechos reservados."] }), _jsxs("p", { className: s.craft, children: [_jsx(Icon, { name: "needle", size: 14 }), " Cosido a mano, tambi\u00E9n el c\u00F3digo."] })] })] }));
}
//# sourceMappingURL=Footer.js.map