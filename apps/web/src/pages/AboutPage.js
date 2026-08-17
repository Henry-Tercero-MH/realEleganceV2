import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonLink, Card, Icon, SectionHeading } from '@/components/ui';
import { paths } from '@/routes/paths';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './AboutPage.module.css';
const STEPS = [
    {
        icon: 'ruler',
        title: 'Medidas',
        text: 'Veintidós medidas y las observaciones que no caben en un número: un hombro más bajo, la costumbre de llevar el reloj a la derecha.',
    },
    {
        icon: 'scissors',
        title: 'Corte',
        text: 'El patrón se traza y se corta a mano sobre la tela. Es el paso que no admite prisa ni segunda oportunidad.',
    },
    {
        icon: 'needle',
        title: 'Confección',
        text: 'Entretela cosida, hombros montados uno a uno y ojales rematados a mano.',
    },
    {
        icon: 'hanger',
        title: 'Prueba y entrega',
        text: 'Dos pruebas para afinar el ajuste. Y si algo no cae bien seis meses después, se corrige.',
    },
];
export default function AboutPage() {
    return (_jsxs("div", { className: cx('re-container', l.sectionFirst), children: [_jsx(SectionHeading, { as: "h1", size: "lg", eyebrow: "Desde 1998", title: "El taller", description: "Real Elegance es una sastrer\u00EDa peque\u00F1a y deliberadamente lenta. Tres personas, un cuarto lleno de telas y la convicci\u00F3n de que un traje se hace una vez y se lleva veinte a\u00F1os." }), _jsxs("section", { className: cx(s.tailor, l.afterHeading), children: [_jsxs("div", { className: s.tailorGallery, children: [_jsx("img", { src: "/images/fotodue\u00F1o3.png", alt: "El sastre de Real Elegance en el taller", className: s.tailorImgMain }), _jsx("img", { src: "/images/fotodeue\u00F1o.png", alt: "El sastre con un saco a medida, apoyado en un pasillo del taller", className: s.tailorImgSmall }), _jsx("img", { src: "/images/fotodue\u00F1o2.png", alt: "Detalle de los botones de manga de un saco a medida", className: s.tailorImgSmall })] }), _jsxs("div", { children: [_jsx("h2", { className: s.tailorTitle, children: "El sastre" }), _jsx("p", { className: s.tailorText, children: "Cada traje que sale del taller pasa por las mismas manos que lo empezaron hace m\u00E1s de veinticinco a\u00F1os. No delegamos el corte ni las pruebas: es la \u00FAnica forma que conocemos de sostener la calidad." })] })] }), _jsx("div", { className: cx(s.grid, l.afterHeading), children: STEPS.map((step, index) => (_jsxs(Card, { variant: "raised", className: s.card, children: [_jsx(Card.Header, { eyebrow: `Etapa ${index + 1}`, title: _jsxs("span", { className: s.cardTitle, children: [_jsx(Icon, { name: step.icon, size: 20 }), step.title] }) }), _jsx(Card.Body, { children: step.text })] }, step.title))) }), _jsxs("section", { className: cx(s.visit, l.section), children: [_jsxs("div", { children: [_jsx("h2", { className: s.visitTitle, children: "Ven a vernos" }), _jsx("p", { className: s.visitText, children: "Estamos en la zona 10 de la Ciudad de Guatemala, de lunes a s\u00E1bado de 9:00 a 18:00. Puedes pasar sin cita para ver telas, pero para tomar medidas conviene reservar." })] }), _jsx(ButtonLink, { to: paths.bookAppointment, variant: "primary", size: "lg", children: "Agendar una visita" })] })] }));
}
//# sourceMappingURL=AboutPage.js.map