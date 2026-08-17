import { SidebarLayout } from './SidebarLayout';
import type { SidebarSection } from './SidebarLayout';
import { Badge } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@real-elegance/shared';
import { paths } from '@/routes/paths';

const SECTIONS: SidebarSection[] = [
  {
    items: [{ to: paths.admin, label: 'Panel', icon: 'dashboard', end: true }],
  },
  {
    title: 'Clientela',
    items: [{ to: paths.adminCustomers, label: 'Clientes', icon: 'users' }],
  },
  {
    title: 'Catálogo',
    items: [
      { to: paths.adminSuits, label: 'Trajes', icon: 'hanger' },
      { to: paths.adminFabrics, label: 'Telas', icon: 'spool' },
      { to: paths.adminProducts, label: 'Accesorios', icon: 'tag' },
      { to: paths.adminCoupons, label: 'Cupones', icon: 'creditCard' },
      { to: paths.adminLoyalty, label: 'Fidelización', icon: 'star' },
    ],
  },
  {
    title: 'Operación',
    items: [
      { to: paths.adminProduction, label: 'Taller', icon: 'scissors' },
      { to: paths.adminOrders, label: 'Pedidos', icon: 'package' },
      { to: paths.adminAppointments, label: 'Citas', icon: 'calendar' },
    ],
  },
];

/**
 * Back-office.
 *
 * El acceso lo controla `<RequireRole>` en el router; aquí solo se dibuja la
 * navegación y se recuerda con qué rol se está trabajando.
 */
export function AdminLayout() {
  const { user } = useAuth();

  return (
    <SidebarLayout
      feature="Back-office"
      title="Back-office"
      subtitle="Real Elegance"
      sections={SECTIONS}
      aside={
        user ? (
          <Badge tone="gold" appearance="outline" size="sm">
            {ROLE_LABELS[user.role]}
          </Badge>
        ) : null
      }
    />
  );
}
