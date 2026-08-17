import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Button, Card, EmptyState, Icon, SectionHeading, Select, Skeleton, StageBadge, } from '@/components/ui';
import { useAdvanceStage, useAssignTailor, useProductionBoard } from '@/features/admin/hooks';
import { useStaff } from '@/features/appointments/hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { formatShortDate, formatRelative } from '@/lib/format';
import { cx } from '@/lib/cx';
import s from './admin.module.css';
export default function AdminProductionPage() {
    const { data: board, isLoading, isError } = useProductionBoard();
    const { data: staff } = useStaff();
    const assignTailor = useAssignTailor();
    const advanceStage = useAdvanceStage();
    const toast = useToast();
    async function handleAssign(workOrderId, tailorId) {
        try {
            await assignTailor.mutateAsync({ workOrderId, tailorId });
            toast.success('Sastre asignado');
        }
        catch (error) {
            toast.error('No se pudo asignar', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    async function handleAdvance(workOrderId) {
        try {
            const next = await advanceStage.mutateAsync(workOrderId);
            toast.success('Etapa avanzada', `Ahora está en ${next.stageName}.`);
        }
        catch (error) {
            toast.error('No se pudo avanzar la etapa', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Taller", title: "Tablero de producci\u00F3n", description: "\u00D3rdenes de trabajo abiertas por etapa. Equivale a la vista vw_production_board." }), isError ? _jsx(EmptyState, { tone: "error", title: "No pudimos cargar el tablero" }) : null, isLoading ? (_jsx(Skeleton, { height: "380px", radius: "var(--radius-md)" })) : (_jsx("div", { className: s.board, children: board?.map((column) => (_jsxs("section", { className: s.column, "aria-label": column.stageName, children: [_jsxs("header", { className: s.columnHead, children: [_jsx("h2", { className: s.columnTitle, children: column.stageName }), _jsx("span", { className: s.columnCount, children: column.workOrders.length })] }), column.workOrders.length === 0 ? (_jsx("p", { className: s.columnEmpty, children: "Sin \u00F3rdenes en esta etapa" })) : (column.workOrders.map((workOrder) => {
                            const overdue = workOrder.dueAt && new Date(workOrder.dueAt).getTime() < Date.now();
                            return (_jsxs("article", { className: cx(s.workOrder, overdue && s.workOrderOverdue), children: [_jsxs("div", { children: [_jsx("span", { className: s.workOrderNumber, children: workOrder.orderNumber }), _jsx("p", { className: s.workOrderCustomer, children: workOrder.customerName })] }), _jsxs("div", { className: s.workOrderMeta, children: [_jsxs("span", { children: [_jsx(Icon, { name: "clock", size: 13 }), ' ', workOrder.dueAt
                                                        ? `Vence ${formatRelative(workOrder.dueAt)} (${formatShortDate(workOrder.dueAt)})`
                                                        : 'Sin fecha límite'] }), overdue ? (_jsx(Badge, { tone: "danger", size: "sm", children: "Fuera de plazo" })) : null] }), workOrder.note ? _jsx("p", { className: s.workOrderNote, children: workOrder.note }) : null, _jsx(Select, { label: "Sastre asignado", placeholder: "Sin asignar", value: workOrder.assignedTailorId ?? '', onChange: (event) => event.target.value &&
                                            handleAssign(workOrder.id, Number(event.target.value)), options: (staff ?? []).map((member) => ({
                                            value: member.id,
                                            label: `${member.firstName} ${member.lastName}`,
                                            disabled: !member.isAvailable,
                                        })) }), _jsxs("div", { className: s.workOrderActions, children: [_jsx(StageBadge, { stage: workOrder.stageCode }), _jsx(Button, { size: "sm", variant: "secondary", onClick: () => handleAdvance(workOrder.id), isLoading: advanceStage.isPending && advanceStage.variables === workOrder.id, rightIcon: _jsx(Icon, { name: "arrowRight", size: 14 }), children: "Avanzar" })] })] }, workOrder.id));
                        }))] }, column.stageCode))) })), _jsx(Card, { variant: "outlined", children: _jsx(Card.Body, { children: _jsxs("p", { className: s.designNote, children: [_jsx(Icon, { name: "info", size: 15 }), "Asignar sastre y avanzar etapa ya funcionan sobre los datos simulados: replican", _jsx("code", { children: " sp_assign_tailor" }), " y ", _jsx("code", { children: "sp_advance_stage" }), ". Al conectar el backend pasar\u00E1n a ser llamadas transaccionales reales."] }) }) })] }));
}
//# sourceMappingURL=AdminProductionPage.js.map