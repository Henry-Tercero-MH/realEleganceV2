import { useMemo } from 'react';
import {
  ButtonLink,
  Icon,
  SectionHeading,
  SkeletonCard,
  Stepper,
  EmptyState,
} from '@/components/ui';
import { SuitCard } from '@/features/catalog/ProductCards';
import { useSuits } from '@/features/catalog/hooks';
import { paths } from '@/routes/paths';
import { SHOP_ENABLED, APPOINTMENT_IN_PERSON_URL, APPOINTMENT_VIRTUAL_URL } from '@/config/features';
import { useTranslation } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './HomePage.module.css';

/** Íconos de la franja de beneficios del hero; el texto sale del diccionario. */
const FEATURE_ICONS = ['hanger', 'needle', 'star', 'checkCircle'] as const;

/** Íconos de la sección de oficio; el texto sale del diccionario. */
const CRAFT_ICONS = ['scissors', 'spool', 'ruler', 'eye'] as const;

const INSTAGRAM_IMAGES = [
  '/images/coloresdetraje.png',
  '/images/entalledeunsaco.png',
  '/images/telatijerasycinta.png',
  '/images/tuprimertrajebienconfeccionado.png',
];

/** Pasos del "Cómo funciona" que, al pasar el cursor, despliegan estilos de traje. */
const JOURNEY_STEPS_WITH_STYLES = new Set([0, 1]);

interface StyleGalleryItem {
  id: number;
  name: string;
  image: string | null;
  price: number;
}

/** Grilla compacta de estilos de traje — el contenido del panel que se despliega al lado del disco.
 *  El título del panel (la etiqueta del paso) ya lo agrega `Stepper`, así que esto es solo la grilla. */
function StyleGallery({ items }: { items: StyleGalleryItem[] }) {
  return (
    <div className={s.styleGrid}>
      {items.map((item) => (
        <figure key={item.id} className={s.styleCard}>
          {item.image ? (
            <img src={item.image} alt="" className={s.styleCardImg} />
          ) : (
            <div className={s.styleCardImg} aria-hidden="true" />
          )}
          <figcaption className={s.styleCardCaption}>
            <span className={s.styleCardName}>{item.name}</span>
            <span className={s.styleCardPrice}>{formatCurrency(item.price)}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function HomePage() {
  const t = useTranslation();
  // Solo los cuatro primeros: la portada invita, no agota el catálogo.
  const { data, isLoading, isError } = useSuits({ pageSize: 4, sort: 'featured' });
  // Para el panel de "Explorar"/"Personalizar": un representante por estilo.
  const { data: styleSuits } = useSuits({ pageSize: 12, sort: 'featured' });

  const styleGalleryItems = useMemo<StyleGalleryItem[]>(() => {
    const seenStyles = new Set<number>();
    const items: StyleGalleryItem[] = [];
    for (const suitModel of styleSuits?.items ?? []) {
      if (seenStyles.has(suitModel.styleId)) continue;
      seenStyles.add(suitModel.styleId);
      items.push({
        id: suitModel.styleId,
        name: suitModel.styleName,
        image: suitModel.primaryImage?.url ?? null,
        price: suitModel.basePrice,
      });
    }
    return items;
  }, [styleSuits]);

  const journey = t.home.journeySteps.map((step, index) => {
    const base = { id: String(index + 1), ...step };
    if (JOURNEY_STEPS_WITH_STYLES.has(index) && styleGalleryItems.length > 0) {
      return { ...base, detail: <StyleGallery items={styleGalleryItems} /> };
    }
    return base;
  });
  const features = t.home.features.map((feature, index) => ({
    ...feature,
    icon: FEATURE_ICONS[index]!,
  }));
  const craft = t.home.craftItems.map((item, index) => ({ ...item, icon: CRAFT_ICONS[index]! }));
  const instagramPosts = INSTAGRAM_IMAGES.map((image, index) => ({
    image,
    alt: t.home.igAlts[index]!,
  }));

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={cx('re-container', s.heroGrid)}>
          <div className={s.heroContent}>
            <p className={s.heroEyebrow}>
              <span className={s.heroTick} aria-hidden="true" />
              {t.home.heroEyebrow}
            </p>

            <h1 className={s.heroTitle}>
              {t.home.heroTitle}
              <span className={s.heroTitleAccent}> {t.home.heroTitleAccent}</span>
            </h1>

            <p className={s.heroText}>{t.home.heroText}</p>

            <div className={s.heroActions}>
              {SHOP_ENABLED ? (
                <ButtonLink
                  to={paths.catalog}
                  variant="primary"
                  size="lg"
                  leftIcon={<Icon name="scissors" size={17} />}
                >
                  Diseñar mi traje
                </ButtonLink>
              ) : null}
              <ButtonLink
                to={SHOP_ENABLED ? paths.bookAppointment : APPOINTMENT_IN_PERSON_URL}
                external={!SHOP_ENABLED}
                variant={SHOP_ENABLED ? 'secondary' : 'primary'}
                size="lg"
                leftIcon={<Icon name="mapPin" size={17} />}
              >
                {t.home.inPersonAppointment}
              </ButtonLink>
              {SHOP_ENABLED ? null : (
                <ButtonLink
                  to={APPOINTMENT_VIRTUAL_URL}
                  external
                  variant="secondary"
                  size="lg"
                  leftIcon={<Icon name="video" size={17} />}
                >
                  {t.home.virtualAppointment}
                </ButtonLink>
              )}
            </div>
          </div>

          <div className={s.heroPhotoWrap}>
            <figure className={s.heroPhoto}>
              <img src="/images/telaazulconocinta.png" alt="" className={s.heroPhotoImg} />
            </figure>
          </div>
        </div>

        <div className="re-container">
          <ul role="list" className={s.featureStrip}>
            {features.map((feature) => (
              <li key={feature.title} className={s.featureItem}>
                <Icon name={feature.icon} size={26} className={s.featureIcon} />
                <div>
                  <p className={s.featureTitle}>{feature.title}</p>
                  <p className={s.featureText}>{feature.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="re-container">
          <dl className={s.heroStats}>
            <div>
              <dt>{t.home.statsYearsLabel}</dt>
              <dd>
                27<span className={s.statTick} aria-hidden="true" />
              </dd>
            </div>
            <div>
              <dt>{t.home.statsSuitsLabel}</dt>
              <dd>
                4,200+<span className={s.statTick} aria-hidden="true" />
              </dd>
            </div>
            <div>
              <dt>{t.home.statsFabricsLabel}</dt>
              <dd>
                60<span className={s.statTick} aria-hidden="true" />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── Destacados ───────────────────────────────────────────────────── */}
      {/* La opción "Diseñar mi traje" se oculta completa en la fase
          informativa: esta sección solo tiene sentido si se puede llegar a
          la ficha/personalizar de cada modelo, así que se oculta con ella. */}
      {SHOP_ENABLED ? (
        <section className={cx('re-container', l.section)}>
          <SectionHeading
            eyebrow="Del taller"
            title="Modelos que definen la casa"
            description="Cinco cortes, una misma manera de trabajar. Cualquiera de ellos se personaliza por completo."
            action={
              <ButtonLink to={paths.catalog} variant="ghost" rightIcon={<Icon name="arrowRight" size={16} />}>
                Ver todo el catálogo
              </ButtonLink>
            }
          />

          <div className={cx(l.gridSuits, l.afterHeading)}>
            {isLoading
              ? Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} />)
              : data?.items.map((suit) => <SuitCard key={suit.id} suit={suit} />)}
          </div>

          {isError ? (
            <EmptyState
              tone="error"
              className={l.afterHeading}
              title="No pudimos cargar el catálogo"
              description="Vuelve a intentarlo en un momento o escríbenos si el problema sigue."
            />
          ) : null}
        </section>
      ) : null}

      {/* ── Cómo funciona ────────────────────────────────────────────────── */}
      <section className={s.journey}>
        <div className="re-container">
          <SectionHeading
            align="center"
            eyebrow={t.home.journeyEyebrow}
            title={t.home.journeyTitle}
            description={t.home.journeyDescription}
          />

          <div className={l.afterHeading}>
            <Stepper steps={journey} current={journey.length} aria-label={t.home.journeyAriaLabel} />
          </div>
        </div>
      </section>

      {/* ── Oficio ───────────────────────────────────────────────────────── */}
      <section className={cx('re-container', l.section)}>
        <SectionHeading eyebrow={t.home.craftEyebrow} title={t.home.craftTitle} />

        <div className={cx(s.craftGrid, l.afterHeading)}>
          {craft.map((item) => (
            <article key={item.title} className={s.craftCard}>
              <span className={s.craftIcon}>
                <Icon name={item.icon} size={22} />
              </span>
              <h3 className={s.craftTitle}>{item.title}</h3>
              <p className={s.craftText}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Instagram ────────────────────────────────────────────────────── */}
      <section className={cx('re-container', l.section)}>
        <SectionHeading
          align="center"
          eyebrow={t.home.igEyebrow}
          title={t.home.igTitle}
          description={t.home.igDescription}
        />

        <div className={cx(s.igGrid, l.afterHeading)}>
          {instagramPosts.map((post) => (
            <div key={post.image} className={s.igItem}>
              <img src={post.image} alt={post.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Llamada final ────────────────────────────────────────────────── */}
      <section className={cx('re-container', l.section)}>
        {SHOP_ENABLED ? (
          <div className={s.cta}>
            <div>
              <h2 className={s.ctaTitle}>¿Ya tienes un pedido en marcha?</h2>
              <p className={s.ctaText}>
                Consulta el avance de tu traje con el número que te dimos al confirmarlo. No hace
                falta iniciar sesión.
              </p>
            </div>
            <ButtonLink to={paths.tracking} variant="primary" size="lg">
              Ver el seguimiento
            </ButtonLink>
          </div>
        ) : (
          <div className={s.cta}>
            <div>
              <h2 className={s.ctaTitle}>{t.home.ctaTitle}</h2>
              <p className={s.ctaText}>{t.home.ctaText}</p>
            </div>
            <ButtonLink
              to={APPOINTMENT_IN_PERSON_URL}
              external
              variant="primary"
              size="lg"
              leftIcon={<Icon name="calendar" size={17} />}
            >
              {t.home.ctaButton}
            </ButtonLink>
          </div>
        )}
      </section>
    </>
  );
}
