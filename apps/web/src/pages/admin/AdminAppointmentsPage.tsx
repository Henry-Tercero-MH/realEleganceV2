import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Select, SectionHeading, Skeleton, Table } from '@/components/ui';
import type { Column } from '@/components/ui';
import type { Appointment, AppointmentStatus } from '@real-elegance/shared';
import { APPOINTMENT_STATUS_LABELS } from '@real-elegance/shared';
import { useAdminAppointments } from '@/features/admin/hooks';
import { useUpdateAppointmentStatus } from '@/features/appointments/hooks';
import { RescheduleModal } from '@/features/appointments/RescheduleModal';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatDateTime } from '@/lib/format';
import s from './admin.module.css';

const STATUS_OPTIONS: Array<{ value: AppointmentStatus; label: string }> = [
  { value: 'completed', label: APPOINTMENT_STATUS_LABELS.completed },
  { value: 'no_show', label: APPOINTMENT_STATUS_LABELS.no_show },
  { value: 'cancelled', label: APPOINTMENT_STATUS_LABELS.cancelled },
];

export default function AdminAppointmentsPage() {
  const { data: appointments, isLoading } = useAdminAppointments();
  const updateStatus = useUpdateAppointmentStatus();
  const toast = useToast();
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);

  async function handleStatusChange(appointmentId: number, status: AppointmentStatus) {
    try {
      await updateStatus.mutateAsync({ appointmentId, status });
      toast.success('Cita actualizada', APPOINTMENT_STATUS_LABELS[status]);
    } catch (error) {
      toast.error(
        'No se pudo actualizar',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  const columns: Array<Column<Appointment>> = [
    {
      id: 'customer',
      header: 'Cliente',
      cell: (row) => (
        <div>
          <span className={s.cellName}>{row.customerName}</span>
          <span className={s.cellSub}>{row.appointmentTypeName}</span>
          {row.orderNumber ? (
            <Link to={paths.adminOrder(row.orderNumber)} className={s.mono}>
              {row.orderNumber}
            </Link>
          ) : null}
        </div>
      ),
    },
    { id: 'staff', header: 'Atiende', hideOnMobile: true, cell: (row) => row.staffName ?? '—' },
    { id: 'when', header: 'Fecha y hora', cell: (row) => formatDateTime(row.scheduledAt) },
    { id: 'duration', header: 'Duración', align: 'right', hideOnMobile: true, cell: (row) => `${row.durationMin} min` },
    {
      id: 'status',
      header: 'Estado',
      cell: (row) => (
        <Badge
          tone={
            row.status === 'completed'
              ? 'success'
              : row.status === 'cancelled' || row.status === 'no_show'
                ? 'danger'
                : 'info'
          }
          size="sm"
        >
          {APPOINTMENT_STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      align: 'right',
      cell: (row) =>
        row.status === 'scheduled' ? (
          <div className={s.tableActions}>
            <Button variant="ghost" size="sm" onClick={() => setRescheduling(row)}>
              Reprogramar
            </Button>
            <Select
              aria-label={`Cambiar estado de la cita de ${row.customerName}`}
              placeholder="Cambiar a…"
              value=""
              onChange={(event) => handleStatusChange(row.id, event.target.value as AppointmentStatus)}
              options={STATUS_OPTIONS}
            />
          </div>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Operación"
        title="Citas"
        description="Agenda completa del taller: medidas, pruebas, consultas y entregas."
      />

      {isLoading ? (
        <Skeleton height="320px" radius="var(--radius-md)" />
      ) : (
        <Table
          columns={columns}
          rows={appointments ?? []}
          rowKey={(row) => row.id}
          caption="Citas del taller"
        />
      )}

      <p className={s.designNote}>
        Los solapes de horario los impide <code>trg_appointments_no_overlap</code>: un mismo sastre
        no puede tener dos citas que se crucen.
      </p>

      {rescheduling ? (
        <RescheduleModal open appointment={rescheduling} onClose={() => setRescheduling(null)} />
      ) : null}
    </div>
  );
}
