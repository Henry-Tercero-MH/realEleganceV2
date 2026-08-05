import { ButtonLink, Card, Icon, SectionHeading, Skeleton, Table } from '@/components/ui';
import type { Column, IconName } from '@/components/ui';
import type { TailorWorkload } from '@real-elegance/shared';
import { useAdminStats, useTailorWorkload } from '@/features/admin/hooks';
import { paths } from '@/routes/paths';
import { formatCurrencyCompact } from '@/lib/format';
import { cx } from '@/lib/cx';
import s from './admin.module.css';

interface StatCard {
  key: string;
  label: string;
  icon: IconName;
  value: string;
  alert?: boolean;
}

const WORKLOAD_COLUMNS: Array<Column<TailorWorkload>> = [
  {
    id: 'name',
    header: 'Sastre',
    cell: (row) => (
      <div>
        <span className={s.cellName}>{row.tailorName}</span>
        <span className={s.cellSub}>{row.specialty ?? '—'}</span>
      </div>
    ),
  },
  {
    id: 'active',
    header: 'Órdenes activas',
    align: 'right',
    cell: (row) => row.activeWorkOrders,
  },
  {
    id: 'overdue',
    header: 'Fuera de plazo',
    align: 'right',
    hideOnMobile: true,
    cell: (row) => (row.overdueWorkOrders > 0 ? <strong>{row.overdueWorkOrders}</strong> : '—'),
  },
  {
    id: 'available',
    header: 'Estado',
    align: 'right',
    cell: (row) => (row.isAvailable ? 'Disponible' : 'Ocupado'),
  },
];

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();
  const { data: workload, isLoading: loadingWorkload } = useTailorWorkload();

  const cards: StatCard[] = stats
    ? [
        { key: 'open', label: 'Pedidos abiertos', icon: 'package', value: String(stats.openOrders) },
        {
          key: 'production',
          label: 'En confección',
          icon: 'scissors',
          value: String(stats.ordersInProduction),
        },
        {
          key: 'appointments',
          label: 'Citas hoy',
          icon: 'calendar',
          value: String(stats.appointmentsToday),
        },
        {
          key: 'revenue',
          label: 'Facturado este mes',
          icon: 'creditCard',
          value: formatCurrencyCompact(stats.revenueThisMonth),
        },
        {
          key: 'balance',
          label: 'Saldo por cobrar',
          icon: 'clock',
          value: formatCurrencyCompact(stats.pendingBalance),
        },
        {
          key: 'stock',
          label: 'Telas con poco stock',
          icon: 'spool',
          value: String(stats.lowStockFabrics),
          alert: stats.lowStockFabrics > 0,
        },
      ]
    : [];

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Panel"
        title="Cómo va el taller"
        description="Lo que hay que mirar cada mañana antes de abrir."
        action={
          <ButtonLink
            to={paths.adminProduction}
            variant="primary"
            leftIcon={<Icon name="scissors" size={16} />}
          >
            Ir al tablero
          </ButtonLink>
        }
      />

      <div className={s.stats}>
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} height="120px" radius="var(--radius-md)" />
            ))
          : cards.map((card) => (
              <div key={card.key} className={cx(s.stat, card.alert && s.statAlert)}>
                <p className={s.statHead}>
                  <Icon name={card.icon} size={15} />
                  {card.label}
                </p>
                <p className={s.statValue}>{card.value}</p>
              </div>
            ))}
      </div>

      <Card variant="raised">
        <Card.Header
          title="Carga por sastre"
          subtitle="Equivale a la vista vw_tailor_workload"
        />
        <Card.Body>
          {loadingWorkload ? (
            <Skeleton height="180px" radius="var(--radius-md)" />
          ) : (
            <Table
              columns={WORKLOAD_COLUMNS}
              rows={workload ?? []}
              rowKey={(row) => row.staffId}
              caption="Carga de trabajo por sastre"
            />
          )}
        </Card.Body>
      </Card>

      <p className={s.designNote}>
        <Icon name="info" size={15} />
        Fase de diseño: los datos son de demostración y las acciones de escritura (crear, subir
        imágenes, editar) llegarán con el backend. La navegación y los estados de cada pantalla ya
        son los definitivos.
      </p>
    </div>
  );
}
