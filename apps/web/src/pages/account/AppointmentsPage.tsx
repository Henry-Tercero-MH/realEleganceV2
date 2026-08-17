import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Icon,
  SectionHeading,
  Skeleton,
} from '@/components/ui';
import type { Appointment } from '@real-elegance/shared';
import { APPOINTMENT_STATUS_LABELS } from '@real-elegance/shared';
import { useMyAppointments, useUpdateAppointmentStatus } from '@/features/appointments/hooks';
import { RescheduleModal } from '@/features/appointments/RescheduleModal';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatDateTime, formatRelative, formatWeekday } from '@/lib/format';
import s from './account.module.css';

export default function AppointmentsPage() {
  const { data: appointments, isLoading, isError } = useMyAppointments();
  const updateStatus = useUpdateAppointmentStatus();
  const toast = useToast();
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);

  async function handleCancel(appointment: Appointment) {
    try {
      await updateStatus.mutateAsync({ appointmentId: appointment.id, status: 'cancelled' });
      toast.success('Cita cancelada');
    } catch (error) {
      toast.error(
        'No se pudo cancelar',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  const now = Date.now();
  const upcoming =
    appointments?.filter(
      (appointment) =>
        appointment.status === 'scheduled' && new Date(appointment.scheduledAt).getTime() >= now,
    ) ?? [];
  const past =
    appointments?.filter(
      (appointment) =>
        appointment.status !== 'scheduled' || new Date(appointment.scheduledAt).getTime() < now,
    ) ?? [];

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Agenda"
        title="Mis citas"
        description="Toma de medidas, pruebas y entregas en el taller."
        action={
          <ButtonLink
            to={paths.bookAppointment}
            variant="primary"
            leftIcon={<Icon name="plus" size={16} />}
          >
            Agendar
          </ButtonLink>
        }
      />

      {isLoading ? <Skeleton height="140px" radius="var(--radius-md)" /> : null}
      {isError ? <EmptyState tone="error" title="No pudimos cargar tu agenda" /> : null}

      <Card variant="raised">
        <Card.Header title="Próximas" />
        <Card.Body>
          {upcoming.length === 0 ? (
            <EmptyState
              size="sm"
              icon="calendar"
              title="No tienes citas agendadas"
              description="Reserva una para que te tomemos medidas o para ver telas sin compromiso."
              action={
                <ButtonLink to={paths.bookAppointment} variant="secondary">
                  Agendar una cita
                </ButtonLink>
              }
            />
          ) : (
            <ul role="list" className={s.list}>
              {upcoming.map((appointment) => (
                <li key={appointment.id} className={s.orderCard}>
                  <div>
                    <span className={s.orderNumber}>{appointment.appointmentTypeName}</span>
                    <p className={s.orderMeta}>
                      <span>{formatWeekday(appointment.scheduledAt)}</span>
                      <span>{formatDateTime(appointment.scheduledAt)}</span>
                      <span>Con {appointment.staffName}</span>
                      {appointment.orderNumber ? (
                        <Link to={paths.order(appointment.orderNumber)}>{appointment.orderNumber}</Link>
                      ) : null}
                    </p>
                    {appointment.note ? <p className={s.itemSub}>{appointment.note}</p> : null}
                  </div>
                  <div className={s.orderRight}>
                    <Badge tone="info" size="sm">
                      {formatRelative(appointment.scheduledAt)}
                    </Badge>
                    <small>{appointment.durationMin} min</small>
                    <div className={s.appointmentActions}>
                      <Button variant="ghost" size="sm" onClick={() => setRescheduling(appointment)}>
                        Reprogramar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        isLoading={updateStatus.isPending && updateStatus.variables?.appointmentId === appointment.id}
                        onClick={() => handleCancel(appointment)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card.Body>
      </Card>

      {past.length > 0 ? (
        <Card variant="raised">
          <Card.Header title="Anteriores" />
          <Card.Body>
            <ul role="list" className={s.list}>
              {past.map((appointment) => (
                <li key={appointment.id} className={s.orderCard}>
                  <div>
                    <span className={s.orderNumber}>{appointment.appointmentTypeName}</span>
                    <p className={s.orderMeta}>
                      <span>{formatDateTime(appointment.scheduledAt)}</span>
                      <span>Con {appointment.staffName}</span>
                      {appointment.orderNumber ? (
                        <Link to={paths.order(appointment.orderNumber)}>{appointment.orderNumber}</Link>
                      ) : null}
                    </p>
                  </div>
                  <Badge
                    tone={appointment.status === 'completed' ? 'success' : 'neutral'}
                    size="sm"
                  >
                    {APPOINTMENT_STATUS_LABELS[appointment.status]}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      ) : null}

      {rescheduling ? (
        <RescheduleModal open appointment={rescheduling} onClose={() => setRescheduling(null)} />
      ) : null}
    </div>
  );
}
