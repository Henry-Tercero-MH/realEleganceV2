import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, EmptyState, Icon, Input, OrderStatusBadge, SectionHeading, Skeleton, Stepper, } from '@/components/ui';
import { useOrderTracking } from '@/features/orders/hooks';
import { paths } from '@/routes/paths';
import { formatDate, formatDateTime } from '@/lib/format';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './TrackingPage.module.css';
export default function TrackingPage() {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [query, setQuery] = useState(orderNumber ?? '');
    const { data, isLoading, isError, error } = useOrderTracking(orderNumber);
    /**
     * El índice del paso actual es el primero sin `doneAt`. Si están todos
     * cerrados, el traje se entregó y el stepper queda completo.
     */
    const currentIndex = data ? data.steps.findIndex((step) => !step.doneAt) : 0;
    const steps = data?.steps.map((step) => ({
        id: step.stageCode,
        label: step.stageName,
        description: step.assignedTailor ? `A cargo de ${step.assignedTailor}` : step.note ?? undefined,
        meta: step.doneAt
            ? `Completado el ${formatDate(step.doneAt)}`
            : step.estimatedDate
                ? `Previsto para el ${formatDate(step.estimatedDate)}`
                : undefined,
    })) ?? [];
    return (_jsxs("div", { className: cx('re-container', 're-container--narrow', l.sectionFirst), children: [_jsx(SectionHeading, { as: "h1", size: "lg", eyebrow: "Seguimiento", title: "\u00BFD\u00F3nde est\u00E1 mi traje?", description: "Escribe el n\u00FAmero que te dimos al confirmar el pedido. No hace falta iniciar sesi\u00F3n." }), _jsxs("form", { className: cx(s.search, l.afterHeading), onSubmit: (event) => {
                    event.preventDefault();
                    if (query.trim())
                        navigate(paths.trackingFor(query.trim().toUpperCase()));
                }, children: [_jsx(Input, { label: "N\u00FAmero de pedido", placeholder: "RE-2026-01024", value: query, onChange: (event) => setQuery(event.target.value), startAdornment: _jsx(Icon, { name: "search", size: 17 }), fieldClassName: s.searchInput, autoComplete: "off" }), _jsx(Button, { type: "submit", variant: "primary", className: s.searchButton, children: "Consultar" })] }), !orderNumber ? (_jsxs("p", { className: s.hint, children: [_jsx(Icon, { name: "info", size: 15 }), "\u00BFEs tu primera vez? Prueba con ", _jsx("code", { children: "RE-2026-01024" }), ", el pedido de demostraci\u00F3n."] })) : null, isLoading ? (_jsxs("div", { className: s.results, children: [_jsx(Skeleton, { height: "120px", radius: "var(--radius-md)" }), _jsx(Skeleton, { height: "320px", radius: "var(--radius-md)" })] })) : null, isError ? (_jsx("div", { className: s.results, children: _jsx(EmptyState, { tone: "error", title: "No encontramos ese pedido", description: error instanceof Error
                        ? `${error.message} Revisa el número: empieza por RE seguido del año.`
                        : 'Revisa el número e inténtalo de nuevo.' }) })) : null, data ? (_jsxs("div", { className: s.results, children: [_jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { eyebrow: data.orderNumber, title: "Estado del pedido", aside: _jsx(OrderStatusBadge, { status: data.statusCode }) }), _jsx(Card.Body, { children: _jsxs("dl", { className: s.facts, children: [_jsxs("div", { children: [_jsx("dt", { children: "Entrega prevista" }), _jsx("dd", { children: formatDate(data.promisedDate) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Etapa actual" }), _jsx("dd", { children: data.currentStage
                                                        ? (data.steps.find((step) => step.stageCode === data.currentStage)?.stageName ??
                                                            '—')
                                                        : 'Finalizado' })] })] }) })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Avance en el taller" }), _jsx(Card.Body, { children: _jsx(Stepper, { steps: steps, current: currentIndex === -1 ? steps.length : currentIndex, orientation: "vertical", "aria-label": "Etapas de confecci\u00F3n" }) })] }), data.history.length > 0 ? (_jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Bit\u00E1cora", subtitle: "Cada cambio de estado queda registrado" }), _jsx(Card.Body, { children: _jsx("ol", { role: "list", className: s.history, children: [...data.history].reverse().map((entry) => (_jsxs("li", { children: [_jsxs("div", { className: s.historyHead, children: [_jsx("strong", { children: entry.statusName }), _jsx("time", { dateTime: entry.changedAt, children: formatDateTime(entry.changedAt) })] }), entry.note ? _jsx("p", { className: s.historyNote, children: entry.note }) : null, entry.changedByName ? (_jsxs("p", { className: s.historyAuthor, children: ["\u2014 ", entry.changedByName] })) : null] }, entry.id))) }) })] })) : null] })) : null] }));
}
//# sourceMappingURL=TrackingPage.js.map