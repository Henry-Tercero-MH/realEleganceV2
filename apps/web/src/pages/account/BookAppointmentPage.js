import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, EmptyState, Icon, Input, OptionCard, SectionHeading, Select, Skeleton, Textarea, } from '@/components/ui';
import { APPOINTMENT_TYPES, APPOINTMENT_TYPE_LABELS, CLOSED_ORDER_STATUSES } from '@real-elegance/shared';
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
function tomorrow() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
}
export default function BookAppointmentPage() {
    const [type, setType] = useState('medidas');
    const [date, setDate] = useState(tomorrow());
    const [staffId, setStaffId] = useState(null);
    const [slot, setSlot] = useState(null);
    const [note, setNote] = useState('');
    const [orderId, setOrderId] = useState(null);
    const { data: staff } = useStaff();
    const { data: slots, isLoading } = useAvailability(date, staffId);
    const { data: orders } = useMyOrders();
    const createAppointment = useCreateAppointment();
    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const chosen = slots?.find((item) => item.startsAt === slot);
    async function handleSubmit(event) {
        event.preventDefault();
        if (!chosen)
            return;
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
        }
        catch (error) {
            toast.error('No pudimos agendar la cita', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Paso 4 de 8 \u00B7 Cita", title: "Agendar una cita", description: "Elige el motivo, el d\u00EDa y la hora. Te confirmaremos por correo." }), _jsxs("form", { onSubmit: handleSubmit, className: b.form, children: [_jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "\u00BFPara qu\u00E9 vienes?" }), _jsx(Card.Body, { children: _jsx("div", { className: b.typeGrid, children: APPOINTMENT_TYPES.map((code) => (_jsx(OptionCard, { name: "tipo-cita", value: code, checked: type === code, onChange: (value) => setType(value), title: APPOINTMENT_TYPE_LABELS[code] }, code))) }) })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "\u00BFCu\u00E1ndo?" }), _jsxs(Card.Body, { children: [_jsxs("div", { className: b.filters, children: [_jsx(Input, { label: "D\u00EDa", type: "date", value: date, min: tomorrow(), onChange: (event) => {
                                                    setDate(event.target.value);
                                                    setSlot(null);
                                                } }), _jsx(Select, { label: "Con qui\u00E9n", placeholder: "Cualquiera disponible", value: staffId ?? '', onChange: (event) => {
                                                    setStaffId(event.target.value ? Number(event.target.value) : null);
                                                    setSlot(null);
                                                }, options: (staff ?? [])
                                                    .filter((member) => member.isAvailable)
                                                    .map((member) => ({
                                                    value: member.id,
                                                    label: `${member.firstName} ${member.lastName} — ${member.specialty ?? ''}`,
                                                })) })] }), _jsx("p", { className: b.slotsLabel, children: "Horarios libres" }), isLoading ? (_jsx(Skeleton, { height: "80px", radius: "var(--radius-sm)" })) : slots && slots.length > 0 ? (_jsx("div", { className: b.slots, role: "radiogroup", "aria-label": "Horarios disponibles", children: slots.map((item) => (_jsxs("button", { type: "button", role: "radio", "aria-checked": slot === item.startsAt, className: slot === item.startsAt ? `${b.slot} ${b.slotActive}` : b.slot, onClick: () => setSlot(item.startsAt), children: [_jsx("strong", { children: formatTime(item.startsAt) }), _jsx("small", { children: item.staffName })] }, `${item.staffId}-${item.startsAt}`))) })) : (_jsx(EmptyState, { size: "sm", icon: "calendar", title: "No quedan huecos ese d\u00EDa", description: "Prueba con otra fecha o quita el filtro de sastre." }))] })] }), _jsxs(Card, { variant: "raised", children: [_jsxs(Card.Body, { children: [orders && orders.filter((order) => !CLOSED_ORDER_STATUSES.includes(order.statusCode)).length > 0 ? (_jsx(Select, { label: "Pedido relacionado", placeholder: "Ninguno en particular", value: orderId ?? '', onChange: (event) => setOrderId(event.target.value ? Number(event.target.value) : null), hint: "Si es una prueba o una entrega, dinos de qu\u00E9 pedido.", options: orders
                                            .filter((order) => !CLOSED_ORDER_STATUSES.includes(order.statusCode))
                                            .map((order) => ({ value: order.id, label: order.orderNumber })) })) : null, _jsx(Textarea, { label: "\u00BFAlgo que debamos saber?", placeholder: "Por ejemplo: vengo con poco tiempo, o quiero ver linos.", value: note, onChange: (event) => setNote(event.target.value), hint: "Opcional." })] }), _jsxs(Card.Footer, { className: b.footer, children: [chosen ? (_jsxs("p", { className: b.confirmation, children: [_jsx(Icon, { name: "checkCircle", size: 16 }), formatWeekday(chosen.startsAt), " a las ", formatTime(chosen.startsAt), " con", ' ', chosen.staffName] })) : (_jsxs("p", { className: b.confirmation, children: [_jsx(Icon, { name: "info", size: 16 }), "Elige un horario para continuar."] })), _jsx(Button, { type: "submit", variant: "primary", size: "lg", disabled: !chosen, isLoading: createAppointment.isPending, children: "Confirmar cita" })] })] })] })] }));
}
//# sourceMappingURL=BookAppointmentPage.js.map