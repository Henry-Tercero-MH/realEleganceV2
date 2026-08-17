import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Input, Modal, Select } from '@/components/ui';
import type { Appointment } from '@real-elegance/shared';
import { useAvailability, useRescheduleAppointment, useStaff } from './hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { formatTime, formatWeekday } from '@/lib/format';
import s from './RescheduleModal.module.css';

/** Mañana, en `YYYY-MM-DD`. */
function tomorrow(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
}

/**
 * Cambia el día, la hora o el sastre de una cita que sigue agendada. Antes no
 * existía ninguna forma de reprogramar: la única salida era dejarla como
 * estaba o perderla del todo.
 */
export function RescheduleModal({ open, onClose, appointment }: RescheduleModalProps) {
  const [date, setDate] = useState(tomorrow());
  const [staffId, setStaffId] = useState<number | null>(appointment.staffId);
  const [slot, setSlot] = useState<string | null>(null);

  const { data: staff } = useStaff();
  const { data: slots, isLoading } = useAvailability(date, staffId);
  const reschedule = useRescheduleAppointment();
  const toast = useToast();

  const chosen = slots?.find((item) => item.startsAt === slot);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!chosen) return;

    try {
      await reschedule.mutateAsync({
        appointmentId: appointment.id,
        staffId: chosen.staffId,
        scheduledAt: chosen.startsAt,
      });
      toast.success('Cita reprogramada', `${formatWeekday(chosen.startsAt)} a las ${formatTime(chosen.startsAt)}.`);
      onClose();
    } catch (error) {
      toast.error(
        'No se pudo reprogramar',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reprogramar cita"
      description={appointment.appointmentTypeName}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="reschedule-form"
            variant="primary"
            isLoading={reschedule.isPending}
            disabled={!chosen}
          >
            Confirmar horario
          </Button>
        </>
      }
    >
      <form id="reschedule-form" onSubmit={handleSubmit} className={s.form}>
        <Input
          label="Nuevo día"
          type="date"
          min={tomorrow()}
          value={date}
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
            .map((member) => ({ value: member.id, label: `${member.firstName} ${member.lastName}` }))}
        />
        <Select
          label="Horario"
          placeholder={isLoading ? 'Buscando huecos…' : 'Elige un horario'}
          value={slot ?? ''}
          onChange={(event) => setSlot(event.target.value || null)}
          disabled={isLoading || !slots || slots.length === 0}
          options={(slots ?? []).map((item) => ({
            value: item.startsAt,
            label: `${formatWeekday(item.startsAt)}, ${formatTime(item.startsAt)} — ${item.staffName}`,
          }))}
          hint={!isLoading && slots && slots.length === 0 ? 'No quedan huecos ese día.' : undefined}
        />
      </form>
    </Modal>
  );
}
