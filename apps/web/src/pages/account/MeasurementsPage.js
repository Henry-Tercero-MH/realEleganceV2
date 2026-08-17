import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonLink, Card, EmptyState, Icon, SectionHeading, Skeleton } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { paths } from '@/routes/paths';
import { formatDate, formatMeasurement } from '@/lib/format';
import s from './account.module.css';
export default function MeasurementsPage() {
    const { user } = useAuth();
    const customerId = user?.customerId ?? null;
    const { data: sets, isLoading } = useQuery({
        queryKey: queryKeys.myMeasurements(customerId ?? 0),
        queryFn: () => api.measurements.listMine(customerId),
        enabled: customerId !== null,
    });
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Tu ficha", title: "Mis medidas", description: "Las tomamos en el taller y quedan guardadas. Para el siguiente traje solo hay que confirmarlas." }), isLoading ? _jsx(Skeleton, { height: "240px", radius: "var(--radius-md)" }) : null, !isLoading && (!sets || sets.length === 0) ? (_jsx(EmptyState, { icon: "ruler", title: "Todav\u00EDa no tenemos tus medidas", description: "Se toman en la primera cita, en unos veinte minutos. Es lo \u00FAnico que no se puede hacer a distancia.", action: _jsx(ButtonLink, { to: paths.bookAppointment, variant: "primary", children: "Agendar la toma de medidas" }) })) : null, sets?.map((set) => (_jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { eyebrow: `Tomadas el ${formatDate(set.takenAt)}`, title: "Ficha de medidas", subtitle: set.takenByName ? `Por ${set.takenByName}` : undefined }), _jsxs(Card.Body, { children: [_jsx("dl", { className: s.measureGrid, children: set.values.map((value) => (_jsxs("div", { className: s.measure, children: [_jsx("dt", { children: value.name }), _jsx("dd", { children: formatMeasurement(value.valueCm, value.unit) })] }, value.id))) }), set.note ? (_jsxs("p", { className: s.itemSub, style: { marginTop: 'var(--space-4)' }, children: [_jsx(Icon, { name: "info", size: 14 }), " ", set.note] })) : null] })] }, set.id)))] }));
}
//# sourceMappingURL=MeasurementsPage.js.map