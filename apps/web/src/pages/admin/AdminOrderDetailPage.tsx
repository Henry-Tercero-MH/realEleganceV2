import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Icon,
  Input,
  Modal,
  OrderStatusBadge,
  Price,
  SectionHeading,
  Select,
  Skeleton,
  Textarea,
} from '@/components/ui';
import type { Order, OrderStatusCode } from '@real-elegance/shared';
import { CLOSED_ORDER_STATUSES, ORDER_STATUSES, ORDER_STATUS_LABELS } from '@real-elegance/shared';
import { useAdminAppointments, useAdminOrder, useRecordPayment, useUpdateOrderStatus } from '@/features/admin/hooks';
import { useResendConfirmation } from '@/features/orders/hooks';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate, formatDateTime, formatPoints } from '@/lib/format';
import { downloadReceipt } from '@/lib/receipt';
import { cx } from '@/lib/cx';
import s from './admin.module.css';

/** Mismos ids que usa el pedido de mostrador: un pago no distingue de dónde vino. */
const PAYMENT_METHODS = [
  { id: 1, name: 'Efectivo' },
  { id: 2, name: 'Tarjeta de crédito' },
  { id: 3, name: 'Transferencia bancaria' },
];

export default function AdminOrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: order, isLoading, isError } = useAdminOrder(orderNumber);
  const { data: appointments } = useAdminAppointments();
  const { user } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const resendConfirmation = useResendConfirmation();
  const toast = useToast();

  const staffName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Personal del taller'
    : 'Personal del taller';

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

  if (isLoading) {
    return <Skeleton height="480px" radius="var(--radius-md)" />;
  }

  if (isError || !order) {
    return (
      <EmptyState
        tone="error"
        title="No encontramos ese pedido"
        action={
          <ButtonLink to={paths.adminOrders} variant="primary">
            Volver a pedidos
          </ButtonLink>
        }
      />
    );
  }

  const isClosed = CLOSED_ORDER_STATUSES.includes(order.statusCode);
  const nextAppointment = (appointments ?? [])
    .filter((item) => item.orderId === order.id && item.status === 'scheduled')
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow={<Link to={paths.adminOrders}>← Pedidos</Link>}
        title={order.orderNumber}
        description={
          <Link to={paths.adminCustomer(order.customerId)} className={s.mono}>
            {order.customerName}
          </Link>
        }
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
              <dt>Pagado</dt>
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
        </Card.Body>
        <Card.Footer className={s.footerBetween}>
          <div className={s.buttonGroup}>
            <ButtonLink
              to={paths.trackingFor(order.orderNumber)}
              variant="ghost"
              rightIcon={<Icon name="arrowRight" size={16} />}
            >
              Ver como lo ve el cliente
            </ButtonLink>
            <Button variant="ghost" leftIcon={<Icon name="download" size={16} />} onClick={() => downloadReceipt(order)}>
              Descargar comprobante
            </Button>
            <Button variant="ghost" isLoading={resendConfirmation.isPending} onClick={handleResend}>
              Reenviar confirmación
            </Button>
          </div>
          <Button
            variant="primary"
            leftIcon={<Icon name="creditCard" size={16} />}
            onClick={() => setPaymentModalOpen(true)}
            disabled={isClosed || order.balanceDue <= 0}
          >
            Registrar pago
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
                <h3 className={s.itemName}>{item.suitModelName ?? item.productName ?? 'Artículo'}</h3>
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
            <p className={s.cellSub}>Todavía no se ha registrado ningún pago.</p>
          ) : (
            <div className={s.lineItems}>
              {order.payments.map((payment) => (
                <div key={payment.id} className={s.detailRow}>
                  <div className={s.detailRowMain}>
                    <span className={s.itemName} style={{ fontSize: 'var(--text-base)' }}>
                      {payment.paymentType === 'anticipo' ? 'Anticipo' : 'Saldo'}
                    </span>
                    <span className={s.detailRowMeta}>
                      <span>{payment.paymentMethodName}</span>
                      <span>{formatDateTime(payment.paidAt)}</span>
                      {payment.reference ? <span>Ref. {payment.reference}</span> : null}
                    </span>
                  </div>
                  <span className={s.detailRowValue}>{formatCurrency(payment.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* ── Estado y bitácora ────────────────────────────────────────────── */}
      <Card variant="raised">
        <Card.Header title="Estado y bitácora" subtitle="Cada cambio de estado de este pedido, en orden." />
        <Card.Body>
          <div className={s.lineItems}>
            {[...order.history].reverse().map((entry) => (
              <div key={entry.id} className={s.detailRow}>
                <div className={s.detailRowMain}>
                  <OrderStatusBadge status={entry.statusCode} size="sm" />
                  <span className={s.detailRowMeta}>
                    <span>{entry.changedByName ?? 'Sistema'}</span>
                    <span>{formatDateTime(entry.changedAt)}</span>
                  </span>
                  {entry.note ? <p className={s.noteText}>{entry.note}</p> : null}
                </div>
              </div>
            ))}
          </div>

          <StatusForm order={order} staffName={staffName} isClosed={isClosed} />
        </Card.Body>
      </Card>

      <PaymentModal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} order={order} />
    </div>
  );
}

function StatusForm({
  order,
  staffName,
  isClosed,
}: {
  order: Order;
  staffName: string;
  isClosed: boolean;
}) {
  const [statusCode, setStatusCode] = useState<OrderStatusCode | ''>('');
  const [note, setNote] = useState('');
  const updateStatus = useUpdateOrderStatus();
  const toast = useToast();

  if (isClosed) {
    return (
      <p className={cx(s.cellSub, 're-mt-4')}>
        Este pedido está cerrado y ya no cambia de estado.
      </p>
    );
  }

  const options = ORDER_STATUSES.filter((code) => code !== 'pending_deposit' && code !== order.statusCode).map(
    (code) => ({ value: code, label: ORDER_STATUS_LABELS[code] }),
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!statusCode) return;

    try {
      await updateStatus.mutateAsync({
        orderNumber: order.orderNumber,
        statusCode,
        note: note || undefined,
        changedByName: staffName,
      });
      toast.success('Estado actualizado', ORDER_STATUS_LABELS[statusCode]);
      setStatusCode('');
      setNote('');
    } catch (error) {
      toast.error(
        'No se pudo cambiar el estado',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className={s.noteForm}>
      <Select
        label="Cambiar a"
        placeholder="Elige un estado"
        value={statusCode}
        onChange={(event) => setStatusCode(event.target.value as OrderStatusCode)}
        options={options}
      />
      <Textarea
        label="Nota"
        placeholder="Por ejemplo: cliente confirmó recoger el viernes."
        hint="Opcional."
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <Button type="submit" variant="secondary" size="sm" isLoading={updateStatus.isPending} disabled={!statusCode}>
        Actualizar estado
      </Button>
    </form>
  );
}

function PaymentModal({ open, onClose, order }: { open: boolean; onClose: () => void; order: Order }) {
  const recordPayment = useRecordPayment();
  const toast = useToast();

  const [paymentMethodId, setPaymentMethodId] = useState(PAYMENT_METHODS[0]!.id);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');

  // Se sugiere el saldo completo al abrir: cubre el caso más común (cobrar todo) y se puede editar.
  useEffect(() => {
    if (open) setAmount(order.balanceDue > 0 ? String(order.balanceDue) : '');
  }, [open, order.balanceDue]);

  function reset() {
    setPaymentMethodId(PAYMENT_METHODS[0]!.id);
    setReference('');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Falta el monto', 'Escribe un monto mayor que cero.');
      return;
    }

    const method = PAYMENT_METHODS.find((item) => item.id === paymentMethodId)!;

    try {
      await recordPayment.mutateAsync({
        orderNumber: order.orderNumber,
        amount: value,
        paymentMethodId: method.id,
        paymentMethodName: method.name,
        reference: reference || undefined,
      });
      toast.success('Pago registrado', formatCurrency(value));
      reset();
      onClose();
    } catch (error) {
      toast.error(
        'No se pudo registrar el pago',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar pago"
      description={`Saldo pendiente: ${formatCurrency(order.balanceDue)}.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="payment-form" variant="primary" isLoading={recordPayment.isPending}>
            Registrar pago
          </Button>
        </>
      }
    >
      <form id="payment-form" onSubmit={handleSubmit} className={s.formGrid2}>
        <Select
          label="Método"
          fieldClassName={s.span2}
          value={paymentMethodId}
          onChange={(event) => setPaymentMethodId(Number(event.target.value))}
          options={PAYMENT_METHODS.map((method) => ({ value: method.id, label: method.name }))}
        />
        <Input
          label="Monto"
          type="number"
          step="0.01"
          min="0"
          max={order.balanceDue}
          required
          endAdornment="Q"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <Input
          label="Referencia"
          placeholder="Opcional"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
        />
      </form>
    </Modal>
  );
}
