import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Textarea } from '@/components/ui';
import { useAddMeasurementSet, useMeasurementTypes, useUpdateMeasurementSet } from '@/features/admin/hooks';
import { useStaff } from '@/features/appointments/hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { getMeasurementRange } from '@/lib/validation';
import s from '@/pages/admin/admin.module.css';
/**
 * Toma o corrige una ficha de medidas. Se usa tanto desde la ficha del
 * cliente (tomar/editar) como desde «Nuevo pedido» (tomar medidas sin
 * abandonar el pedido en construcción): antes, si el cliente elegido no
 * tenía medidas, había que salir del formulario, ir a su ficha, tomarlas, y
 * volver a empezar el pedido desde cero.
 */
export function MeasurementModal({ open, onClose, customerId, editing = null, onSaved, }) {
    const { data: types } = useMeasurementTypes();
    const { data: staff } = useStaff();
    const addMeasurementSet = useAddMeasurementSet();
    const updateMeasurementSet = useUpdateMeasurementSet();
    const toast = useToast();
    const [takenBy, setTakenBy] = useState(null);
    const [note, setNote] = useState('');
    const [values, setValues] = useState({});
    const isEditing = editing != null;
    const isPending = addMeasurementSet.isPending || updateMeasurementSet.isPending;
    // Precarga los valores existentes al editar; limpia el formulario al crear.
    useEffect(() => {
        if (!open)
            return;
        if (editing) {
            setTakenBy(editing.takenBy);
            setNote(editing.note ?? '');
            setValues(Object.fromEntries(editing.values.map((value) => [value.measurementTypeId, String(value.valueCm)])));
        }
        else {
            setTakenBy(null);
            setNote('');
            setValues({});
        }
    }, [open, editing]);
    async function handleSubmit(event) {
        event.preventDefault();
        if (!types)
            return;
        const parsed = types.map((type) => ({
            measurementTypeId: type.id,
            valueCm: Number(values[type.id]),
            name: type.name,
            code: type.code,
        }));
        const invalid = parsed.find((entry) => {
            const { min, max } = getMeasurementRange(entry.code);
            return !Number.isFinite(entry.valueCm) || entry.valueCm < min || entry.valueCm > max;
        });
        if (invalid) {
            const { min, max } = getMeasurementRange(invalid.code);
            toast.error('Revisa las medidas', `«${invalid.name}» debe estar entre ${min} y ${max} cm.`);
            return;
        }
        const staffMember = staff?.find((member) => member.id === takenBy);
        const payloadValues = parsed.map(({ measurementTypeId, valueCm }) => ({ measurementTypeId, valueCm }));
        try {
            const saved = editing
                ? await updateMeasurementSet.mutateAsync({
                    id: editing.id,
                    customerId,
                    takenBy: staffMember?.id ?? null,
                    takenByName: staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : null,
                    note: note || undefined,
                    values: payloadValues,
                })
                : await addMeasurementSet.mutateAsync({
                    customerId,
                    takenBy: staffMember?.id ?? null,
                    takenByName: staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : null,
                    note: note || undefined,
                    values: payloadValues,
                });
            toast.success(isEditing ? 'Ficha de medidas actualizada' : 'Ficha de medidas guardada');
            onSaved?.(saved);
            onClose();
        }
        catch (error) {
            toast.error(isEditing ? 'No se pudo actualizar la ficha' : 'No se pudo guardar la ficha', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsx(Modal, { open: open, onClose: onClose, title: isEditing ? 'Editar ficha de medidas' : 'Tomar nueva ficha de medidas', description: "Todas las medidas van en cent\u00EDmetros.", size: "lg", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", onClick: onClose, children: "Cancelar" }), _jsx(Button, { type: "submit", form: "measurement-form", variant: "primary", isLoading: isPending, children: isEditing ? 'Guardar cambios' : 'Guardar ficha' })] }), children: _jsxs("form", { id: "measurement-form", onSubmit: handleSubmit, className: s.formGrid2, children: [_jsx(Select, { label: "Tomada por", placeholder: "Sin asignar", fieldClassName: s.span2, value: takenBy ?? '', onChange: (event) => setTakenBy(event.target.value ? Number(event.target.value) : null), options: (staff ?? []).map((member) => ({
                        value: member.id,
                        label: `${member.firstName} ${member.lastName}`,
                    })) }), (types ?? []).map((type) => {
                    const range = getMeasurementRange(type.code);
                    return (_jsx(Input, { label: type.name, type: "number", step: "0.1", min: range.min, max: range.max, required: true, hint: `Entre ${range.min} y ${range.max} cm.`, endAdornment: type.unit, value: values[type.id] ?? '', onChange: (event) => setValues((current) => ({ ...current, [type.id]: event.target.value })) }, type.id));
                }), _jsx(Textarea, { label: "Nota", placeholder: "Por ejemplo: hombro derecho m\u00E1s bajo, compensar 0.8 cm.", fieldClassName: s.span2, value: note, onChange: (event) => setNote(event.target.value), hint: "Opcional." })] }) }));
}
//# sourceMappingURL=MeasurementModal.js.map