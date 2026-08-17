import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, ButtonLink, Card, EmptyState, Icon, SectionHeading, Skeleton, } from '@/components/ui';
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
    const [rescheduling, setRescheduling] = useState(null);
    async function handleCancel(appointment) {
        try {
            await updateStatus.mutateAsync({ appointmentId: appointment.id, status: 'cancelled' });
            toast.success('Cita cancelada');
        }
        catch (error) {
            toast.error('No se pudo cancelar', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    const now = Date.now();
    const upcoming = appointments?.filter((appointment) => appointment.status === 'scheduled' && new Date(appointment.scheduledAt).getTime() >= now) ?? [];
    const past = appointments?.filter((appointment) => appointment.status !== 'scheduled' || new Date(appointment.scheduledAt).getTime() < now) ?? [];
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Agenda", title: "Mis citas", description: "Toma de medidas, pruebas y entregas en el taller.", action: _jsx(ButtonLink, { to: paths.bookAppointment, variant: "primary", leftIcon: _jsx(Icon, { name: "plus", size: 16 }), children: "Agendar" }) }), isLoading ? _jsx(Skeleton, { height: "140px", radius: "var(--radius-md)" }) : null, isError ? _jsx(EmptyState, { tone: "error", title: "No pudimos cargar tu agenda" }) : null, _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Pr\u00F3ximas" }), _jsx(Card.Body, { children: upcoming.length === 0 ? (_jsx(EmptyState, { size: "sm", icon: "calendar", title: "No tienes citas agendadas", description: "Reserva una para que te tomemos medidas o para ver telas sin compromiso.", action: _jsx(ButtonLink, { to: paths.bookAppointment, variant: "secondary", children: "Agendar una cita" }) })) : (_jsx("ul", { role: "list", className: s.list, children: upcoming.map((appointment) => (_jsxs("li", { className: s.orderCard, children: [_jsxs("div", { children: [_jsx("span", { className: s.orderNumber, children: appointment.appointmentTypeName }), _jsxs("p", { className: s.orderMeta, children: [_jsx("span", { children: formatWeekday(appointment.scheduledAt) }), _jsx("span", { children: formatDateTime(appointment.scheduledAt) }), _jsxs("span", { children: ["Con ", appointment.staffName] }), appointment.orderNumber ? (_jsx(Link, { to: paths.order(appointment.orderNumber), children: appointment.orderNumber })) : null] }), appointment.note ? _jsx("p", { className: s.itemSub, children: appointment.note }) : null] }), _jsxs("div", { className: s.orderRight, children: [_jsx(Badge, { tone: "info", size: "sm", children: formatRelative(appointment.scheduledAt) }), _jsxs("small", { children: [appointment.durationMin, " min"] }), _jsxs("div", { className: s.appointmentActions, children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setRescheduling(appointment), children: "Reprogramar" }), _jsx(Button, { variant: "ghost", size: "sm", isLoading: updateStatus.isPending && updateStatus.variables?.appointmentId === appointment.id, onClick: () => handleCancel(appointment), children: "Cancelar" })] })] })] }, appointment.id))) })) })] }), past.length > 0 ? (_jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Anteriores" }), _jsx(Card.Body, { children: _jsx("ul", { role: "list", className: s.list, children: past.map((appointment) => (_jsxs("li", { className: s.orderCard, children: [_jsxs("div", { children: [_jsx("span", { className: s.orderNumber, children: appointment.appointmentTypeName }), _jsxs("p", { className: s.orderMeta, children: [_jsx("span", { children: formatDateTime(appointment.scheduledAt) }), _jsxs("span", { children: ["Con ", appointment.staffName] }), appointment.orderNumber ? (_jsx(Link, { to: paths.order(appointment.orderNumber), children: appointment.orderNumber })) : null] })] }), _jsx(Badge, { tone: appointment.status === 'completed' ? 'success' : 'neutral', size: "sm", children: APPOINTMENT_STATUS_LABELS[appointment.status] })] }, appointment.id))) }) })] })) : null, rescheduling ? (_jsx(RescheduleModal, { open: true, appointment: rescheduling, onClose: () => setRescheduling(null) })) : null] }));
}
//# sourceMappingURL=AppointmentsPage.js.map