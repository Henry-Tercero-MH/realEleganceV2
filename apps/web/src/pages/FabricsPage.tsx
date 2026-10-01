import { useSearchParams } from 'react-router-dom';
import { ButtonLink, EmptyState, Icon, SectionHeading, Skeleton, Tabs } from '@/components/ui';
import { FabricCard } from '@/features/catalog/ProductCards';
import { useFabricCategories, useFabrics } from '@/features/catalog/hooks';
import { paths } from '@/routes/paths';
import { SHOP_ENABLED, APPOINTMENT_IN_PERSON_URL } from '@/config/features';
import { useTranslation } from '@/context/LanguageContext';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';

export default function FabricsPage() {
  const t = useTranslation();
  // El filtro vive en la URL, no en `useState`: se puede compartir por enlace
  // y el botón «atrás» funciona (misma decisión que en CatalogPage).
  const [params, setParams] = useSearchParams();
  const categoryId = params.get('categoria') ?? 'todas';

  function setCategoryId(value: string) {
    const next = new URLSearchParams(params);
    if (value === 'todas') next.delete('categoria');
    else next.set('categoria', value);
    setParams(next, { replace: true });
  }

  const { data: categories } = useFabricCategories();
  const { data: fabrics, isLoading, isError } = useFabrics({
    categoryId: categoryId === 'todas' ? null : Number(categoryId),
  });

  const tabs = [
    { id: 'todas', label: t.fabrics.tabAll },
    ...(categories ?? []).map((category) => ({ id: String(category.id), label: category.name })),
  ];

  return (
    <div className={cx('re-container', l.sectionFirst)}>
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow={t.fabrics.eyebrow}
        title={t.fabrics.title}
        description={t.fabrics.description}
        action={
          <ButtonLink
            to={SHOP_ENABLED ? paths.bookAppointment : APPOINTMENT_IN_PERSON_URL}
            external={!SHOP_ENABLED}
            variant="secondary"
            leftIcon={<Icon name="calendar" size={16} />}
          >
            {t.fabrics.viewInPerson}
          </ButtonLink>
        }
      />

      <div className={l.afterHeading}>
        <Tabs
          tabs={tabs}
          value={categoryId}
          onChange={setCategoryId}
          variant="pill"
          aria-label={t.fabrics.categoriesAriaLabel}
        />
      </div>

      {isError ? (
        <EmptyState
          tone="error"
          className={l.afterHeading}
          title={t.fabrics.errorTitle}
          description={t.fabrics.errorDescription}
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
          title={t.fabrics.emptyTitle}
          description={t.fabrics.emptyDescription}
        />
      ) : null}
    </div>
  );
}
