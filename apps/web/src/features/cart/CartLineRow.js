import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Icon, IconButton, Price, QuantityStepper } from '@/components/ui';
import { CART_ITEM_TYPE_LABELS } from '@real-elegance/shared';
import { lineTotal } from './pricing';
import { cx } from '@/lib/cx';
import s from './CartLineRow.module.css';
/**
 * Una línea del carrito. La comparten el panel lateral y la página `/carrito`
 * para que el traje se vea igual en los dos sitios.
 */
export function CartLineRow({ line, onQuantityChange, onRemove, variant = 'compact', }) {
    const isMadeToMeasure = line.itemType === 'made_to_measure';
    return (_jsxs("article", { className: cx(s.row, s[variant]), children: [_jsx("div", { className: s.thumb, children: line.imageUrl ? (_jsx("img", { src: line.imageUrl, alt: "", loading: "lazy" })) : (_jsx(Icon, { name: "hanger", size: 22 })) }), _jsxs("div", { className: s.body, children: [_jsxs("div", { className: s.headline, children: [_jsx("h3", { className: s.name, children: line.displayName }), _jsx(Badge, { tone: isMadeToMeasure ? 'gold' : 'neutral', size: "sm", children: CART_ITEM_TYPE_LABELS[line.itemType] })] }), line.displaySubtitle ? _jsx("p", { className: s.subtitle, children: line.displaySubtitle }) : null, variant === 'full' && line.selectedOptions.length > 0 ? (_jsx("dl", { className: s.options, children: line.selectedOptions.map((option) => (_jsxs("div", { className: s.option, children: [_jsx("dt", { children: option.groupName }), _jsxs("dd", { children: [option.name, option.priceDelta !== 0 ? (_jsxs("span", { className: s.delta, children: [option.priceDelta > 0 ? '+' : '−', "Q", Math.abs(option.priceDelta)] })) : null] })] }, option.id))) })) : null, _jsxs("div", { className: s.controls, children: [_jsx(QuantityStepper, { value: line.quantity, onChange: (quantity) => onQuantityChange(line.lineId, quantity), max: line.maxQuantity, size: variant === 'compact' ? 'sm' : 'md', label: line.displayName }), _jsx(Price, { amount: lineTotal(line), size: variant === 'compact' ? 'sm' : 'md' })] })] }), _jsx(IconButton, { label: `Quitar ${line.displayName} del carrito`, icon: _jsx(Icon, { name: "trash", size: 16 }), variant: "danger", size: "sm", onClick: () => onRemove(line.lineId), className: s.remove })] }));
}
//# sourceMappingURL=CartLineRow.js.map