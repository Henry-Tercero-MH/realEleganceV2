import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  EmptyState,
  Icon,
  Input,
  OptionCard,
  SectionHeading,
  Select,
  Skeleton,
  Textarea,
} from '@/components/ui';
import { APPOINTMENT_TYPES, APPOINTMENT_TYPE_LABELS, CLOSED_ORDER_STATUSES } from '@real-elegance/shared';
import type { AppointmentTypeCode } from '@real-elegance/shared';
import { useAvailability, useCreateAppointment, useStaff } from '@/features/appointments/hooks';
import { useMyOrders } from '@/features/orders/hooks';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatTime, formatWeekday } from '@/lib/format';
import s from './account.module.css';
import b from './BookAppointmentPage.module.css';

/** Mañana, en `YYYY-MM-DD`: el hueco más cercano razonable. */
function tomorrow(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function BookAppointmentPage() {
  const [type, setType] = useState<AppointmentTypeCode>('medidas');
  const [date, setDate] = useState(tomorrow());
  const [staffId, setStaffId] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);

  const { data: staff } = useStaff();
  const { data: slots, isLoading } = useAvailability(date, staffId);
  const { data: orders } = useMyOrders();
  const createAppointment = useCreateAppointment();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const chosen = slots?.find((item) => item.startsAt === slot);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!chosen) return;

    if (!user?.customerId) {
      toast.error('No pudimos agendar la cita', 'Esta cuenta no tiene una ficha de cliente asociada.');
      return;
    }

    try {
      await createAppointment.mutateAsync({
        customerId: user.customerId,
        appointmentTypeCode: type,
        staffId: chosen.staffId,
        scheduledAt: chosen.startsAt,
        note: note || undefined,
        orderId: orderId ?? undefined,
      });
      toast.success('Cita agendada', `${formatWeekday(chosen.startsAt)} a las ${formatTime(chosen.startsAt)}.`);
      navigate(paths.appointments);
    } catch (error) {
      toast.error(
        'No pudimos agendar la cita',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Paso 4 de 8 · Cita"
        title="Agendar una cita"
        description="Elige el motivo, el día y la hora. Te confirmaremos por correo."
      />

      <form onSubmit={handleSubmit} className={b.form}>
        {/* ── Motivo ───────────────────────────────────────────────────── */}
        <Card variant="raised">
          <Card.Header title="¿Para qué vienes?" />
          <Card.Body>
            <div className={b.typeGrid}>
              {APPOINTMENT_TYPES.map((code) => (
                <OptionCard
                  key={code}
                  name="tipo-cita"
                  value={code}
                  checked={type === code}
                  onChange={(value) => setType(value as AppointmentTypeCode)}
                  title={APPOINTMENT_TYPE_LABELS[code]}
                />
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* ── Día y sastre ─────────────────────────────────────────────── */}
        <Card variant="raised">
          <Card.Header title="¿Cuándo?" />
          <Card.Body>
            <div className={b.filters}>
              <Input
                label="Día"
                type="date"
                value={date}
                min={tomorrow()}
                onChange={(event) => {
                  setDate(event.target.value);
                  setSlot(null);
                }}
              />
              <Select
                label="Con quién"
                placeholder="Cualquiera disponible"
                value={staffId ?? ''}
                onChange={(event) => {
                  setStaffId(event.target.value ? Number(event.target.value) : null);
                  setSlot(null);
                }}
                options={(staff ?? [])
                  .filter((member) => member.isAvailable)
                  .map((member) => ({
                    value: member.id,
                    label: `${member.firstName} ${member.lastName} — ${member.specialty ?? ''}`,
                  }))}
              />
            </div>

            <p className={b.slotsLabel}>Horarios libres</p>

            {isLoading ? (
              <Skeleton height="80px" radius="var(--radius-sm)" />
            ) : slots && slots.length > 0 ? (
              <div className={b.slots} role="radiogroup" aria-label="Horarios disponibles">
                {slots.map((item) => (
                  <button
                    key={`${item.staffId}-${item.startsAt}`}
                    type="button"
                    role="radio"
                    aria-checked={slot === item.startsAt}
                    className={slot === item.startsAt ? `${b.slot} ${b.slotActive}` : b.slot}
                    onClick={() => setSlot(item.startsAt)}
                  >
                    <strong>{formatTime(item.startsAt)}</strong>
                    <small>{item.staffName}</small>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                size="sm"
                icon="calendar"
                title="No quedan huecos ese día"
                description="Prueba con otra fecha o quita el filtro de sastre."
              />
            )}
          </Card.Body>
        </Card>

        {/* ── Nota y confirmación ──────────────────────────────────────── */}
        <Card variant="raised">
          <Card.Body>
            {orders && orders.filter((order) => !CLOSED_ORDER_STATUSES.includes(order.statusCode)).length > 0 ? (
              <Select
                label="Pedido relacionado"
                placeholder="Ninguno en particular"
                value={orderId ?? ''}
                onChange={(event) => setOrderId(event.target.value ? Number(event.target.value) : null)}
                hint="Si es una prueba o una entrega, dinos de qué pedido."
                options={orders
                  .filter((order) => !CLOSED_ORDER_STATUSES.includes(order.statusCode))
                  .map((order) => ({ value: order.id, label: order.orderNumber }))}
              />
            ) : null}
            <Textarea
              label="¿Algo que debamos saber?"
              placeholder="Por ejemplo: vengo con poco tiempo, o quiero ver linos."
              value={note}
              onChange={(event) => setNote(event.target.value)}
              hint="Opcional."
            />
          </Card.Body>
          <Card.Footer className={b.footer}>
            {chosen ? (
              <p className={b.confirmation}>
                <Icon name="checkCircle" size={16} />
                {formatWeekday(chosen.startsAt)} a las {formatTime(chosen.startsAt)} con{' '}
                {chosen.staffName}
              </p>
            ) : (
              <p className={b.confirmation}>
                <Icon name="info" size={16} />
                Elige un horario para continuar.
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!chosen}
              isLoading={createAppointment.isPending}
            >
              Confirmar cita
            </Button>
          </Card.Footer>
        </Card>
      </form>
    </div>
  );
}
