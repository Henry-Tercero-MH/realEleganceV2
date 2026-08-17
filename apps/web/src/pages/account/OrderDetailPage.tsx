import { Link, useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Icon,
  OrderStatusBadge,
  Price,
  SectionHeading,
  Skeleton,
} from '@/components/ui';
import { useOrder, useResendConfirmation } from '@/features/orders/hooks';
import { useMyAppointments } from '@/features/appointments/hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate, formatDateTime, formatPoints } from '@/lib/format';
import { downloadReceipt } from '@/lib/receipt';
import s from './account.module.css';

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: order, isLoading, isError } = useOrder(orderNumber);
  const { data: appointments } = useMyAppointments();
  const resendConfirmation = useResendConfirmation();
  const toast = useToast();

  if (isLoading) return <Skeleton height="420px" radius="var(--radius-md)" />;

  if (isError || !order) {
    return (
      <EmptyState
        tone="error"
        title="No encontramos ese pedido"
        description="Puede que el número no sea correcto o que el pedido pertenezca a otra cuenta."
        action={
          <ButtonLink to={paths.orders} variant="primary">
            Volver a mis pedidos
          </ButtonLink>
        }
      />
    );
  }

  const nextAppointment = (appointments ?? [])
    .filter((item) => item.orderId === order.id && item.status === 'scheduled')
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];

  async function handleResend() {
    if (!order) return;
    try {
      const { sentTo } = await resendConfirmation.mutateAsync(order.orderNumber);
      toast.success('Confirmación reenviada', `La enviamos a ${sentTo}.`);
    } catch (error) {
      toast.error(
        'No se pudo reenviar',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow={<Link to={paths.orders}>← Mis pedidos</Link>}
        title={order.orderNumber}
        action={<OrderStatusBadge status={order.statusCode} />}
      />

      {/* ── Cifras ───────────────────────────────────────────────────────── */}
      <Card variant="raised">
        <Card.Body>
          <dl className={s.facts}>
            <div>
              <dt>Total</dt>
              <dd>{formatCurrency(order.total)}</dd>
            </div>
            <div>
              <dt>Anticipo pagado</dt>
              <dd>{formatCurrency(order.depositPaid)}</dd>
            </div>
            <div>
              <dt>Saldo pendiente</dt>
              <dd>{formatCurrency(order.balanceDue)}</dd>
            </div>
            <div>
              <dt>Entrega prevista</dt>
              <dd>{formatDate(order.promisedDate)}</dd>
            </div>
            {order.deliveryAddress ? (
              <div>
                <dt>Dirección de entrega</dt>
                <dd>
                  {order.deliveryAddress.line1}, {order.deliveryAddress.city}
                </dd>
              </div>
            ) : null}
            {nextAppointment ? (
              <div>
                <dt>Próxima cita</dt>
                <dd>
                  {nextAppointment.appointmentTypeName} · {formatDate(nextAppointment.scheduledAt)}
                </dd>
              </div>
            ) : null}
            {order.pointsEarned > 0 ? (
              <div>
                <dt>Puntos ganados</dt>
                <dd>{formatPoints(order.pointsEarned)}</dd>
              </div>
            ) : null}
          </dl>

          {order.pointsRedeemed > 0 ? (
            <p className={s.itemSub} style={{ marginTop: 'var(--space-4)' }}>
              Pagaste {formatCurrency(order.pointsDiscount)} de este pedido con{' '}
              {formatPoints(order.pointsRedeemed)}.
            </p>
          ) : null}
        </Card.Body>
        <Card.Footer className={s.orderActions}>
          <ButtonLink
            to={paths.trackingFor(order.orderNumber)}
            variant="secondary"
            rightIcon={<Icon name="arrowRight" size={16} />}
          >
            Ver el avance en el taller
          </ButtonLink>
          <Button variant="ghost" leftIcon={<Icon name="download" size={16} />} onClick={() => downloadReceipt(order)}>
            Descargar comprobante
          </Button>
          <Button variant="ghost" isLoading={resendConfirmation.isPending} onClick={handleResend}>
            Reenviar confirmación
          </Button>
        </Card.Footer>
      </Card>

      {/* ── Artículos ────────────────────────────────────────────────────── */}
      <Card variant="raised">
        <Card.Header title="Artículos" />
        <Card.Body>
          {order.items.map((item) => (
            <article key={item.id} className={s.itemRow}>
              <div className={s.itemThumb}>
                {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" /> : null}
              </div>

              <div>
                <h3 className={s.itemName}>
                  {item.suitModelName ?? item.productName ?? 'Artículo'}
                </h3>
                <p className={s.itemSub}>
                  {item.fabricName ? `Tela: ${item.fabricName} · ` : ''}
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </p>

                {item.customizations.length > 0 ? (
                  <div className={s.itemOptions}>
                    {item.customizations.map((customization) => (
                      <Badge key={customization.id} tone="neutral" size="sm">
                        {customization.groupName}: {customization.optionName}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              <Price amount={item.lineTotal} size="sm" />
            </article>
          ))}
        </Card.Body>
      </Card>

      {/* ── Pagos ────────────────────────────────────────────────────────── */}
      <Card variant="raised">
        <Card.Header title="Pagos" />
        <Card.Body>
          {order.payments.length === 0 ? (
            <p>Todavía no se ha registrado ningún pago.</p>
          ) : (
            <ul role="list" className={s.list}>
              {order.payments.map((payment) => (
                <li key={payment.id} className={s.orderCard}>
                  <div>
                    <span className={s.orderNumber}>
                      {payment.paymentType === 'anticipo' ? 'Anticipo' : 'Saldo'}
                    </span>
                    <p className={s.orderMeta}>
                      <span>{payment.paymentMethodName}</span>
                      <span>{formatDateTime(payment.paidAt)}</span>
                      {payment.reference ? <span>Ref. {payment.reference}</span> : null}
                    </p>
                  </div>
                  <strong>{formatCurrency(payment.amount)}</strong>
                </li>
              ))}
            </ul>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
