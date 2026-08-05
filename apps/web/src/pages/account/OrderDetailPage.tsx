import { Link, useParams } from 'react-router-dom';
import {
  Badge,
  ButtonLink,
  Card,
  EmptyState,
  Icon,
  OrderStatusBadge,
  Price,
  SectionHeading,
  Skeleton,
} from '@/components/ui';
import { useOrder } from '@/features/orders/hooks';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import s from './account.module.css';

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: order, isLoading, isError } = useOrder(orderNumber);

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
          </dl>
        </Card.Body>
        <Card.Footer>
          <ButtonLink
            to={paths.trackingFor(order.orderNumber)}
            variant="secondary"
            rightIcon={<Icon name="arrowRight" size={16} />}
          >
            Ver el avance en el taller
          </ButtonLink>
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
