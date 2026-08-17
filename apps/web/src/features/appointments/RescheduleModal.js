import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Input, Modal, Select } from '@/components/ui';
import { useAvailability, useRescheduleAppointment, useStaff } from './hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { formatTime, formatWeekday } from '@/lib/format';
import s from './RescheduleModal.module.css';
/** Mañana, en `YYYY-MM-DD`. */
function tomorrow() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
}
/**
 * Cambia el día, la hora o el sastre de una cita que sigue agendada. Antes no
 * existía ninguna forma de reprogramar: la única salida era dejarla como
 * estaba o perderla del todo.
 */
export function RescheduleModal({ open, onClose, appointment }) {
    const [date, setDate] = useState(tomorrow());
    const [staffId, setStaffId] = useState(appointment.staffId);
    const [slot, setSlot] = useState(null);
    const { data: staff } = useStaff();
    const { data: slots, isLoading } = useAvailability(date, staffId);
    const reschedule = useRescheduleAppointment();
    const toast = useToast();
    const chosen = slots?.find((item) => item.startsAt === slot);
    async function handleSubmit(event) {
        event.preventDefault();
        if (!chosen)
            return;
        try {
            await reschedule.mutateAsync({
                appointmentId: appointment.id,
                staffId: chosen.staffId,
                scheduledAt: chosen.startsAt,
            });
            toast.success('Cita reprogramada', `${formatWeekday(chosen.startsAt)} a las ${formatTime(chosen.startsAt)}.`);
            onClose();
        }
        catch (error) {
            toast.error('No se pudo reprogramar', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsx(Modal, { open: open, onClose: onClose, title: "Reprogramar cita", description: appointment.appointmentTypeName, footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", onClick: onClose, children: "Cancelar" }), _jsx(Button, { type: "submit", form: "reschedule-form", variant: "primary", isLoading: reschedule.isPending, disabled: !chosen, children: "Confirmar horario" })] }), children: _jsxs("form", { id: "reschedule-form", onSubmit: handleSubmit, className: s.form, children: [_jsx(Input, { label: "Nuevo d\u00EDa", type: "date", min: tomorrow(), value: date, onChange: (event) => {
                        setDate(event.target.value);
                        setSlot(null);
                    } }), _jsx(Select, { label: "Con qui\u00E9n", placeholder: "Cualquiera disponible", value: staffId ?? '', onChange: (event) => {
                        setStaffId(event.target.value ? Number(event.target.value) : null);
                        setSlot(null);
                    }, options: (staff ?? [])
                        .filter((member) => member.isAvailable)
                        .map((member) => ({ value: member.id, label: `${member.firstName} ${member.lastName}` })) }), _jsx(Select, { label: "Horario", placeholder: isLoading ? 'Buscando huecos…' : 'Elige un horario', value: slot ?? '', onChange: (event) => setSlot(event.target.value || null), disabled: isLoading || !slots || slots.length === 0, options: (slots ?? []).map((item) => ({
                        value: item.startsAt,
                        label: `${formatWeekday(item.startsAt)}, ${formatTime(item.startsAt)} — ${item.staffName}`,
                    })), hint: !isLoading && slots && slots.length === 0 ? 'No quedan huecos ese día.' : undefined })] }) }));
}
//# sourceMappingURL=RescheduleModal.js.map