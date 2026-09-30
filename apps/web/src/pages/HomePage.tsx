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
import { SHOP_ENABLED, getWhatsAppUrl } from '@/config/features';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './HomePage.module.css';

/** Los ocho pasos del §1 del prompt maestro, tal cual los vive el cliente. */
const JOURNEY = [
  { id: '1', label: 'Explorar', description: 'Elige el modelo que te representa' },
  { id: '2', label: 'Personalizar', description: 'Tela, solapa, forro y botones' },
  { id: '3', label: 'Cotizar', description: 'Precio cerrado, sin sorpresas' },
  { id: '4', label: 'Agendar', description: 'Reservas tu cita en el taller' },
  { id: '5', label: 'Medidas', description: 'Te tomamos medidas y dejas el anticipo' },
  { id: '6', label: 'Confirmado', description: 'Tu pedido entra al taller' },
  { id: '7', label: 'Confección', description: 'Corte, costura y pruebas' },
  { id: '8', label: 'Entrega', description: 'Pagas el saldo y te lo llevas' },
];

const INSTAGRAM_POSTS = [
  { image: '/images/coloresdetraje.png', alt: 'El color: por qué el azul marino es la elección más segura' },
  { image: '/images/entalledeunsaco.png', alt: 'El entalle: los hombros limpios y la silueta que sigue el cuerpo' },
  { image: '/images/telatijerasycinta.png', alt: 'La tela: lana al 100% o mezclas de alta calidad' },
  { image: '/images/tuprimertrajebienconfeccionado.png', alt: 'Tu primer traje bien confeccionado' },
];

/** La franja de beneficios del hero (§ misma referencia visual). */
const FEATURES = [
  { icon: 'hanger' as const, title: 'Hecho a medida', text: 'Ajuste perfecto para ti' },
  { icon: 'needle' as const, title: '100% artesanal', text: 'Hecho a mano, puntada a puntada' },
  { icon: 'star' as const, title: 'Telas premium', text: 'Selección de las mejores telas' },
  { icon: 'checkCircle' as const, title: 'Garantía de calidad', text: 'Satisfacción garantizada' },
];

const CRAFT = [
  {
    icon: 'scissors' as const,
    title: 'Cortado a mano',
    text: 'Cada patrón se traza sobre tus medidas. Nada de tallas estándar retocadas.',
  },
  {
    icon: 'spool' as const,
    title: 'Telas con nombre',
    text: 'Lanas Súper 110 a 130, linos irlandeses y tweeds Donegal. Sabemos de dónde viene cada metro.',
  },
  {
    icon: 'ruler' as const,
    title: 'Pruebas incluidas',
    text: 'Ajustamos hasta que la chaqueta caiga como debe. Sin coste adicional.',
  },
  {
    icon: 'eye' as const,
    title: 'Seguimiento en línea',
    text: 'Mira en qué etapa está tu traje —corte, confección, prueba— desde tu cuenta.',
  },
];

export default function HomePage() {
  // Solo los cuatro primeros: la portada invita, no agota el catálogo.
  const { data, isLoading, isError } = useSuits({ pageSize: 4, sort: 'featured' });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={cx('re-container', s.heroGrid)}>
          <div className={s.heroContent}>
            <p className={s.heroEyebrow}>
              <span className={s.heroTick} aria-hidden="true" />
              Sastrería artesanal · Guatemala
            </p>

            <h1 className={s.heroTitle}>
              Un traje que no se parece a ningún otro
              <span className={s.heroTitleAccent}> porque no lo es.</span>
            </h1>

            <p className={s.heroText}>
              {SHOP_ENABLED
                ? 'Elige el modelo, la tela y cada detalle. Nosotros lo cortamos a mano sobre tus medidas y tú sigues en línea cómo avanza, puntada a puntada.'
                : 'Elegimos juntos el modelo, la tela y cada detalle, y lo cortamos a mano sobre tus medidas. Escríbenos por WhatsApp para empezar.'}
            </p>

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
                to={SHOP_ENABLED ? paths.bookAppointment : getWhatsAppUrl()}
                external={!SHOP_ENABLED}
                variant={SHOP_ENABLED ? 'secondary' : 'primary'}
                size="lg"
                leftIcon={<Icon name="calendar" size={17} />}
              >
                Agendar una cita
              </ButtonLink>
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
            {FEATURES.map((feature) => (
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
              <dt>Años cosiendo</dt>
              <dd>
                27<span className={s.statTick} aria-hidden="true" />
              </dd>
            </div>
            <div>
              <dt>Trajes entregados</dt>
              <dd>
                4,200+<span className={s.statTick} aria-hidden="true" />
              </dd>
            </div>
            <div>
              <dt>Telas en muestrario</dt>
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
            eyebrow="Cómo funciona"
            title="De la idea al armario, en ocho pasos"
            description="Sabes en todo momento dónde está tu traje y qué falta para tenerlo."
          />

          <div className={l.afterHeading}>
            <Stepper
              steps={JOURNEY}
              current={JOURNEY.length}
              aria-label="Proceso de encargo de un traje"
            />
          </div>
        </div>
      </section>

      {/* ── Oficio ───────────────────────────────────────────────────────── */}
      <section className={cx('re-container', l.section)}>
        <SectionHeading
          eyebrow="Por qué a medida"
          title="Lo que cambia cuando algo se hace despacio"
        />

        <div className={cx(s.craftGrid, l.afterHeading)}>
          {CRAFT.map((item) => (
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
          eyebrow="@realelegance"
          title="Síguenos en Instagram"
          description="Consejos de sastrería y un vistazo al taller, publicados cada semana."
        />

        <div className={cx(s.igGrid, l.afterHeading)}>
          {INSTAGRAM_POSTS.map((post) => (
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
              <h2 className={s.ctaTitle}>¿Listo para tu próximo traje?</h2>
              <p className={s.ctaText}>
                Escríbenos por WhatsApp y agenda tu cita en el taller — sin trámites, sin cuenta.
              </p>
            </div>
            <ButtonLink
              to={getWhatsAppUrl()}
              external
              variant="primary"
              size="lg"
              leftIcon={<Icon name="calendar" size={17} />}
            >
              Agendar por WhatsApp
            </ButtonLink>
          </div>
        )}
      </section>
    </>
  );
}
