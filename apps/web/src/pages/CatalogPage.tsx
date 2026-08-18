import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  ButtonLink,
  EmptyState,
  Icon,
  Input,
  SectionHeading,
  Select,
  SkeletonCard,
} from '@/components/ui';
import { SuitCard } from '@/features/catalog/ProductCards';
import { useSuitStyles, useSuits } from '@/features/catalog/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { paths } from '@/routes/paths';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CatalogPage.module.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: de menor a mayor' },
  { value: 'price-desc', label: 'Precio: de mayor a menor' },
  { value: 'name', label: 'Nombre (A–Z)' },
];

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name';

export default function CatalogPage() {
  /*
   * Los filtros viven en la URL, no en `useState`: así la búsqueda se puede
   * compartir por enlace y el botón «atrás» del navegador funciona como espera
   * cualquiera.
   */
  const [params, setParams] = useSearchParams();

  const styleId = params.get('estilo') ? Number(params.get('estilo')) : null;
  const sort = (params.get('orden') as Sort | null) ?? 'featured';
  const page = Number(params.get('pagina') ?? 1);

  // El texto sí es local: escribir no debería reescribir la URL en cada tecla.
  const [search, setSearch] = useState(params.get('q') ?? '');
  const debouncedSearch = useDebounce(search, 350);

  const { data: styles } = useSuitStyles();
  const { data, isLoading, isError, isPlaceholderData } = useSuits({
    search: debouncedSearch || undefined,
    styleId,
    sort,
    page,
    pageSize: 9,
  });

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    // Cualquier cambio de filtro vuelve a la primera página.
    if (key !== 'pagina') next.delete('pagina');
    setParams(next, { replace: true });
  }

  const hasFilters = Boolean(styleId || search || sort !== 'featured');

  return (
    <div className={cx('re-container', l.sectionFirst)}>
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow="Catálogo"
        title="Elige tu corte"
        description="Cada modelo es un punto de partida: la tela, la solapa, el forro y los botones los eliges tú en el siguiente paso."
      />

      {/* ── Filtros ──────────────────────────────────────────────────────── */}
      <form className={cx(s.filters, l.afterHeading)} role="search" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Buscar"
          placeholder="Nombre o código del modelo…"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            updateParam('q', event.target.value);
          }}
          startAdornment={<Icon name="search" size={17} />}
          fieldClassName={s.search}
          type="search"
        />

        <Select
          label="Estilo"
          placeholder="Todos los estilos"
          value={styleId ?? ''}
          onChange={(event) => updateParam('estilo', event.target.value)}
          options={(styles ?? []).map((style) => ({ value: style.id, label: style.name }))}
        />

        <Select
          label="Ordenar por"
          value={sort}
          onChange={(event) => updateParam('orden', event.target.value)}
          options={SORT_OPTIONS}
        />

        {hasFilters ? (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('');
              setParams(new URLSearchParams(), { replace: true });
            }}
          >
            Limpiar
          </Button>
        ) : null}
      </form>

      {/* ── Resultados ───────────────────────────────────────────────────── */}
      <p className={s.count} aria-live="polite">
        {isLoading
          ? 'Buscando modelos…'
          : `${data?.total ?? 0} ${data?.total === 1 ? 'modelo' : 'modelos'}`}
      </p>

      {isError ? (
        <EmptyState
          tone="error"
          title="No pudimos cargar el catálogo"
          description="Ha fallado la conexión. Inténtalo de nuevo en unos segundos."
        />
      ) : null}

      <div className={cx(l.gridSuits, isPlaceholderData && s.stale)}>
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)
          : data?.items.map((suit) => <SuitCard key={suit.id} suit={suit} />)}
      </div>

      {!isLoading && data?.items.length === 0 ? (
        <EmptyState
          icon="search"
          title="Ningún modelo coincide"
          description="Prueba con otro estilo o borra los filtros. Si buscas algo que no está en el catálogo, podemos cortarlo igualmente: escríbenos."
          action={
            <ButtonLink to={paths.bookAppointment} variant="secondary">
              Agendar una consulta
            </ButtonLink>
          }
        />
      ) : null}

      {/* ── Paginación ───────────────────────────────────────────────────── */}
      {data && data.totalPages > 1 ? (
        <nav className={s.pagination} aria-label="Paginación del catálogo">
          <Button
            variant="ghost"
            disabled={page <= 1}
            onClick={() => updateParam('pagina', String(page - 1))}
            leftIcon={<Icon name="chevronLeft" size={16} />}
          >
            Anterior
          </Button>
          <span className={s.pageInfo}>
            Página {data.page} de {data.totalPages}
          </span>
          <Button
            variant="ghost"
            disabled={page >= data.totalPages}
            onClick={() => updateParam('pagina', String(page + 1))}
            rightIcon={<Icon name="chevronRight" size={16} />}
          >
            Siguiente
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
