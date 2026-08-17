import { Link } from 'react-router-dom';
import {
  ButtonLink,
  Card,
  EmptyState,
  Icon,
  OrderStatusBadge,
  SectionHeading,
  Skeleton,
} from '@/components/ui';
import { useMyOrders } from '@/features/orders/hooks';
import { useMyAppointments } from '@/features/appointments/hooks';
import { useMyLoyalty } from '@/features/loyalty/hooks';
import { useAuth } from '@/context/AuthContext';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate, formatDateTime, formatPoints } from '@/lib/format';
import s from './account.module.css';

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const { data: orders, isLoading: loadingOrders } = useMyOrders();
  const { data: appointments, isLoading: loadingAppointments } = useMyAppointments();
  const { data: loyalty, isLoading: loadingLoyalty } = useMyLoyalty();

  const openOrders = orders?.filter(
    (order) => order.statusCode !== 'delivered' && order.statusCode !== 'cancelled',
  );
  const upcoming = appointments?.filter(
    (appointment) => appointment.status === 'scheduled' && new Date(appointment.scheduledAt) > new Date(),
  );
  const pendingBalance = orders?.reduce((sum, order) => sum + order.balanceDue, 0) ?? 0;

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Resumen"
        title={`Hola, ${user?.firstName ?? ''}`}
        description="Aquí tienes lo que está en marcha ahora mismo."
      />

      <div className={s.stats}>
        <div className={s.stat}>
          <p className={s.statLabel}>Pedidos abiertos</p>
          <p className={s.statValue}>{loadingOrders ? '—' : (openOrders?.length ?? 0)}</p>
          <p className={s.statHint}>En el taller ahora mismo</p>
        </div>
        <div className={s.stat}>
          <p className={s.statLabel}>Próximas citas</p>
          <p className={s.statValue}>{loadingAppointments ? '—' : (upcoming?.length ?? 0)}</p>
          <p className={s.statHint}>
            {upcoming?.[0] ? formatDateTime(upcoming[0].scheduledAt) : 'Sin citas pendientes'}
          </p>
        </div>
        <div className={s.stat}>
          <p className={s.statLabel}>Saldo pendiente</p>
          <p className={s.statValue}>{loadingOrders ? '—' : formatCurrency(pendingBalance)}</p>
          <p className={s.statHint}>Se paga en la entrega</p>
        </div>
        <div className={s.stat}>
          <p className={s.statLabel}>Puntos disponibles</p>
          <p className={s.statValue}>
            {loadingLoyalty ? '—' : formatPoints(loyalty?.pointsBalance ?? 0)}
          </p>
          <p className={s.statHint}>
            <Link to={paths.myLoyalty}>Ver mi historial</Link>
          </p>
        </div>
      </div>

      {/* ── Pedidos en curso ─────────────────────────────────────────────── */}
      <Card variant="raised">
        <Card.Header
          title="Pedidos en curso"
          aside={
            <ButtonLink to={paths.orders} variant="link">
              Ver todos
            </ButtonLink>
          }
        />
        <Card.Body>
          {loadingOrders ? (
            <Skeleton height="90px" radius="var(--radius-md)" />
          ) : openOrders && openOrders.length > 0 ? (
            <ul role="list" className={s.list}>
              {openOrders.slice(0, 3).map((order) => (
                <li key={order.id}>
                  <Link to={paths.order(order.orderNumber)} className={s.orderCard}>
                    <div>
                      <span className={s.orderNumber}>{order.orderNumber}</span>
                      <p className={s.orderMeta}>
                        <span>
                          {order.itemCount} {order.itemCount === 1 ? 'artículo' : 'artículos'}
                        </span>
                        <span>Entrega prevista: {formatDate(order.promisedDate)}</span>
                      </p>
                    </div>
                    <div className={s.orderRight}>
                      <OrderStatusBadge status={order.statusCode} size="sm" />
                      <strong>{formatCurrency(order.total)}</strong>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              size="sm"
              icon="hanger"
              title="No hay pedidos aún. Diseña tu primer traje."
              description="Cuando encargues uno, aquí verás su avance etapa por etapa."
              action={
                <ButtonLink to={paths.catalog} variant="primary">
                  Ver el catálogo
                </ButtonLink>
              }
            />
          )}
        </Card.Body>
      </Card>

      {/* ── Próxima cita ─────────────────────────────────────────────────── */}
      <Card variant="raised">
        <Card.Header
          title="Tu próxima cita"
          aside={
            <ButtonLink to={paths.appointments} variant="link">
              Ver la agenda
            </ButtonLink>
          }
        />
        <Card.Body>
          {loadingAppointments ? (
            <Skeleton height="70px" radius="var(--radius-md)" />
          ) : upcoming && upcoming[0] ? (
            <div className={s.orderCard}>
              <div>
                <span className={s.orderNumber}>{upcoming[0].appointmentTypeName}</span>
                <p className={s.orderMeta}>
                  <span>
                    <Icon name="clock" size={14} /> {formatDateTime(upcoming[0].scheduledAt)}
                  </span>
                  <span>Con {upcoming[0].staffName}</span>
                </p>
              </div>
            </div>
          ) : (
            <EmptyState
              size="sm"
              icon="calendar"
              title="No tienes citas agendadas"
              description="Reserva una para tomarte medidas o ver telas en el taller."
              action={
                <ButtonLink to={paths.bookAppointment} variant="secondary">
                  Agendar una cita
                </ButtonLink>
              }
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
