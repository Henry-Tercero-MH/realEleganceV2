import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { EmptyState, SectionHeading, SkeletonCard, Tabs } from '@/components/ui';
import { ProductCard } from '@/features/catalog/ProductCards';
import { useProductCategories, useProducts } from '@/features/catalog/hooks';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
export default function AccessoriesPage() {
    const [categoryId, setCategoryId] = useState('todos');
    const { data: categories } = useProductCategories();
    const { data: products, isLoading, isError } = useProducts({
        categoryId: categoryId === 'todos' ? null : Number(categoryId),
    });
    const { addItem } = useCart();
    const toast = useToast();
    const tabs = [
        { id: 'todos', label: 'Todos' },
        ...(categories ?? []).map((category) => ({ id: String(category.id), label: category.name })),
    ];
    function handleAdd(product) {
        addItem({
            itemType: 'ready_to_wear',
            quantity: 1,
            unitPrice: product.price,
            suitModelId: null,
            fabricId: null,
            optionValueIds: [],
            productId: product.id,
            displayName: product.name,
            displaySubtitle: product.categoryName,
            imageUrl: product.primaryImage?.url ?? null,
            selectedOptions: [],
            maxQuantity: product.stock,
        });
        toast.success('Añadido al carrito', product.name);
    }
    return (_jsxs("div", { className: cx('re-container', l.sectionFirst), children: [_jsx(SectionHeading, { as: "h1", size: "lg", eyebrow: "Listo para llevar", title: "Accesorios", description: "Corbatas, pa\u00F1uelos y camisas que rematan un traje. Se pagan completos y se env\u00EDan de inmediato." }), _jsx("div", { className: l.afterHeading, children: _jsx(Tabs, { tabs: tabs, value: categoryId, onChange: setCategoryId, variant: "pill", "aria-label": "Categor\u00EDas de accesorios" }) }), isError ? (_jsx(EmptyState, { tone: "error", className: l.afterHeading, title: "No pudimos cargar los accesorios" })) : null, _jsx("div", { className: cx(l.gridProducts, l.afterHeading), children: isLoading
                    ? Array.from({ length: 8 }, (_, index) => _jsx(SkeletonCard, {}, index))
                    : products?.map((product) => (_jsx(ProductCard, { product: product, onAdd: handleAdd }, product.id))) }), !isLoading && products?.length === 0 ? (_jsx(EmptyState, { icon: "tag", title: "Nada por aqu\u00ED todav\u00EDa", description: "Prueba con otra categor\u00EDa." })) : null] }));
}
//# sourceMappingURL=AccessoriesPage.js.map