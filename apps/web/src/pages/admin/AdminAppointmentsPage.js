import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Select, SectionHeading, Skeleton, Table } from '@/components/ui';
import { APPOINTMENT_STATUS_LABELS } from '@real-elegance/shared';
import { useAdminAppointments } from '@/features/admin/hooks';
import { useUpdateAppointmentStatus } from '@/features/appointments/hooks';
import { RescheduleModal } from '@/features/appointments/RescheduleModal';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatDateTime } from '@/lib/format';
import s from './admin.module.css';
const STATUS_OPTIONS = [
    { value: 'completed', label: APPOINTMENT_STATUS_LABELS.completed },
    { value: 'no_show', label: APPOINTMENT_STATUS_LABELS.no_show },
    { value: 'cancelled', label: APPOINTMENT_STATUS_LABELS.cancelled },
];
export default function AdminAppointmentsPage() {
    const { data: appointments, isLoading } = useAdminAppointments();
    const updateStatus = useUpdateAppointmentStatus();
    const toast = useToast();
    const [rescheduling, setRescheduling] = useState(null);
    async function handleStatusChange(appointmentId, status) {
        try {
            await updateStatus.mutateAsync({ appointmentId, status });
            toast.success('Cita actualizada', APPOINTMENT_STATUS_LABELS[status]);
        }
        catch (error) {
            toast.error('No se pudo actualizar', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    const columns = [
        {
            id: 'customer',
            header: 'Cliente',
            cell: (row) => (_jsxs("div", { children: [_jsx("span", { className: s.cellName, children: row.customerName }), _jsx("span", { className: s.cellSub, children: row.appointmentTypeName }), row.orderNumber ? (_jsx(Link, { to: paths.adminOrder(row.orderNumber), className: s.mono, children: row.orderNumber })) : null] })),
        },
        { id: 'staff', header: 'Atiende', hideOnMobile: true, cell: (row) => row.staffName ?? '—' },
        { id: 'when', header: 'Fecha y hora', cell: (row) => formatDateTime(row.scheduledAt) },
        { id: 'duration', header: 'Duración', align: 'right', hideOnMobile: true, cell: (row) => `${row.durationMin} min` },
        {
            id: 'status',
            header: 'Estado',
            cell: (row) => (_jsx(Badge, { tone: row.status === 'completed'
                    ? 'success'
                    : row.status === 'cancelled' || row.status === 'no_show'
                        ? 'danger'
                        : 'info', size: "sm", children: APPOINTMENT_STATUS_LABELS[row.status] })),
        },
        {
            id: 'actions',
            header: 'Acciones',
            align: 'right',
            cell: (row) => row.status === 'scheduled' ? (_jsxs("div", { className: s.tableActions, children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setRescheduling(row), children: "Reprogramar" }), _jsx(Select, { "aria-label": `Cambiar estado de la cita de ${row.customerName}`, placeholder: "Cambiar a\u2026", value: "", onChange: (event) => handleStatusChange(row.id, event.target.value), options: STATUS_OPTIONS })] })) : ('—'),
        },
    ];
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Operaci\u00F3n", title: "Citas", description: "Agenda completa del taller: medidas, pruebas, consultas y entregas." }), isLoading ? (_jsx(Skeleton, { height: "320px", radius: "var(--radius-md)" })) : (_jsx(Table, { columns: columns, rows: appointments ?? [], rowKey: (row) => row.id, caption: "Citas del taller" })), _jsxs("p", { className: s.designNote, children: ["Los solapes de horario los impide ", _jsx("code", { children: "trg_appointments_no_overlap" }), ": un mismo sastre no puede tener dos citas que se crucen."] }), rescheduling ? (_jsx(RescheduleModal, { open: true, appointment: rescheduling, onClose: () => setRescheduling(null) })) : null] }));
}
//# sourceMappingURL=AdminAppointmentsPage.js.map