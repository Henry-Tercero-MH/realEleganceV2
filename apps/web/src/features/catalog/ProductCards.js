import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Badge, Card, Icon, Price } from '@/components/ui';
import { paths } from '@/routes/paths';
import { formatCurrency, truncate } from '@/lib/format';
import s from './ProductCards.module.css';
/** `srcset` a partir de las variantes que devuelve el backend. */
function srcSet(variants) {
    const usable = variants.filter((variant) => variant.width);
    if (usable.length === 0)
        return undefined;
    return usable.map((variant) => `${variant.url} ${variant.width}w`).join(', ');
}
/** Tarjeta de un modelo de traje, para las rejillas de la tienda. */
export function SuitCard({ suit }) {
    const image = suit.primaryImage;
    return (_jsxs(Card, { interactive: true, className: s.card, children: [_jsxs(Card.Media, { ratio: "3/4", children: [image ? (_jsx("img", { src: image.url, srcSet: srcSet(image.variants), sizes: "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px", alt: image.altText ?? suit.name, loading: "lazy" })) : (_jsx("div", { className: s.noImage, children: _jsx(Icon, { name: "hanger", size: 28 }) })), _jsx("span", { className: s.code, children: suit.code })] }), _jsx(Card.Header, { eyebrow: suit.styleName, title: 
                // El enlace envuelve solo el título, pero su ::after cubre la tarjeta
                // entera: un único destino para el lector de pantalla, área grande
                // para el ratón.
                _jsx(Link, { to: paths.suit(suit.code), className: s.link, children: suit.name }) }), _jsx(Card.Body, { children: suit.description ? truncate(suit.description, 110) : null }), _jsxs(Card.Footer, { className: s.footer, children: [_jsx(Price, { amount: suit.basePrice, prefix: "Desde", size: "sm" }), _jsxs("span", { className: s.cta, children: ["Personalizar ", _jsx(Icon, { name: "arrowRight", size: 15 })] })] })] }));
}
/** Tarjeta de un accesorio listo para llevar. */
export function ProductCard({ product, onAdd }) {
    const image = product.primaryImage;
    const outOfStock = product.stock <= 0;
    return (_jsxs(Card, { interactive: !outOfStock, className: s.card, children: [_jsxs(Card.Media, { ratio: "1/1", children: [image ? (_jsx("img", { src: image.url, srcSet: srcSet(image.variants), sizes: "(max-width: 640px) 45vw, 260px", alt: image.altText ?? product.name, loading: "lazy" })) : (_jsx("div", { className: s.noImage, children: _jsx(Icon, { name: "tag", size: 26 }) })), outOfStock ? (_jsx("span", { className: s.stockFlag, children: _jsx(Badge, { tone: "danger", size: "sm", children: "Agotado" }) })) : product.stock <= 10 ? (_jsx("span", { className: s.stockFlag, children: _jsxs(Badge, { tone: "warning", size: "sm", children: ["\u00DAltimas ", product.stock] }) })) : null] }), _jsx(Card.Header, { eyebrow: product.categoryName, title: product.name, subtitle: product.sku }), _jsxs(Card.Footer, { className: s.footer, children: [_jsx(Price, { amount: product.price, size: "sm" }), onAdd ? (_jsxs("button", { type: "button", className: s.addButton, onClick: () => onAdd(product), disabled: outOfStock, "aria-label": `Añadir ${product.name} al carrito`, children: [_jsx(Icon, { name: "plus", size: 15 }), "A\u00F1adir"] })) : null] })] }));
}
/** Muestra del muestrario de telas. */
export function FabricCard({ fabric, onSelect }) {
    const image = fabric.primaryImage;
    const lowStock = fabric.stockMeters < 15;
    const content = (_jsxs(_Fragment, { children: [_jsx("span", { className: s.swatch, style: { backgroundColor: fabric.colorHex ?? undefined }, "aria-hidden": "true", children: image ? _jsx("img", { src: image.url, alt: "", loading: "lazy" }) : null }), _jsxs("span", { className: s.fabricBody, children: [_jsx("span", { className: s.fabricEyebrow, children: fabric.categoryName }), _jsx("span", { className: s.fabricName, children: fabric.name }), _jsx("span", { className: s.fabricComposition, children: fabric.composition }), _jsxs("span", { className: s.fabricMeta, children: [_jsxs("span", { className: s.fabricPrice, children: [formatCurrency(fabric.pricePerMeter), " / metro"] }), lowStock ? (_jsxs(Badge, { tone: "warning", size: "sm", children: [fabric.stockMeters, " m"] })) : null] })] })] }));
    if (onSelect) {
        return (_jsx("button", { type: "button", className: s.fabricCard, onClick: () => onSelect(fabric), children: content }));
    }
    return _jsx("div", { className: s.fabricCard, children: content });
}
//# sourceMappingURL=ProductCards.js.map