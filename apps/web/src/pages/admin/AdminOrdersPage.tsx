import { Link } from 'react-router-dom';
import { OrderStatusBadge, SectionHeading, Skeleton, Table } from '@/components/ui';
import type { Column } from '@/components/ui';
import type { OrderSummary } from '@real-elegance/shared';
import { useAdminOrders } from '@/features/admin/hooks';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate } from '@/lib/format';
import s from './admin.module.css';

const COLUMNS: Array<Column<OrderSummary>> = [
  {
    id: 'orderNumber',
    header: 'Pedido',
    cell: (row) => (
      <Link to={paths.order(row.orderNumber)} className={s.mono}>
        {row.orderNumber}
      </Link>
    ),
  },
  { id: 'created', header: 'Fecha', hideOnMobile: true, cell: (row) => formatDate(row.createdAt) },
  {
    id: 'promised',
    header: 'Entrega prevista',
    hideOnMobile: true,
    cell: (row) => formatDate(row.promisedDate),
  },
  { id: 'total', header: 'Total', align: 'right', cell: (row) => formatCurrency(row.total) },
  {
    id: 'balance',
    header: 'Saldo',
    align: 'right',
    cell: (row) => (row.balanceDue > 0 ? formatCurrency(row.balanceDue) : '—'),
  },
  {
    id: 'status',
    header: 'Estado',
    align: 'right',
    cell: (row) => <OrderStatusBadge status={row.statusCode} size="sm" />,
  },
];

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Operación"
        title="Pedidos"
        description="Todos los encargos, con su estado y su saldo."
      />

      {isLoading ? (
        <Skeleton height="320px" radius="var(--radius-md)" />
      ) : (
        <Table
          columns={COLUMNS}
          rows={orders ?? []}
          rowKey={(row) => row.id}
          caption="Pedidos"
        />
      )}
    </div>
  );
}
