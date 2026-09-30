import { useSearchParams } from 'react-router-dom';
import type { Product } from '@real-elegance/shared';
import { EmptyState, SectionHeading, SkeletonCard, Tabs } from '@/components/ui';
import { ProductCard } from '@/features/catalog/ProductCards';
import { useProductCategories, useProducts } from '@/features/catalog/hooks';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { SHOP_ENABLED } from '@/config/features';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';

export default function AccessoriesPage() {
  // El filtro vive en la URL, no en `useState`: se puede compartir por enlace
  // y el botón «atrás» funciona (misma decisión que en CatalogPage).
  const [params, setParams] = useSearchParams();
  const categoryId = params.get('categoria') ?? 'todos';

  function setCategoryId(value: string) {
    const next = new URLSearchParams(params);
    if (value === 'todos') next.delete('categoria');
    else next.set('categoria', value);
    setParams(next, { replace: true });
  }

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
              <ProductCard
                key={product.id}
                product={product}
                // Fase solo informativa: sin carrito, la tarjeta es solo vitrina.
                onAdd={SHOP_ENABLED ? handleAdd : undefined}
              />
            ))}
      </div>

      {!isLoading && products?.length === 0 ? (
        <EmptyState icon="tag" title="Nada por aquí todavía" description="Prueba con otra categoría." />
      ) : null}
    </div>
  );
}
