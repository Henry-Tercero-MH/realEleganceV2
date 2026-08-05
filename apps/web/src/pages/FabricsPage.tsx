import { useState } from 'react';
import { ButtonLink, EmptyState, Icon, SectionHeading, Skeleton, Tabs } from '@/components/ui';
import { FabricCard } from '@/features/catalog/ProductCards';
import { useFabricCategories, useFabrics } from '@/features/catalog/hooks';
import { paths } from '@/routes/paths';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';

export default function FabricsPage() {
  const [categoryId, setCategoryId] = useState<string>('todas');
  const { data: categories } = useFabricCategories();
  const { data: fabrics, isLoading, isError } = useFabrics({
    categoryId: categoryId === 'todas' ? null : Number(categoryId),
  });

  const tabs = [
    { id: 'todas', label: 'Todas' },
    ...(categories ?? []).map((category) => ({ id: String(category.id), label: category.name })),
  ];

  return (
    <div className={cx('re-container', l.sectionFirst)}>
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow="Muestrario"
        title="Telas de la casa"
        description="Lanas frías para el trópico, linos irlandeses y tweeds tejidos en telar. Todas se pueden ver y tocar en el taller antes de decidir."
        action={
          <ButtonLink
            to={paths.bookAppointment}
            variant="secondary"
            leftIcon={<Icon name="calendar" size={16} />}
          >
            Ver el muestrario en persona
          </ButtonLink>
        }
      />

      <div className={l.afterHeading}>
        <Tabs
          tabs={tabs}
          value={categoryId}
          onChange={setCategoryId}
          variant="pill"
          aria-label="Categorías de tela"
        />
      </div>

      {isError ? (
        <EmptyState
          tone="error"
          className={l.afterHeading}
          title="No pudimos cargar el muestrario"
          description="Vuelve a intentarlo en un momento."
        />
      ) : null}

      <div className={cx(l.gridFabrics, l.afterHeading)}>
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} height="106px" radius="var(--radius-md)" />
            ))
          : fabrics?.map((fabric) => <FabricCard key={fabric.id} fabric={fabric} />)}
      </div>

      {!isLoading && fabrics?.length === 0 ? (
        <EmptyState
          icon="spool"
          title="No hay telas en esta categoría"
          description="Prueba con otra o escríbenos: solemos conseguir piezas por encargo."
        />
      ) : null}
    </div>
  );
}
