import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Icon,
  Input,
  Modal,
  OrderStatusBadge,
  SectionHeading,
  Select,
  Skeleton,
  Table,
  Textarea,
} from '@/components/ui';
import type { Column } from '@/components/ui';
import type { AppointmentTypeCode, MeasurementSet, OrderSummary } from '@real-elegance/shared';
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPES,
  APPOINTMENT_TYPE_LABELS,
  CLOSED_ORDER_STATUSES,
} from '@real-elegance/shared';
import {
  useAddCustomerNote,
  useAdminCustomer,
  useCustomerAppointments,
  useUpdateCustomer,
} from '@/features/admin/hooks';
import { MeasurementModal } from '@/features/admin/MeasurementModal';
import { useAvailability, useCreateAppointment, useStaff } from '@/features/appointments/hooks';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate, formatDateTime, formatPoints, formatTime, formatWeekday } from '@/lib/format';
import { isValidEmail, isValidName, isValidPhoneGT } from '@/lib/validation';
import { cx } from '@/lib/cx';
import s from './admin.module.css';

/** Mañana, en `YYYY-MM-DD`: el hueco más cercano razonable para el selector de día. */
function tomorrow(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

const ORDER_COLUMNS: Array<Column<OrderSummary>> = [
  {
    id: 'orderNumber',
    header: 'Pedido',
    cell: (row) => (
      <Link to={paths.adminOrder(row.orderNumber)} className={s.mono}>
        {row.orderNumber}
      </Link>
    ),
  },
  { id: 'created', header: 'Fecha', hideOnMobile: true, cell: (row) => formatDate(row.createdAt) },
  { id: 'total', header: 'Total', align: 'right', cell: (row) => formatCurrency(row.total) },
  {
    id: 'balance',
    header: 'Saldo',
    align: 'right',
    cell: (row) => (row.balanceDue > 0 ? formatCurrency(row.balanceDue) : '—'),
  },
  {
    id: 'status',
    header: 'Estado',
    align: 'right',
    cell: (row) => <OrderStatusBadge status={row.statusCode} size="sm" />,
  },
];

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const customerId = Number(id);
  const { data: customer, isLoading, isError } = useAdminCustomer(customerId);
  const { user } = useAuth();

  const [measureModalOpen, setMeasureModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<MeasurementSet | null>(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [customerEditOpen, setCustomerEditOpen] = useState(false);
  const { data: appointments } = useCustomerAppointments(customerId);

  if (isLoading) {
    return <Skeleton height="480px" radius="var(--radius-md)" />;
  }

  if (isError || !customer) {
    return (
      <EmptyState
        tone="error"
        title="No encontramos ese cliente"
        action={
          <ButtonLink to={paths.adminCustomers} variant="primary">
            Volver a clientes
          </ButtonLink>
        }
      />
    );
  }

  const staffName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Personal del taller';

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow={<Link to={paths.adminCustomers}>← Clientes</Link>}
        title={`${customer.firstName} ${customer.lastName}`}
        description={
          <span className={s.contactLine}>
            <span>
              <Icon name="user" size={13} /> {customer.email}
            </span>
            {customer.phone ? <span>{customer.phone}</span> : null}
            <span>Cliente desde {formatDate(customer.createdAt)}</span>
          </span>
        }
        action={
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon name="edit" size={14} />}
            onClick={() => setCustomerEditOpen(true)}
          >
            Editar datos
          </Button>
        }
      />

      <div className={s.stats}>
        <div className={s.stat}>
          <span className={s.statHead}>
            <Icon name="package" size={14} /> Pedidos
          </span>
          <span className={s.statValue}>{customer.totalOrders}</span>
        </div>
        <div className={s.stat}>
          <span className={s.statHead}>
            <Icon name="creditCard" size={14} /> Gastado
          </span>
          <span className={s.statValue}>{formatCurrency(customer.totalSpent)}</span>
        </div>
        <div className={s.stat}>
          <span className={s.statHead}>
            <Icon name="star" size={14} /> Puntos
          </span>
          <span className={s.statValue}>{formatPoints(customer.pointsBalance)}</span>
        </div>
        <div className={s.stat}>
          <span className={s.statHead}>
            <Icon name="calendar" size={14} /> Última compra
          </span>
          <span className={s.statValue}>{formatDate(customer.lastOrderAt, 'Sin compras')}</span>
        </div>
      </div>

      {/* ── Medidas ──────────────────────────────────────────────────────── */}
      <Card variant="raised">
        <Card.Header
          title="Medidas"
          subtitle="Se toman en el taller. El cliente solo las consulta desde su cuenta."
          aside={
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Icon name="ruler" size={14} />}
              onClick={() => {
                setEditingSet(null);
                setMeasureModalOpen(true);
              }}
            >
              Tomar nueva ficha
            </Button>
          }
        />
        <Card.Body>
          {customer.measurementSets.length === 0 ? (
            <EmptyState
              size="sm"
              icon="ruler"
              title="Todavía no hay medidas registradas"
              description="Se toman en la primera cita del cliente en el taller."
            />
          ) : (
            <div className={s.lineItems}>
              {customer.measurementSets.map((set) => (
                <Card key={set.id} variant="outlined">
                  <Card.Header
                    eyebrow={`Tomadas el ${formatDate(set.takenAt)}`}
                    title="Ficha de medidas"
                    subtitle={set.takenByName ? `Por ${set.takenByName}` : undefined}
                    aside={
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<Icon name="edit" size={14} />}
                        onClick={() => {
                          setEditingSet(set);
                          setMeasureModalOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                    }
                  />
                  <Card.Body>
                    <dl className={s.measureGrid}>
                      {set.values.map((value) => (
                        <div key={value.id} className={s.measure}>
                          <dt>{value.name}</dt>
                          <dd>
                            {value.valueCm} {value.unit}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {set.note ? (
                      <p className={cx(s.noteText, 're-mt-4')}>
                        <Icon name="info" size={14} /> {set.note}
                      </p>
                    ) : null}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* ── Pedidos ──────────────────────────────────────────────────────── */}
      <Card variant="raised">
        <Card.Header
          title="Pedidos"
          subtitle="Todo lo que este cliente ha encargado en el taller."
          aside={
            <ButtonLink
              size="sm"
              variant="secondary"
              to={`${paths.adminNewOrder}?customerId=${customer.id}`}
              leftIcon={<Icon name="plus" size={14} />}
            >
              Nuevo pedido
            </ButtonLink>
          }
        />
        <Card.Body>
          {customer.orders.length === 0 ? (
            <EmptyState size="sm" icon="package" title="Sin pedidos todavía" />
          ) : (
            <Table
              columns={ORDER_COLUMNS}
              rows={customer.orders}
              rowKey={(row) => row.id}
              caption={`Pedidos de ${customer.firstName} ${customer.lastName}`}
            />
          )}
        </Card.Body>
      </Card>

      {/* ── Citas ────────────────────────────────────────────────────────── */}
      <Card variant="raised">
        <Card.Header
          title="Citas"
          subtitle="Toma de medidas, pruebas y entregas agendadas con este cliente."
          aside={
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Icon name="calendar" size={14} />}
              onClick={() => setAppointmentModalOpen(true)}
            >
              Agendar cita
            </Button>
          }
        />
        <Card.Body>
          {!appointments || appointments.length === 0 ? (
            <EmptyState size="sm" icon="calendar" title="Sin citas agendadas" />
          ) : (
            <div className={s.lineItems}>
              {appointments.map((appointment) => (
                <div key={appointment.id} className={s.detailRow}>
                  <div className={s.detailRowMain}>
                    <span className={s.itemName} style={{ fontSize: 'var(--text-base)' }}>
                      {appointment.appointmentTypeName}
                    </span>
                    <span className={s.detailRowMeta}>
                      <span>{formatDateTime(appointment.scheduledAt)}</span>
                      {appointment.staffName ? <span>Con {appointment.staffName}</span> : null}
                      {appointment.orderNumber ? (
                        <Link to={paths.adminOrder(appointment.orderNumber)} className={s.mono}>
                          {appointment.orderNumber}
                        </Link>
                      ) : null}
                    </span>
                  </div>
                  <span className={s.detailRowValue} style={{ fontSize: 'var(--text-sm)' }}>
                    {APPOINTMENT_STATUS_LABELS[appointment.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* ── Notas ────────────────────────────────────────────────────────── */}
      <Card variant="raised">
        <Card.Header title="Notas" subtitle="Preferencias, alergias, quién lo refirió." />
        <Card.Body>
          {customer.notes.length === 0 ? (
            <p className={s.cellSub}>Todavía no hay notas de este cliente.</p>
          ) : (
            <ul className={s.noteList}>
              {customer.notes.map((note) => (
                <li key={note.id} className={s.noteItem}>
                  <p className={s.noteText}>{note.note}</p>
                  <p className={s.noteMeta}>
                    {note.authorName ?? 'Personal del taller'} · {formatDateTime(note.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <CustomerNoteForm customerId={customer.id} authorName={staffName || 'Personal del taller'} />
        </Card.Body>
      </Card>

      <MeasurementModal
        open={measureModalOpen}
        onClose={() => setMeasureModalOpen(false)}
        customerId={customer.id}
        editing={editingSet}
      />

      <AppointmentModal
        open={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        customerId={customer.id}
        orders={customer.orders}
      />

      <CustomerEditModal
        open={customerEditOpen}
        onClose={() => setCustomerEditOpen(false)}
        customer={customer}
      />
    </div>
  );
}

function CustomerNoteForm({ customerId, authorName }: { customerId: number; authorName: string }) {
  const [noteText, setNoteText] = useState('');
  const addNote = useAddCustomerNote();
  const toast = useToast();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!noteText.trim()) return;
    try {
      await addNote.mutateAsync({ customerId, note: noteText, authorName });
      setNoteText('');
      toast.success('Nota guardada');
    } catch (error) {
      toast.error('No se pudo guardar', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className={s.noteForm}>
      <Textarea
        label="Agregar nota"
        placeholder="Por ejemplo: prefiere telas ligeras, alérgico al forro sintético…"
        value={noteText}
        onChange={(event) => setNoteText(event.target.value)}
      />
      <Button type="submit" variant="secondary" size="sm" isLoading={addNote.isPending}>
        Agregar nota
      </Button>
    </form>
  );
}

/** Corrige nombre, correo o teléfono de un cliente ya registrado. */
function CustomerEditModal({
  open,
  onClose,
  customer,
}: {
  open: boolean;
  onClose: () => void;
  customer: { id: number; firstName: string; lastName: string; email: string; phone: string | null };
}) {
  const updateCustomer = useUpdateCustomer();
  const toast = useToast();

  const [firstName, setFirstName] = useState(customer.firstName);
  const [lastName, setLastName] = useState(customer.lastName);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone ?? '');

  useEffect(() => {
    if (!open) return;
    setFirstName(customer.firstName);
    setLastName(customer.lastName);
    setEmail(customer.email);
    setPhone(customer.phone ?? '');
  }, [open, customer]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!isValidName(firstName) || !isValidName(lastName)) {
      toast.error('Revisa el nombre', 'Nombre y apellidos deben tener entre 2 y 60 letras.');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Revisa el correo', 'Ingresa un correo válido. Por ejemplo: nombre@dominio.com.');
      return;
    }
    if (phone.trim() && !isValidPhoneGT(phone)) {
      toast.error('Revisa el teléfono', 'Ingresa un teléfono válido de 8 dígitos. Por ejemplo: 5555-1234.');
      return;
    }

    try {
      await updateCustomer.mutateAsync({ id: customer.id, firstName, lastName, email, phone });
      toast.success('Datos actualizados');
      onClose();
    } catch (error) {
      toast.error(
        'No se pudo guardar',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar datos del cliente"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-customer-form" variant="primary" isLoading={updateCustomer.isPending}>
            Guardar cambios
          </Button>
        </>
      }
    >
      <form id="edit-customer-form" onSubmit={handleSubmit} className={s.formGrid2}>
        <Input label="Nombre" required value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        <Input label="Apellidos" required value={lastName} onChange={(event) => setLastName(event.target.value)} />
        <Input
          label="Correo electrónico"
          type="email"
          required
          fieldClassName={s.span2}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Teléfono"
          type="tel"
          placeholder="+502 5555 1234"
          fieldClassName={s.span2}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </form>
    </Modal>
  );
}

/**
 * Agenda una cita en nombre del cliente. Es el mismo trámite que
 * `BookAppointmentPage` (motivo → día y sastre → horario → nota), pero desde
 * el mostrador: antes solo el propio cliente podía abrir ese asistente desde
 * su cuenta, así que una cita de mostrador —el caso más común— no se podía
 * registrar en el sistema.
 */
function AppointmentModal({
  open,
  onClose,
  customerId,
  orders,
}: {
  open: boolean;
  onClose: () => void;
  customerId: number;
  orders: OrderSummary[];
}) {
  const [type, setType] = useState<AppointmentTypeCode>('medidas');
  const [date, setDate] = useState(tomorrow());
  const [staffId, setStaffId] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);

  const { data: slots, isLoading } = useAvailability(date, staffId);
  const { data: staff } = useStaff();
  const createAppointment = useCreateAppointment();
  const toast = useToast();

  const chosen = slots?.find((item) => item.startsAt === slot);
  const openOrders = orders.filter((order) => !CLOSED_ORDER_STATUSES.includes(order.statusCode));

  function reset() {
    setType('medidas');
    setDate(tomorrow());
    setStaffId(null);
    setSlot(null);
    setNote('');
    setOrderId(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!chosen) return;

    try {
      await createAppointment.mutateAsync({
        customerId,
        appointmentTypeCode: type,
        staffId: chosen.staffId,
        scheduledAt: chosen.startsAt,
        note: note || undefined,
        orderId: orderId ?? undefined,
      });
      toast.success('Cita agendada', `${formatWeekday(chosen.startsAt)} a las ${formatTime(chosen.startsAt)}.`);
      reset();
      onClose();
    } catch (error) {
      toast.error(
        'No se pudo agendar la cita',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Agendar cita"
      description="Para tomar medidas, una prueba, una consulta o una entrega."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="appointment-form"
            variant="primary"
            isLoading={createAppointment.isPending}
            disabled={!chosen}
          >
            Agendar cita
          </Button>
        </>
      }
    >
      <form id="appointment-form" onSubmit={handleSubmit} className={s.formGrid2}>
        <Select
          label="Motivo"
          fieldClassName={s.span2}
          value={type}
          onChange={(event) => setType(event.target.value as AppointmentTypeCode)}
          options={APPOINTMENT_TYPES.map((code) => ({ value: code, label: APPOINTMENT_TYPE_LABELS[code] }))}
        />
        <Input
          label="Día"
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
          fieldClassName={s.span2}
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
        {openOrders.length > 0 ? (
          <Select
            label="Pedido relacionado"
            placeholder="Ninguno en particular"
            fieldClassName={s.span2}
            value={orderId ?? ''}
            onChange={(event) => setOrderId(event.target.value ? Number(event.target.value) : null)}
            hint="Si es una prueba o una entrega, dinos de qué pedido."
            options={openOrders.map((order) => ({ value: order.id, label: order.orderNumber }))}
          />
        ) : null}
        <Textarea
          label="Nota"
          placeholder="Por ejemplo: vengo con poco tiempo."
          fieldClassName={s.span2}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          hint="Opcional."
        />
      </form>
    </Modal>
  );
}
