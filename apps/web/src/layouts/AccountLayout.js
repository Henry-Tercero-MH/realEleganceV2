import { jsx as _jsx } from "react/jsx-runtime";
import { SidebarLayout } from './SidebarLayout';
import { Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { paths } from '@/routes/paths';
const SECTIONS = [
    {
        items: [
            { to: paths.account, label: 'Resumen', icon: 'dashboard', end: true },
            { to: paths.orders, label: 'Mis pedidos', icon: 'package' },
            { to: paths.appointments, label: 'Mis citas', icon: 'calendar' },
            { to: paths.measurements, label: 'Mis medidas', icon: 'ruler' },
            { to: paths.myLoyalty, label: 'Mis puntos', icon: 'sparkle' },
        ],
    },
];
/** Área privada del cliente: pedidos, citas y medidas. */
export function AccountLayout() {
    const { user, logout } = useAuth();
    return (_jsx(SidebarLayout, { feature: "Mi cuenta", title: "Mi cuenta", subtitle: user ? `${user.firstName} ${user.lastName}` : undefined, sections: SECTIONS, aside: _jsx(Button, { variant: "link", onClick: logout, children: "Cerrar sesi\u00F3n" }) }));
}
//# sourceMappingURL=AccountLayout.js.map