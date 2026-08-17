import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, ButtonLink, Card, EmptyState, Icon, Input, Modal, OrderStatusBadge, SectionHeading, Select, Skeleton, Table, Textarea, } from '@/components/ui';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_TYPES, APPOINTMENT_TYPE_LABELS, CLOSED_ORDER_STATUSES, } from '@real-elegance/shared';
import { useAddCustomerNote, useAdminCustomer, useCustomerAppointments, useUpdateCustomer, } from '@/features/admin/hooks';
import { MeasurementModal } from '@/features/admin/MeasurementModal';
import { useAvailability, useCreateAppointment, useStaff } from '@/features/appointments/hooks';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate, formatDateTime, formatPoints, formatTime, formatWeekday } from '@/lib/format';
import { isValidEmail, isValidName, isValidPhoneGT } from '@/lib/validation';
import s from './admin.module.css';
/** Mañana, en `YYYY-MM-DD`: el hueco más cercano razonable para el selector de día. */
function tomorrow() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
}
const ORDER_COLUMNS = [
    {
        id: 'orderNumber',
        header: 'Pedido',
        cell: (row) => (_jsx(Link, { to: paths.adminOrder(row.orderNumber), className: s.mono, children: row.orderNumber })),
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
        cell: (row) => _jsx(OrderStatusBadge, { status: row.statusCode, size: "sm" }),
    },
];
export default function AdminCustomerDetailPage() {
    const { id } = useParams();
    const customerId = Number(id);
    const { data: customer, isLoading, isError } = useAdminCustomer(customerId);
    const { user } = useAuth();
    const [measureModalOpen, setMeasureModalOpen] = useState(false);
    const [editingSet, setEditingSet] = useState(null);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [customerEditOpen, setCustomerEditOpen] = useState(false);
    const { data: appointments } = useCustomerAppointments(customerId);
    if (isLoading) {
        return _jsx(Skeleton, { height: "480px", radius: "var(--radius-md)" });
    }
    if (isError || !customer) {
        return (_jsx(EmptyState, { tone: "error", title: "No encontramos ese cliente", action: _jsx(ButtonLink, { to: paths.adminCustomers, variant: "primary", children: "Volver a clientes" }) }));
    }
    const staffName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Personal del taller';
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: _jsx(Link, { to: paths.adminCustomers, children: "\u2190 Clientes" }), title: `${customer.firstName} ${customer.lastName}`, description: _jsxs("span", { className: s.contactLine, children: [_jsxs("span", { children: [_jsx(Icon, { name: "user", size: 13 }), " ", customer.email] }), customer.phone ? _jsx("span", { children: customer.phone }) : null, _jsxs("span", { children: ["Cliente desde ", formatDate(customer.createdAt)] })] }), action: _jsx(Button, { size: "sm", variant: "ghost", leftIcon: _jsx(Icon, { name: "edit", size: 14 }), onClick: () => setCustomerEditOpen(true), children: "Editar datos" }) }), _jsxs("div", { className: s.stats, children: [_jsxs("div", { className: s.stat, children: [_jsxs("span", { className: s.statHead, children: [_jsx(Icon, { name: "package", size: 14 }), " Pedidos"] }), _jsx("span", { className: s.statValue, children: customer.totalOrders })] }), _jsxs("div", { className: s.stat, children: [_jsxs("span", { className: s.statHead, children: [_jsx(Icon, { name: "creditCard", size: 14 }), " Gastado"] }), _jsx("span", { className: s.statValue, children: formatCurrency(customer.totalSpent) })] }), _jsxs("div", { className: s.stat, children: [_jsxs("span", { className: s.statHead, children: [_jsx(Icon, { name: "star", size: 14 }), " Puntos"] }), _jsx("span", { className: s.statValue, children: formatPoints(customer.pointsBalance) })] }), _jsxs("div", { className: s.stat, children: [_jsxs("span", { className: s.statHead, children: [_jsx(Icon, { name: "calendar", size: 14 }), " \u00DAltima compra"] }), _jsx("span", { className: s.statValue, children: formatDate(customer.lastOrderAt, 'Sin compras') })] })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Medidas", subtitle: "Se toman en el taller. El cliente solo las consulta desde su cuenta.", aside: _jsx(Button, { size: "sm", variant: "secondary", leftIcon: _jsx(Icon, { name: "ruler", size: 14 }), onClick: () => {
                                setEditingSet(null);
                                setMeasureModalOpen(true);
                            }, children: "Tomar nueva ficha" }) }), _jsx(Card.Body, { children: customer.measurementSets.length === 0 ? (_jsx(EmptyState, { size: "sm", icon: "ruler", title: "Todav\u00EDa no hay medidas registradas", description: "Se toman en la primera cita del cliente en el taller." })) : (_jsx("div", { className: s.lineItems, children: customer.measurementSets.map((set) => (_jsxs(Card, { variant: "outlined", children: [_jsx(Card.Header, { eyebrow: `Tomadas el ${formatDate(set.takenAt)}`, title: "Ficha de medidas", subtitle: set.takenByName ? `Por ${set.takenByName}` : undefined, aside: _jsx(Button, { size: "sm", variant: "ghost", leftIcon: _jsx(Icon, { name: "edit", size: 14 }), onClick: () => {
                                                setEditingSet(set);
                                                setMeasureModalOpen(true);
                                            }, children: "Editar" }) }), _jsxs(Card.Body, { children: [_jsx("dl", { className: s.measureGrid, children: set.values.map((value) => (_jsxs("div", { className: s.measure, children: [_jsx("dt", { children: value.name }), _jsxs("dd", { children: [value.valueCm, " ", value.unit] })] }, value.id))) }), set.note ? (_jsxs("p", { className: s.noteText, style: { marginTop: 'var(--space-4)' }, children: [_jsx(Icon, { name: "info", size: 14 }), " ", set.note] })) : null] })] }, set.id))) })) })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Pedidos", subtitle: "Todo lo que este cliente ha encargado en el taller.", aside: _jsx(ButtonLink, { size: "sm", variant: "secondary", to: `${paths.adminNewOrder}?customerId=${customer.id}`, leftIcon: _jsx(Icon, { name: "plus", size: 14 }), children: "Nuevo pedido" }) }), _jsx(Card.Body, { children: customer.orders.length === 0 ? (_jsx(EmptyState, { size: "sm", icon: "package", title: "Sin pedidos todav\u00EDa" })) : (_jsx(Table, { columns: ORDER_COLUMNS, rows: customer.orders, rowKey: (row) => row.id, caption: `Pedidos de ${customer.firstName} ${customer.lastName}` })) })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Citas", subtitle: "Toma de medidas, pruebas y entregas agendadas con este cliente.", aside: _jsx(Button, { size: "sm", variant: "secondary", leftIcon: _jsx(Icon, { name: "calendar", size: 14 }), onClick: () => setAppointmentModalOpen(true), children: "Agendar cita" }) }), _jsx(Card.Body, { children: !appointments || appointments.length === 0 ? (_jsx(EmptyState, { size: "sm", icon: "calendar", title: "Sin citas agendadas" })) : (_jsx("div", { className: s.lineItems, children: appointments.map((appointment) => (_jsxs("div", { className: s.detailRow, children: [_jsxs("div", { className: s.detailRowMain, children: [_jsx("span", { className: s.itemName, style: { fontSize: 'var(--text-base)' }, children: appointment.appointmentTypeName }), _jsxs("span", { className: s.detailRowMeta, children: [_jsx("span", { children: formatDateTime(appointment.scheduledAt) }), appointment.staffName ? _jsxs("span", { children: ["Con ", appointment.staffName] }) : null, appointment.orderNumber ? (_jsx(Link, { to: paths.adminOrder(appointment.orderNumber), className: s.mono, children: appointment.orderNumber })) : null] })] }), _jsx("span", { className: s.detailRowValue, style: { fontSize: 'var(--text-sm)' }, children: APPOINTMENT_STATUS_LABELS[appointment.status] })] }, appointment.id))) })) })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Notas", subtitle: "Preferencias, alergias, qui\u00E9n lo refiri\u00F3." }), _jsxs(Card.Body, { children: [customer.notes.length === 0 ? (_jsx("p", { className: s.cellSub, children: "Todav\u00EDa no hay notas de este cliente." })) : (_jsx("ul", { className: s.noteList, children: customer.notes.map((note) => (_jsxs("li", { className: s.noteItem, children: [_jsx("p", { className: s.noteText, children: note.note }), _jsxs("p", { className: s.noteMeta, children: [note.authorName ?? 'Personal del taller', " \u00B7 ", formatDateTime(note.createdAt)] })] }, note.id))) })), _jsx(CustomerNoteForm, { customerId: customer.id, authorName: staffName || 'Personal del taller' })] })] }), _jsx(MeasurementModal, { open: measureModalOpen, onClose: () => setMeasureModalOpen(false), customerId: customer.id, editing: editingSet }), _jsx(AppointmentModal, { open: appointmentModalOpen, onClose: () => setAppointmentModalOpen(false), customerId: customer.id, orders: customer.orders }), _jsx(CustomerEditModal, { open: customerEditOpen, onClose: () => setCustomerEditOpen(false), customer: customer })] }));
}
function CustomerNoteForm({ customerId, authorName }) {
    const [noteText, setNoteText] = useState('');
    const addNote = useAddCustomerNote();
    const toast = useToast();
    async function handleSubmit(event) {
        event.preventDefault();
        if (!noteText.trim())
            return;
        try {
            await addNote.mutateAsync({ customerId, note: noteText, authorName });
            setNoteText('');
            toast.success('Nota guardada');
        }
        catch (error) {
            toast.error('No se pudo guardar', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: s.noteForm, children: [_jsx(Textarea, { label: "Agregar nota", placeholder: "Por ejemplo: prefiere telas ligeras, al\u00E9rgico al forro sint\u00E9tico\u2026", value: noteText, onChange: (event) => setNoteText(event.target.value) }), _jsx(Button, { type: "submit", variant: "secondary", size: "sm", isLoading: addNote.isPending, children: "Agregar nota" })] }));
}
/** Corrige nombre, correo o teléfono de un cliente ya registrado. */
function CustomerEditModal({ open, onClose, customer, }) {
    const updateCustomer = useUpdateCustomer();
    const toast = useToast();
    const [firstName, setFirstName] = useState(customer.firstName);
    const [lastName, setLastName] = useState(customer.lastName);
    const [email, setEmail] = useState(customer.email);
    const [phone, setPhone] = useState(customer.phone ?? '');
    useEffect(() => {
        if (!open)
            return;
        setFirstName(customer.firstName);
        setLastName(customer.lastName);
        setEmail(customer.email);
        setPhone(customer.phone ?? '');
    }, [open, customer]);
    async function handleSubmit(event) {
        event.preventDefault();
        if (!isValidName(firstName) || !isValidName(lastName)) {
            toast.error('Revisa el nombre', 'Nombre y apellidos deben tener entre 2 y 60 letras.');
            return;
        }
        if (!isValidEmail(email)) {
            toast.error('Revisa el correo', 'Ingresa un correo válido, ej. nombre@dominio.com.');
            return;
        }
        if (phone.trim() && !isValidPhoneGT(phone)) {
            toast.error('Revisa el teléfono', 'Ingresa un teléfono válido de 8 dígitos (ej. 5555-1234).');
            return;
        }
        try {
            await updateCustomer.mutateAsync({ id: customer.id, firstName, lastName, email, phone });
            toast.success('Datos actualizados');
            onClose();
        }
        catch (error) {
            toast.error('No se pudo guardar', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsx(Modal, { open: open, onClose: onClose, title: "Editar datos del cliente", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", onClick: onClose, children: "Cancelar" }), _jsx(Button, { type: "submit", form: "edit-customer-form", variant: "primary", isLoading: updateCustomer.isPending, children: "Guardar cambios" })] }), children: _jsxs("form", { id: "edit-customer-form", onSubmit: handleSubmit, className: s.formGrid2, children: [_jsx(Input, { label: "Nombre", required: true, value: firstName, onChange: (event) => setFirstName(event.target.value) }), _jsx(Input, { label: "Apellidos", required: true, value: lastName, onChange: (event) => setLastName(event.target.value) }), _jsx(Input, { label: "Correo electr\u00F3nico", type: "email", required: true, fieldClassName: s.span2, value: email, onChange: (event) => setEmail(event.target.value) }), _jsx(Input, { label: "Tel\u00E9fono", type: "tel", placeholder: "+502 5555 1234", fieldClassName: s.span2, value: phone, onChange: (event) => setPhone(event.target.value) })] }) }));
}
/**
 * Agenda una cita en nombre del cliente. Es el mismo trámite que
 * `BookAppointmentPage` (motivo → día y sastre → horario → nota), pero desde
 * el mostrador: antes solo el propio cliente podía abrir ese asistente desde
 * su cuenta, así que una cita de mostrador —el caso más común— no se podía
 * registrar en el sistema.
 */
function AppointmentModal({ open, onClose, customerId, orders, }) {
    const [type, setType] = useState('medidas');
    const [date, setDate] = useState(tomorrow());
    const [staffId, setStaffId] = useState(null);
    const [slot, setSlot] = useState(null);
    const [note, setNote] = useState('');
    const [orderId, setOrderId] = useState(null);
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
    async function handleSubmit(event) {
        event.preventDefault();
        if (!chosen)
            return;
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
        }
        catch (error) {
            toast.error('No se pudo agendar la cita', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsx(Modal, { open: open, onClose: onClose, title: "Agendar cita", description: "Para tomar medidas, una prueba, una consulta o una entrega.", size: "lg", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", onClick: onClose, children: "Cancelar" }), _jsx(Button, { type: "submit", form: "appointment-form", variant: "primary", isLoading: createAppointment.isPending, disabled: !chosen, children: "Agendar cita" })] }), children: _jsxs("form", { id: "appointment-form", onSubmit: handleSubmit, className: s.formGrid2, children: [_jsx(Select, { label: "Motivo", fieldClassName: s.span2, value: type, onChange: (event) => setType(event.target.value), options: APPOINTMENT_TYPES.map((code) => ({ value: code, label: APPOINTMENT_TYPE_LABELS[code] })) }), _jsx(Input, { label: "D\u00EDa", type: "date", min: tomorrow(), value: date, onChange: (event) => {
                        setDate(event.target.value);
                        setSlot(null);
                    } }), _jsx(Select, { label: "Con qui\u00E9n", placeholder: "Cualquiera disponible", value: staffId ?? '', onChange: (event) => {
                        setStaffId(event.target.value ? Number(event.target.value) : null);
                        setSlot(null);
                    }, options: (staff ?? [])
                        .filter((member) => member.isAvailable)
                        .map((member) => ({ value: member.id, label: `${member.firstName} ${member.lastName}` })) }), _jsx(Select, { label: "Horario", fieldClassName: s.span2, placeholder: isLoading ? 'Buscando huecos…' : 'Elige un horario', value: slot ?? '', onChange: (event) => setSlot(event.target.value || null), disabled: isLoading || !slots || slots.length === 0, options: (slots ?? []).map((item) => ({
                        value: item.startsAt,
                        label: `${formatWeekday(item.startsAt)}, ${formatTime(item.startsAt)} — ${item.staffName}`,
                    })), hint: !isLoading && slots && slots.length === 0 ? 'No quedan huecos ese día.' : undefined }), openOrders.length > 0 ? (_jsx(Select, { label: "Pedido relacionado", placeholder: "Ninguno en particular", fieldClassName: s.span2, value: orderId ?? '', onChange: (event) => setOrderId(event.target.value ? Number(event.target.value) : null), hint: "Si es una prueba o una entrega, dinos de qu\u00E9 pedido.", options: openOrders.map((order) => ({ value: order.id, label: order.orderNumber })) })) : null, _jsx(Textarea, { label: "Nota", placeholder: "Por ejemplo: vengo con poco tiempo.", fieldClassName: s.span2, value: note, onChange: (event) => setNote(event.target.value), hint: "Opcional." })] }) }));
}
//# sourceMappingURL=AdminCustomerDetailPage.js.map