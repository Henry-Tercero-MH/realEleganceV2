import { Badge, SectionHeading, Skeleton, Table } from '@/components/ui';
import type { Column } from '@/components/ui';
import type { Appointment } from '@real-elegance/shared';
import { APPOINTMENT_STATUS_LABELS } from '@real-elegance/shared';
import { useAdminAppointments } from '@/features/admin/hooks';
import { formatDateTime } from '@/lib/format';
import s from './admin.module.css';

const COLUMNS: Array<Column<Appointment>> = [
  {
    id: 'customer',
    header: 'Cliente',
    cell: (row) => (
      <div>
        <span className={s.cellName}>{row.customerName}</span>
        <span className={s.cellSub}>{row.appointmentTypeName}</span>
      </div>
    ),
  },
  { id: 'staff', header: 'Atiende', hideOnMobile: true, cell: (row) => row.staffName ?? '—' },
  { id: 'when', header: 'Fecha y hora', cell: (row) => formatDateTime(row.scheduledAt) },
  { id: 'duration', header: 'Duración', align: 'right', cell: (row) => `${row.durationMin} min` },
  {
    id: 'status',
    header: 'Estado',
    align: 'right',
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
];

export default function AdminAppointmentsPage() {
  const { data: appointments, isLoading } = useAdminAppointments();

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
          columns={COLUMNS}
          rows={appointments ?? []}
          rowKey={(row) => row.id}
          caption="Citas del taller"
        />
      )}

      <p className={s.designNote}>
        Los solapes de horario los impide <code>trg_appointments_no_overlap</code>: un mismo sastre
        no puede tener dos citas que se crucen.
      </p>
    </div>
  );
}
