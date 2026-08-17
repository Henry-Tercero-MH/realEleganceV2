import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, ButtonLink, Card, EmptyState, Icon, Price, Rule, Skeleton, SkeletonText, } from '@/components/ui';
import { useSuit } from '@/features/catalog/hooks';
import { paths } from '@/routes/paths';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './SuitDetailPage.module.css';
const INCLUDED = [
    'Patrón trazado sobre tus medidas',
    'Dos pruebas de ajuste incluidas',
    'Ojales y botones cosidos a mano',
    'Garantía de ajuste durante 6 meses',
];
export default function SuitDetailPage() {
    const { code } = useParams();
    const { data: suit, isLoading, isError } = useSuit(code);
    const [activeImage, setActiveImage] = useState(0);
    if (isLoading) {
        return (_jsxs("div", { className: cx('re-container', l.sectionFirst, s.layout), children: [_jsx(Skeleton, { height: "560px", radius: "var(--radius-md)" }), _jsxs("div", { className: l.stack, children: [_jsx(Skeleton, { shape: "text", width: "30%", height: "14px" }), _jsx(Skeleton, { shape: "text", width: "70%", height: "36px" }), _jsx(SkeletonText, { lines: 4 })] })] }));
    }
    if (isError || !suit) {
        return (_jsx("div", { className: cx('re-container', l.sectionFirst), children: _jsx(EmptyState, { tone: "error", title: "No encontramos ese modelo", description: "Puede que el enlace est\u00E9 caducado o que el modelo ya no est\u00E9 en cat\u00E1logo.", action: _jsx(ButtonLink, { to: paths.catalog, variant: "primary", children: "Volver al cat\u00E1logo" }) }) }));
    }
    const images = suit.images.length > 0 ? suit.images : [];
    const current = images[activeImage] ?? images[0];
    return (_jsxs("div", { className: cx('re-container', l.sectionFirst), children: [_jsxs("nav", { className: s.breadcrumb, "aria-label": "Ruta de navegaci\u00F3n", children: [_jsx(Link, { to: paths.catalog, children: "Cat\u00E1logo" }), _jsx(Icon, { name: "chevronRight", size: 13 }), _jsx("span", { children: suit.styleName }), _jsx(Icon, { name: "chevronRight", size: 13 }), _jsx("span", { "aria-current": "page", children: suit.name })] }), _jsxs("div", { className: s.layout, children: [_jsxs("div", { className: s.gallery, children: [_jsx("figure", { className: s.mainImage, children: current ? (_jsx("img", { src: current.url, srcSet: current.variants
                                        .filter((variant) => variant.width)
                                        .map((variant) => `${variant.url} ${variant.width}w`)
                                        .join(', '), sizes: "(max-width: 1024px) 100vw, 560px", alt: current.altText ?? suit.name })) : (_jsx("div", { className: s.noImage, children: _jsx(Icon, { name: "hanger", size: 40 }) })) }), images.length > 1 ? (_jsx("div", { className: s.thumbs, role: "tablist", "aria-label": "Vistas del modelo", children: images.map((image, index) => (_jsx("button", { type: "button", role: "tab", "aria-selected": index === activeImage, "aria-label": `Vista ${index + 1}`, className: cx(s.thumb, index === activeImage && s.thumbActive), onClick: () => setActiveImage(index), children: _jsx("img", { src: image.url, alt: "", loading: "lazy" }) }, image.id))) })) : null] }), _jsxs("div", { className: s.info, children: [_jsxs("div", { className: l.row, children: [_jsx(Badge, { tone: "gold", appearance: "outline", size: "sm", children: suit.styleName }), _jsx("span", { className: s.code, children: suit.code })] }), _jsx("h1", { className: s.title, children: suit.name }), _jsx("p", { className: s.description, children: suit.description }), _jsx(Rule, { variant: "stitch", className: s.rule }), _jsxs("div", { className: s.priceRow, children: [_jsx(Price, { amount: suit.basePrice, prefix: "Desde", size: "lg" }), _jsx("p", { className: s.priceNote, children: "El precio final depende de la tela y los detalles que elijas. Lo ver\u00E1s actualizado mientras personalizas, sin sorpresas al final." })] }), _jsxs("div", { className: s.actions, children: [_jsx(ButtonLink, { to: paths.customize(suit.code), variant: "primary", size: "lg", fullWidth: true, rightIcon: _jsx(Icon, { name: "arrowRight", size: 17 }), children: "Personalizar este traje" }), _jsx(ButtonLink, { to: paths.bookAppointment, variant: "secondary", size: "lg", fullWidth: true, leftIcon: _jsx(Icon, { name: "calendar", size: 17 }), children: "Verlo en el taller" })] }), _jsxs(Card, { variant: "raised", className: s.included, children: [_jsx(Card.Header, { title: "Qu\u00E9 incluye" }), _jsx(Card.Body, { children: _jsx("ul", { role: "list", className: s.includedList, children: INCLUDED.map((item) => (_jsxs("li", { children: [_jsx(Icon, { name: "check", size: 15 }), item] }, item))) }) })] }), _jsxs("p", { className: s.timeline, children: [_jsx(Icon, { name: "clock", size: 15 }), "Tiempo estimado de confecci\u00F3n: ", _jsx("strong", { children: "4 a 6 semanas" }), " desde la toma de medidas."] })] })] })] }));
}
//# sourceMappingURL=SuitDetailPage.js.map