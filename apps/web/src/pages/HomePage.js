import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { ButtonLink, Icon, SectionHeading, SkeletonCard, Stepper, EmptyState, } from '@/components/ui';
import { SuitCard } from '@/features/catalog/ProductCards';
import { useSuits } from '@/features/catalog/hooks';
import { paths } from '@/routes/paths';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './HomePage.module.css';
/** Los ocho pasos del §1 del prompt maestro, tal cual los vive el cliente. */
const JOURNEY = [
    { id: '1', label: 'Explorar', description: 'Elige el modelo que te representa' },
    { id: '2', label: 'Personalizar', description: 'Tela, solapa, forro y botones' },
    { id: '3', label: 'Cotizar', description: 'Precio cerrado, sin sorpresas' },
    { id: '4', label: 'Agendar', description: 'Reservas tu cita en el taller' },
    { id: '5', label: 'Medidas', description: 'Te tomamos medidas y dejas el anticipo' },
    { id: '6', label: 'Confirmado', description: 'Tu pedido entra al taller' },
    { id: '7', label: 'Confección', description: 'Corte, costura y pruebas' },
    { id: '8', label: 'Entrega', description: 'Pagas el saldo y te lo llevas' },
];
const INSTAGRAM_POSTS = [
    { image: '/images/coloresdetraje.png', alt: 'El color: por qué el azul marino es la elección más segura' },
    { image: '/images/entalledeunsaco.png', alt: 'El entalle: los hombros limpios y la silueta que sigue el cuerpo' },
    { image: '/images/telatijerasycinta.png', alt: 'La tela: lana al 100% o mezclas de alta calidad' },
    { image: '/images/tuprimertrajebienconfeccionado.png', alt: 'Tu primer traje bien confeccionado' },
];
/** La franja de beneficios del hero (§ misma referencia visual). */
const FEATURES = [
    { icon: 'hanger', title: 'Hecho a medida', text: 'Ajuste perfecto para ti' },
    { icon: 'needle', title: '100% artesanal', text: 'Hecho a mano, puntada a puntada' },
    { icon: 'star', title: 'Telas premium', text: 'Selección de las mejores telas' },
    { icon: 'checkCircle', title: 'Garantía de calidad', text: 'Satisfacción garantizada' },
];
const CRAFT = [
    {
        icon: 'scissors',
        title: 'Cortado a mano',
        text: 'Cada patrón se traza sobre tus medidas. Nada de tallas estándar retocadas.',
    },
    {
        icon: 'spool',
        title: 'Telas con nombre',
        text: 'Lanas Súper 110 a 130, linos irlandeses y tweeds Donegal. Sabemos de dónde viene cada metro.',
    },
    {
        icon: 'ruler',
        title: 'Pruebas incluidas',
        text: 'Ajustamos hasta que la chaqueta caiga como debe. Sin coste adicional.',
    },
    {
        icon: 'eye',
        title: 'Seguimiento en línea',
        text: 'Mira en qué etapa está tu traje —corte, confección, prueba— desde tu cuenta.',
    },
];
export default function HomePage() {
    // Solo los cuatro primeros: la portada invita, no agota el catálogo.
    const { data, isLoading, isError } = useSuits({ pageSize: 4, sort: 'featured' });
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: s.hero, children: [_jsxs("div", { className: cx('re-container', s.heroGrid), children: [_jsxs("div", { className: s.heroContent, children: [_jsxs("p", { className: s.heroEyebrow, children: [_jsx("span", { className: s.heroTick, "aria-hidden": "true" }), "Sastrer\u00EDa artesanal \u00B7 Guatemala"] }), _jsxs("h1", { className: s.heroTitle, children: ["Un traje que no se parece a ning\u00FAn otro", _jsx("span", { className: s.heroTitleAccent, children: " porque no lo es." })] }), _jsx("p", { className: s.heroText, children: "Elige el modelo, la tela y cada detalle. Nosotros lo cortamos a mano sobre tus medidas y t\u00FA sigues en l\u00EDnea c\u00F3mo avanza, puntada a puntada." }), _jsxs("div", { className: s.heroActions, children: [_jsx(ButtonLink, { to: paths.catalog, variant: "primary", size: "lg", leftIcon: _jsx(Icon, { name: "scissors", size: 17 }), children: "Dise\u00F1ar mi traje" }), _jsx(ButtonLink, { to: paths.bookAppointment, variant: "secondary", size: "lg", leftIcon: _jsx(Icon, { name: "calendar", size: 17 }), children: "Agendar una cita" })] })] }), _jsx("div", { className: s.heroPhotoWrap, children: _jsx("figure", { className: s.heroPhoto, children: _jsx("img", { src: "/images/telaazulconocinta.png", alt: "", className: s.heroPhotoImg }) }) })] }), _jsx("div", { className: "re-container", children: _jsx("ul", { role: "list", className: s.featureStrip, children: FEATURES.map((feature) => (_jsxs("li", { className: s.featureItem, children: [_jsx(Icon, { name: feature.icon, size: 26, className: s.featureIcon }), _jsxs("div", { children: [_jsx("p", { className: s.featureTitle, children: feature.title }), _jsx("p", { className: s.featureText, children: feature.text })] })] }, feature.title))) }) }), _jsx("div", { className: "re-container", children: _jsxs("dl", { className: s.heroStats, children: [_jsxs("div", { children: [_jsx("dt", { children: "A\u00F1os cosiendo" }), _jsxs("dd", { children: ["27", _jsx("span", { className: s.statTick, "aria-hidden": "true" })] })] }), _jsxs("div", { children: [_jsx("dt", { children: "Trajes entregados" }), _jsxs("dd", { children: ["4 200+", _jsx("span", { className: s.statTick, "aria-hidden": "true" })] })] }), _jsxs("div", { children: [_jsx("dt", { children: "Telas en muestrario" }), _jsxs("dd", { children: ["60", _jsx("span", { className: s.statTick, "aria-hidden": "true" })] })] })] }) })] }), _jsxs("section", { className: cx('re-container', l.section), children: [_jsx(SectionHeading, { eyebrow: "Del taller", title: "Modelos que definen la casa", description: "Cinco cortes, una misma manera de trabajar. Cualquiera de ellos se personaliza por completo.", action: _jsx(ButtonLink, { to: paths.catalog, variant: "ghost", rightIcon: _jsx(Icon, { name: "arrowRight", size: 16 }), children: "Ver todo el cat\u00E1logo" }) }), _jsx("div", { className: cx(l.gridSuits, l.afterHeading), children: isLoading
                            ? Array.from({ length: 4 }, (_, index) => _jsx(SkeletonCard, {}, index))
                            : data?.items.map((suit) => _jsx(SuitCard, { suit: suit }, suit.id)) }), isError ? (_jsx(EmptyState, { tone: "error", className: l.afterHeading, title: "No pudimos cargar el cat\u00E1logo", description: "Vuelve a intentarlo en un momento o escr\u00EDbenos si el problema sigue." })) : null] }), _jsx("section", { className: s.journey, children: _jsxs("div", { className: "re-container", children: [_jsx(SectionHeading, { align: "center", eyebrow: "C\u00F3mo funciona", title: "De la idea al armario, en ocho pasos", description: "Sabes en todo momento d\u00F3nde est\u00E1 tu traje y qu\u00E9 falta para tenerlo." }), _jsx("div", { className: l.afterHeading, children: _jsx(Stepper, { steps: JOURNEY, current: JOURNEY.length, "aria-label": "Proceso de encargo de un traje" }) })] }) }), _jsxs("section", { className: cx('re-container', l.section), children: [_jsx(SectionHeading, { eyebrow: "Por qu\u00E9 a medida", title: "Lo que cambia cuando algo se hace despacio" }), _jsx("div", { className: cx(s.craftGrid, l.afterHeading), children: CRAFT.map((item) => (_jsxs("article", { className: s.craftCard, children: [_jsx("span", { className: s.craftIcon, children: _jsx(Icon, { name: item.icon, size: 22 }) }), _jsx("h3", { className: s.craftTitle, children: item.title }), _jsx("p", { className: s.craftText, children: item.text })] }, item.title))) })] }), _jsxs("section", { className: cx('re-container', l.section), children: [_jsx(SectionHeading, { align: "center", eyebrow: "@realelegance", title: "S\u00EDguenos en Instagram", description: "Consejos de sastrer\u00EDa y un vistazo al taller, publicados cada semana." }), _jsx("div", { className: cx(s.igGrid, l.afterHeading), children: INSTAGRAM_POSTS.map((post) => (_jsx("div", { className: s.igItem, children: _jsx("img", { src: post.image, alt: post.alt, loading: "lazy" }) }, post.image))) })] }), _jsxs("section", { className: cx('re-container', l.section), children: [_jsxs("div", { className: s.cta, children: [_jsxs("div", { children: [_jsx("h2", { className: s.ctaTitle, children: "\u00BFYa tienes un pedido en marcha?" }), _jsx("p", { className: s.ctaText, children: "Consulta el avance de tu traje con el n\u00FAmero que te dimos al confirmarlo. No hace falta iniciar sesi\u00F3n." })] }), _jsx(ButtonLink, { to: paths.tracking, variant: "primary", size: "lg", children: "Ver el seguimiento" })] }), _jsxs("p", { className: s.demoNote, children: [_jsx(Icon, { name: "info", size: 15 }), "Versi\u00F3n de dise\u00F1o con datos de demostraci\u00F3n.", ' ', _jsx(Link, { to: paths.login, children: "Entra con las cuentas de prueba" }), " para ver el \u00E1rea de cliente y el back-office."] })] })] }));
}
//# sourceMappingURL=HomePage.js.map