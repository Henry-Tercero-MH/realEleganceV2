import { useState } from 'react';
import type { Product } from '@real-elegance/shared';
import { EmptyState, SectionHeading, SkeletonCard, Tabs } from '@/components/ui';
import { ProductCard } from '@/features/catalog/ProductCards';
import { useProductCategories, useProducts } from '@/features/catalog/hooks';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';

export default function AccessoriesPage() {
  const [categoryId, setCategoryId] = useState<string>('todos');
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

  function handleAdd(product: Product) {
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

  return (
    <div className={cx('re-container', l.sectionFirst)}>
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow="Listo para llevar"
        title="Accesorios"
        description="Corbatas, pañuelos y camisas que rematan un traje. Se pagan completos y se envían de inmediato."
      />

      <div className={l.afterHeading}>
        <Tabs
          tabs={tabs}
          value={categoryId}
          onChange={setCategoryId}
          variant="pill"
          aria-label="Categorías de accesorios"
        />
      </div>

      {isError ? (
        <EmptyState
          tone="error"
          className={l.afterHeading}
          title="No pudimos cargar los accesorios"
        />
      ) : null}

      <div className={cx(l.gridProducts, l.afterHeading)}>
        {isLoading
          ? Array.from({ length: 8 }, (_, index) => <SkeletonCard key={index} />)
          : products?.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
      </div>

      {!isLoading && products?.length === 0 ? (
        <EmptyState icon="tag" title="Nada por aquí todavía" description="Prueba con otra categoría." />
      ) : null}
    </div>
  );
}
