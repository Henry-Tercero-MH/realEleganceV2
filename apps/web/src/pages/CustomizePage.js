import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, ButtonLink, Card, EmptyState, Icon, OptionCard, Price, Rule, SectionHeading, Skeleton, } from '@/components/ui';
import { useFabrics, useOptionGroups, useSuit } from '@/features/catalog/hooks';
import { describeOptions, priceMadeToMeasure, METERS_PER_SUIT } from '@/features/cart/pricing';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { paths } from '@/routes/paths';
import { formatCurrency } from '@/lib/format';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CustomizePage.module.css';
export default function CustomizePage() {
    const { code } = useParams();
    const { data: suit, isLoading: loadingSuit, isError } = useSuit(code);
    const { data: fabrics, isLoading: loadingFabrics } = useFabrics();
    const { data: optionGroups, isLoading: loadingOptions } = useOptionGroups();
    const { addItem } = useCart();
    const toast = useToast();
    const [fabricId, setFabricId] = useState(null);
    /** Una opción elegida por grupo: `{ [groupId]: optionValueId }`. */
    const [selections, setSelections] = useState({});
    // Cuando llegan las opciones, preseleccionamos la primera de cada grupo
    // obligatorio: la persona empieza con un traje válido, no con un formulario
    // vacío que la regaña.
    const defaults = useMemo(() => {
        if (!optionGroups)
            return {};
        return Object.fromEntries(optionGroups
            .filter((group) => group.isRequired && group.values[0])
            .map((group) => [group.id, group.values[0].id]));
    }, [optionGroups]);
    const effectiveSelections = { ...defaults, ...selections };
    const selectedOptionIds = Object.values(effectiveSelections);
    const fabric = fabrics?.find((item) => item.id === fabricId) ?? null;
    const unitPrice = suit && fabric && optionGroups
        ? priceMadeToMeasure(suit, fabric, selectedOptionIds, optionGroups)
        : null;
    const selectedOptions = optionGroups && selectedOptionIds.length > 0
        ? describeOptions(selectedOptionIds, optionGroups)
        : [];
    function handleAdd() {
        if (!suit || !fabric || unitPrice === null)
            return;
        addItem({
            itemType: 'made_to_measure',
            quantity: 1,
            unitPrice,
            suitModelId: suit.id,
            fabricId: fabric.id,
            optionValueIds: selectedOptionIds,
            productId: null,
            displayName: suit.name,
            displaySubtitle: `${fabric.name} · ${suit.styleName}`,
            imageUrl: suit.primaryImage?.url ?? null,
            selectedOptions,
            // Un traje a medida no tiene existencias, pero sí un tope razonable.
            maxQuantity: 5,
        });
        toast.success('Añadido al carrito', `${suit.name} en ${fabric.name}.`);
    }
    if (loadingSuit) {
        return (_jsx("div", { className: cx('re-container', l.sectionFirst), children: _jsx(Skeleton, { height: "480px", radius: "var(--radius-md)" }) }));
    }
    if (isError || !suit) {
        return (_jsx("div", { className: cx('re-container', l.sectionFirst), children: _jsx(EmptyState, { tone: "error", title: "No encontramos ese modelo", action: _jsx(ButtonLink, { to: paths.catalog, variant: "primary", children: "Volver al cat\u00E1logo" }) }) }));
    }
    return (_jsxs("div", { className: cx('re-container', l.sectionFirst), children: [_jsxs("nav", { className: s.breadcrumb, "aria-label": "Ruta de navegaci\u00F3n", children: [_jsx(Link, { to: paths.catalog, children: "Cat\u00E1logo" }), _jsx(Icon, { name: "chevronRight", size: 13 }), _jsx(Link, { to: paths.suit(suit.code), children: suit.name }), _jsx(Icon, { name: "chevronRight", size: 13 }), _jsx("span", { "aria-current": "page", children: "Personalizar" })] }), _jsx(SectionHeading, { as: "h1", eyebrow: `Paso 2 de 8 · ${suit.styleName}`, title: `Personaliza tu ${suit.name}`, description: "Elige la tela y los acabados. El precio se actualiza al instante; nada se cobra hasta que confirmes." }), _jsxs("div", { className: cx(s.layout, l.afterHeading), children: [_jsxs("div", { className: s.config, children: [_jsx(Card, { variant: "outlined", className: s.comingSoon, children: _jsxs(Card.Body, { className: s.comingSoonBody, children: [_jsx("span", { className: s.comingSoonIcon, children: _jsx(Icon, { name: "sparkle", size: 22 }) }), _jsxs("div", { children: [_jsxs("div", { className: l.row, children: [_jsx("h2", { className: s.comingSoonTitle, children: "Vista previa en 2D" }), _jsx(Badge, { tone: "gold", size: "sm", children: "Pr\u00F3ximamente" })] }), _jsx("p", { className: s.comingSoonText, children: "Estamos dibujando el simulador que te ense\u00F1ar\u00E1 tu traje mientras lo eliges. Mientras tanto, cada opci\u00F3n indica exactamente qu\u00E9 cambia." })] }), _jsx(Button, { variant: "ghost", onClick: () => toast.toast({ title: 'Te avisaremos', description: 'Te escribiremos en cuanto esté disponible.' }), children: "Av\u00EDsame" })] }) }), _jsxs("section", { className: s.group, "aria-labelledby": "grupo-tela", children: [_jsxs("div", { className: s.groupHeader, children: [_jsx("h2", { className: s.groupTitle, id: "grupo-tela", children: "Tela" }), _jsxs("p", { className: s.groupHint, children: ["Un traje consume unos ", METERS_PER_SUIT, " metros. El precio de la tela ya va incluido en el total."] })] }), loadingFabrics ? (_jsx("div", { className: s.optionsGrid, children: Array.from({ length: 6 }, (_, index) => (_jsx(Skeleton, { height: "180px", radius: "var(--radius-md)" }, index))) })) : (_jsx("div", { className: s.optionsGrid, children: fabrics?.map((item) => (_jsx(OptionCard, { layout: "tile", name: "tela", value: item.id, checked: fabricId === item.id, onChange: (value) => setFabricId(Number(value)), title: item.name, description: item.composition, priceDelta: item.pricePerMeter * METERS_PER_SUIT, swatchColor: item.colorHex, imageUrl: item.primaryImage?.url ?? null, disabled: item.stockMeters < METERS_PER_SUIT }, item.id))) }))] }), loadingOptions
                                ? null
                                : optionGroups?.map((group) => (_jsxs("section", { className: s.group, "aria-labelledby": `grupo-${group.id}`, children: [_jsxs("div", { className: s.groupHeader, children: [_jsxs("h2", { className: s.groupTitle, id: `grupo-${group.id}`, children: [group.name, !group.isRequired ? _jsx("span", { className: s.optional, children: "Opcional" }) : null] }), group.description ? _jsx("p", { className: s.groupHint, children: group.description }) : null] }), _jsx("div", { className: s.optionsList, children: group.values.map((value) => (_jsx(OptionCard, { name: `grupo-${group.id}`, value: value.id, checked: effectiveSelections[group.id] === value.id, onChange: (next) => setSelections((current) => ({ ...current, [group.id]: Number(next) })), title: value.name, description: value.description, priceDelta: value.priceDelta }, value.id))) })] }, group.id)))] }), _jsx("aside", { className: s.summary, children: _jsxs(Card, { variant: "raised", children: [_jsx(Card.Media, { ratio: "4/3", children: suit.primaryImage ? (_jsx("img", { src: suit.primaryImage.url, alt: suit.name })) : (_jsx("div", {})) }), _jsx(Card.Header, { eyebrow: suit.styleName, title: suit.name }), _jsxs(Card.Body, { children: [_jsxs("dl", { className: s.recap, children: [_jsxs("div", { children: [_jsx("dt", { children: "Precio base" }), _jsx("dd", { children: formatCurrency(suit.basePrice) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Tela" }), _jsx("dd", { children: fabric
                                                                ? `${fabric.name} · ${formatCurrency(fabric.pricePerMeter * METERS_PER_SUIT)}`
                                                                : 'Sin elegir' })] }), selectedOptions
                                                    .filter((option) => option.priceDelta !== 0)
                                                    .map((option) => (_jsxs("div", { children: [_jsx("dt", { children: option.groupName }), _jsxs("dd", { children: [option.name, " \u00B7 ", option.priceDelta > 0 ? '+' : '−', formatCurrency(Math.abs(option.priceDelta))] })] }, option.id)))] }), _jsx(Rule, { variant: "stitch", className: s.recapRule }), _jsxs("div", { className: s.total, children: [_jsx("span", { children: "Total del traje" }), unitPrice !== null ? (_jsx(Price, { amount: unitPrice, size: "lg" })) : (_jsx("span", { className: s.pending, children: "Elige una tela" }))] })] }), _jsxs(Card.Footer, { className: s.summaryFooter, children: [_jsx(Button, { variant: "primary", fullWidth: true, disabled: !fabric, onClick: handleAdd, children: "A\u00F1adir al carrito" }), _jsx("p", { className: s.summaryNote, children: "Al confirmar el pedido pagar\u00E1s el 50 % de anticipo y agendaremos tu cita de medidas." })] })] }) })] })] }));
}
//# sourceMappingURL=CustomizePage.js.map