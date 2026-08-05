import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Icon,
  OptionCard,
  Price,
  Rule,
  SectionHeading,
  Skeleton,
} from '@/components/ui';
import { useFabrics, useOptionGroups, useSuit } from '@/features/catalog/hooks';
import { describeOptions, priceMadeToMeasure, METERS_PER_SUIT } from '@/features/cart/pricing';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { paths } from '@/routes/paths';
import { formatCurrency } from '@/lib/format';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CustomizePage.module.css';

export default function CustomizePage() {
  const { code } = useParams<{ code: string }>();
  const { data: suit, isLoading: loadingSuit, isError } = useSuit(code);
  const { data: fabrics, isLoading: loadingFabrics } = useFabrics();
  const { data: optionGroups, isLoading: loadingOptions } = useOptionGroups();

  const { addItem } = useCart();
  const toast = useToast();

  const [fabricId, setFabricId] = useState<number | null>(null);
  /** Una opción elegida por grupo: `{ [groupId]: optionValueId }`. */
  const [selections, setSelections] = useState<Record<number, number>>({});

  // Cuando llegan las opciones, preseleccionamos la primera de cada grupo
  // obligatorio: la persona empieza con un traje válido, no con un formulario
  // vacío que la regaña.
  const defaults = useMemo(() => {
    if (!optionGroups) return {};
    return Object.fromEntries(
      optionGroups
        .filter((group) => group.isRequired && group.values[0])
        .map((group) => [group.id, group.values[0]!.id]),
    ) as Record<number, number>;
  }, [optionGroups]);

  const effectiveSelections = { ...defaults, ...selections };
  const selectedOptionIds = Object.values(effectiveSelections);
  const fabric = fabrics?.find((item) => item.id === fabricId) ?? null;

  const unitPrice =
    suit && fabric && optionGroups
      ? priceMadeToMeasure(suit, fabric, selectedOptionIds, optionGroups)
      : null;

  const selectedOptions =
    optionGroups && selectedOptionIds.length > 0
      ? describeOptions(selectedOptionIds, optionGroups)
      : [];

  function handleAdd() {
    if (!suit || !fabric || unitPrice === null) return;

    addItem({
      itemType: 'made_to_measure',
      quantity: 1,
      unitPrice,
      suitModelId: suit.id,
      fabricId: fabric.id,
      optionValueIds: selectedOptionIds,
      productId: null,
      displayName: suit.name,
      displaySubtitle: `${fabric.name} · ${suit.styleName}`,
      imageUrl: suit.primaryImage?.url ?? null,
      selectedOptions,
      // Un traje a medida no tiene existencias, pero sí un tope razonable.
      maxQuantity: 5,
    });

    toast.success('Añadido al carrito', `${suit.name} en ${fabric.name}.`);
  }

  if (loadingSuit) {
    return (
      <div className={cx('re-container', l.sectionFirst)}>
        <Skeleton height="480px" radius="var(--radius-md)" />
      </div>
    );
  }

  if (isError || !suit) {
    return (
      <div className={cx('re-container', l.sectionFirst)}>
        <EmptyState
          tone="error"
          title="No encontramos ese modelo"
          action={
            <ButtonLink to={paths.catalog} variant="primary">
              Volver al catálogo
            </ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <div className={cx('re-container', l.sectionFirst)}>
      <nav className={s.breadcrumb} aria-label="Ruta de navegación">
        <Link to={paths.catalog}>Catálogo</Link>
        <Icon name="chevronRight" size={13} />
        <Link to={paths.suit(suit.code)}>{suit.name}</Link>
        <Icon name="chevronRight" size={13} />
        <span aria-current="page">Personalizar</span>
      </nav>

      <SectionHeading
        as="h1"
        eyebrow={`Paso 2 de 8 · ${suit.styleName}`}
        title={`Personaliza tu ${suit.name}`}
        description="Elige la tela y los acabados. El precio se actualiza al instante; nada se cobra hasta que confirmes."
      />

      <div className={cx(s.layout, l.afterHeading)}>
        <div className={s.config}>
          {/* ── Simulador 2D — fuera de alcance de esta fase (§13) ──────── */}
          <Card variant="outlined" className={s.comingSoon}>
            <Card.Body className={s.comingSoonBody}>
              <span className={s.comingSoonIcon}>
                <Icon name="sparkle" size={22} />
              </span>
              <div>
                <div className={l.row}>
                  <h2 className={s.comingSoonTitle}>Vista previa en 2D</h2>
                  <Badge tone="gold" size="sm">
                    Próximamente
                  </Badge>
                </div>
                <p className={s.comingSoonText}>
                  Estamos dibujando el simulador que te enseñará tu traje mientras lo eliges.
                  Mientras tanto, cada opción indica exactamente qué cambia.
                </p>
              </div>
              <Button variant="ghost" onClick={() => toast.toast({ title: 'Te avisaremos', description: 'Te escribiremos en cuanto esté disponible.' })}>
                Avísame
              </Button>
            </Card.Body>
          </Card>

          {/* ── Tela ───────────────────────────────────────────────────── */}
          <section className={s.group} aria-labelledby="grupo-tela">
            <div className={s.groupHeader}>
              <h2 className={s.groupTitle} id="grupo-tela">
                Tela
              </h2>
              <p className={s.groupHint}>
                Un traje consume unos {METERS_PER_SUIT} metros. El precio de la tela ya va incluido
                en el total.
              </p>
            </div>

            {loadingFabrics ? (
              <div className={s.optionsGrid}>
                {Array.from({ length: 6 }, (_, index) => (
                  <Skeleton key={index} height="180px" radius="var(--radius-md)" />
                ))}
              </div>
            ) : (
              <div className={s.optionsGrid}>
                {fabrics?.map((item) => (
                  <OptionCard
                    key={item.id}
                    layout="tile"
                    name="tela"
                    value={item.id}
                    checked={fabricId === item.id}
                    onChange={(value) => setFabricId(Number(value))}
                    title={item.name}
                    description={item.composition}
                    priceDelta={item.pricePerMeter * METERS_PER_SUIT}
                    swatchColor={item.colorHex}
                    imageUrl={item.primaryImage?.url ?? null}
                    disabled={item.stockMeters < METERS_PER_SUIT}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Acabados ───────────────────────────────────────────────── */}
          {loadingOptions
            ? null
            : optionGroups?.map((group) => (
                <section key={group.id} className={s.group} aria-labelledby={`grupo-${group.id}`}>
                  <div className={s.groupHeader}>
                    <h2 className={s.groupTitle} id={`grupo-${group.id}`}>
                      {group.name}
                      {!group.isRequired ? <span className={s.optional}>Opcional</span> : null}
                    </h2>
                    {group.description ? <p className={s.groupHint}>{group.description}</p> : null}
                  </div>

                  <div className={s.optionsList}>
                    {group.values.map((value) => (
                      <OptionCard
                        key={value.id}
                        name={`grupo-${group.id}`}
                        value={value.id}
                        checked={effectiveSelections[group.id] === value.id}
                        onChange={(next) =>
                          setSelections((current) => ({ ...current, [group.id]: Number(next) }))
                        }
                        title={value.name}
                        description={value.description}
                        priceDelta={value.priceDelta}
                      />
                    ))}
                  </div>
                </section>
              ))}
        </div>

        {/* ── Resumen ──────────────────────────────────────────────────── */}
        <aside className={s.summary}>
          <Card variant="raised">
            <Card.Media ratio="4/3">
              {suit.primaryImage ? (
                <img src={suit.primaryImage.url} alt={suit.name} />
              ) : (
                <div />
              )}
            </Card.Media>

            <Card.Header eyebrow={suit.styleName} title={suit.name} />

            <Card.Body>
              <dl className={s.recap}>
                <div>
                  <dt>Precio base</dt>
                  <dd>{formatCurrency(suit.basePrice)}</dd>
                </div>
                <div>
                  <dt>Tela</dt>
                  <dd>
                    {fabric
                      ? `${fabric.name} · ${formatCurrency(fabric.pricePerMeter * METERS_PER_SUIT)}`
                      : 'Sin elegir'}
                  </dd>
                </div>
                {selectedOptions
                  .filter((option) => option.priceDelta !== 0)
                  .map((option) => (
                    <div key={option.id}>
                      <dt>{option.groupName}</dt>
                      <dd>
                        {option.name} · {option.priceDelta > 0 ? '+' : '−'}
                        {formatCurrency(Math.abs(option.priceDelta))}
                      </dd>
                    </div>
                  ))}
              </dl>

              <Rule variant="stitch" className={s.recapRule} />

              <div className={s.total}>
                <span>Total del traje</span>
                {unitPrice !== null ? (
                  <Price amount={unitPrice} size="lg" />
                ) : (
                  <span className={s.pending}>Elige una tela</span>
                )}
              </div>
            </Card.Body>

            <Card.Footer className={s.summaryFooter}>
              <Button variant="primary" fullWidth disabled={!fabric} onClick={handleAdd}>
                Añadir al carrito
              </Button>
              <p className={s.summaryNote}>
                Al confirmar el pedido pagarás el 50 % de anticipo y agendaremos tu cita de medidas.
              </p>
            </Card.Footer>
          </Card>
        </aside>
      </div>
    </div>
  );
}
