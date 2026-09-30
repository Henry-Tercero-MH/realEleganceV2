import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Badge,
  ButtonLink,
  Card,
  EmptyState,
  Icon,
  Price,
  Rule,
  Skeleton,
  SkeletonText,
} from '@/components/ui';
import { useSuit } from '@/features/catalog/hooks';
import { paths } from '@/routes/paths';
import { SHOP_ENABLED, getWhatsAppUrl } from '@/config/features';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './SuitDetailPage.module.css';

const INCLUDED = [
  'Patrón trazado sobre tus medidas',
  'Dos pruebas de ajuste incluidas',
  'Ojales y botones cosidos a mano',
  'Garantía de ajuste durante 6 meses',
];

export default function SuitDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { data: suit, isLoading, isError } = useSuit(code);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className={cx('re-container', l.sectionFirst, s.layout)}>
        <Skeleton height="560px" radius="var(--radius-md)" />
        <div className={l.stack}>
          <Skeleton shape="text" width="30%" height="14px" />
          <Skeleton shape="text" width="70%" height="36px" />
          <SkeletonText lines={4} />
        </div>
      </div>
    );
  }

  if (isError || !suit) {
    return (
      <div className={cx('re-container', l.sectionFirst)}>
        <EmptyState
          tone="error"
          title="No encontramos ese modelo"
          description="Puede que el enlace esté caducado o que el modelo ya no esté en catálogo."
          action={
            <ButtonLink to={paths.catalog} variant="primary">
              Volver al catálogo
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const images = suit.images.length > 0 ? suit.images : [];
  const current = images[activeImage] ?? images[0];

  return (
    <div className={cx('re-container', l.sectionFirst)}>
      <nav className={s.breadcrumb} aria-label="Ruta de navegación">
        <Link to={paths.catalog}>Catálogo</Link>
        <Icon name="chevronRight" size={13} />
        <span>{suit.styleName}</span>
        <Icon name="chevronRight" size={13} />
        <span aria-current="page">{suit.name}</span>
      </nav>

      <div className={s.layout}>
        {/* ── Galería ──────────────────────────────────────────────────── */}
        <div className={s.gallery}>
          <figure className={s.mainImage}>
            {current ? (
              <img
                src={current.url}
                srcSet={current.variants
                  .filter((variant) => variant.width)
                  .map((variant) => `${variant.url} ${variant.width}w`)
                  .join(', ')}
                sizes="(max-width: 1024px) 100vw, 560px"
                alt={current.altText ?? suit.name}
              />
            ) : (
              <div className={s.noImage}>
                <Icon name="hanger" size={40} />
              </div>
            )}
          </figure>

          {images.length > 1 ? (
            <div className={s.thumbs} role="tablist" aria-label="Vistas del modelo">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeImage}
                  aria-label={`Vista ${index + 1}`}
                  className={cx(s.thumb, index === activeImage && s.thumbActive)}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image.url} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* ── Ficha ────────────────────────────────────────────────────── */}
        <div className={s.info}>
          <div className={l.row}>
            <Badge tone="gold" appearance="outline" size="sm">
              {suit.styleName}
            </Badge>
            <span className={s.code}>{suit.code}</span>
          </div>

          <h1 className={s.title}>{suit.name}</h1>
          <p className={s.description}>{suit.description}</p>

          <Rule variant="stitch" className={s.rule} />

          <div className={s.priceRow}>
            <Price amount={suit.basePrice} prefix="Desde" size="lg" />
            <p className={s.priceNote}>
              El precio final depende de la tela y los detalles que elijas. Lo verás actualizado
              mientras personalizas, sin sorpresas al final.
            </p>
          </div>

          <div className={s.actions}>
            {SHOP_ENABLED ? (
              <>
                <ButtonLink
                  to={paths.customize(suit.code)}
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<Icon name="arrowRight" size={17} />}
                >
                  Personalizar este traje
                </ButtonLink>
                <ButtonLink
                  to={paths.bookAppointment}
                  variant="secondary"
                  size="lg"
                  fullWidth
                  leftIcon={<Icon name="calendar" size={17} />}
                >
                  Verlo en el taller
                </ButtonLink>
              </>
            ) : (
              <ButtonLink
                to={getWhatsAppUrl(
                  `Hola, me interesa el modelo "${suit.name}" (${suit.code}). ¿Me ayudan a cotizarlo?`,
                )}
                external
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<Icon name="calendar" size={17} />}
              >
                Cotizar este traje por WhatsApp
              </ButtonLink>
            )}
          </div>

          <Card variant="raised" className={s.included}>
            <Card.Header title="Qué incluye" />
            <Card.Body>
              <ul role="list" className={s.includedList}>
                {INCLUDED.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={15} />
                    {item}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>

          <p className={s.timeline}>
            <Icon name="clock" size={15} />
            Tiempo estimado de confección: <strong>4 a 6 semanas</strong> desde la toma de medidas.
          </p>
        </div>
      </div>
    </div>
  );
}
