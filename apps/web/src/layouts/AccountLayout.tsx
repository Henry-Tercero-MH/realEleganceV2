import { SidebarLayout } from './SidebarLayout';
import type { SidebarSection } from './SidebarLayout';
import { Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { paths } from '@/routes/paths';

const SECTIONS: SidebarSection[] = [
  {
    items: [
      { to: paths.account, label: 'Resumen', icon: 'dashboard', end: true },
      { to: paths.orders, label: 'Mis pedidos', icon: 'package' },
      { to: paths.appointments, label: 'Mis citas', icon: 'calendar' },
      { to: paths.measurements, label: 'Mis medidas', icon: 'ruler' },
    ],
  },
];

/** Área privada del cliente: pedidos, citas y medidas. */
export function AccountLayout() {
  const { user, logout } = useAuth();

  return (
    <SidebarLayout
      feature="Mi cuenta"
      title="Mi cuenta"
      subtitle={user ? `${user.firstName} ${user.lastName}` : undefined}
      sections={SECTIONS}
      aside={
        <Button variant="link" onClick={logout}>
          Cerrar sesión
        </Button>
      }
    />
  );
}
