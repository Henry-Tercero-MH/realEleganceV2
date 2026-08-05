import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ButtonLink,
  EmptyState,
  OrderStatusBadge,
  SectionHeading,
  Skeleton,
  Tabs,
} from '@/components/ui';
import { useMyOrders } from '@/features/orders/hooks';
import { CLOSED_ORDER_STATUSES } from '@real-elegance/shared';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate } from '@/lib/format';
import s from './account.module.css';

type Filter = 'abiertos' | 'entregados' | 'todos';

export default function OrdersPage() {
  const [filter, setFilter] = useState<Filter>('abiertos');
  const { data: orders, isLoading, isError } = useMyOrders();

  const open = orders?.filter((order) => !CLOSED_ORDER_STATUSES.includes(order.statusCode)) ?? [];
  const closed = orders?.filter((order) => CLOSED_ORDER_STATUSES.includes(order.statusCode)) ?? [];
  const visible = filter === 'abiertos' ? open : filter === 'entregados' ? closed : (orders ?? []);

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Historial"
        title="Mis pedidos"
        description="Cada encargo, con su estado y su saldo."
      />

      <Tabs
        variant="pill"
        aria-label="Filtrar pedidos"
        value={filter}
        onChange={(id) => setFilter(id as Filter)}
        tabs={[
          { id: 'abiertos', label: 'En curso', count: open.length },
          { id: 'entregados', label: 'Entregados', count: closed.length },
          { id: 'todos', label: 'Todos', count: orders?.length ?? 0 },
        ]}
      />

      {isLoading ? <Skeleton height="120px" radius="var(--radius-md)" /> : null}

      {isError ? (
        <EmptyState tone="error" title="No pudimos cargar tus pedidos" />
      ) : null}

      {!isLoading && visible.length === 0 ? (
        <EmptyState
          icon="package"
          title="No hay pedidos aún. Diseña tu primer traje."
          description="En cuanto encargues uno aparecerá aquí, con su avance en el taller."
          action={
            <ButtonLink to={paths.catalog} variant="primary">
              Ver el catálogo
            </ButtonLink>
          }
        />
      ) : null}

      <ul role="list" className={s.list}>
        {visible.map((order) => (
          <li key={order.id}>
            <Link to={paths.order(order.orderNumber)} className={s.orderCard}>
              <div>
                <span className={s.orderNumber}>{order.orderNumber}</span>
                <p className={s.orderMeta}>
                  <span>Encargado el {formatDate(order.createdAt)}</span>
                  <span>
                    {order.itemCount} {order.itemCount === 1 ? 'artículo' : 'artículos'}
                  </span>
                  {order.promisedDate ? <span>Entrega: {formatDate(order.promisedDate)}</span> : null}
                </p>
              </div>
              <div className={s.orderRight}>
                <OrderStatusBadge status={order.statusCode} size="sm" />
                <strong>{formatCurrency(order.total)}</strong>
                {order.balanceDue > 0 ? (
                  <small>Saldo: {formatCurrency(order.balanceDue)}</small>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
