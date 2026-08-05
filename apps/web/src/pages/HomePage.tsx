import { Link } from 'react-router-dom';
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
        <div className={cx('re-container', s.heroInner)}>
          <p className={s.heroEyebrow}>
            <span className={s.heroTick} aria-hidden="true" />
            Sastrería artesanal · Guatemala
          </p>

          <h1 className={s.heroTitle}>
            Un traje que no se parece a ningún otro
            <span className={s.heroTitleAccent}> porque no lo es.</span>
          </h1>

          <p className={s.heroText}>
            Elige el modelo, la tela y cada detalle. Nosotros lo cortamos a mano sobre tus medidas y
            tú sigues en línea cómo avanza, puntada a puntada.
          </p>

          <div className={s.heroActions}>
            <ButtonLink to={paths.catalog} variant="primary" size="lg">
              Diseñar mi traje
            </ButtonLink>
            <ButtonLink
              to={paths.bookAppointment}
              variant="secondary"
              size="lg"
              leftIcon={<Icon name="calendar" size={17} />}
            >
              Agendar una cita
            </ButtonLink>
          </div>

          <dl className={s.heroStats}>
            <div>
              <dt>Años cosiendo</dt>
              <dd>27</dd>
            </div>
            <div>
              <dt>Trajes entregados</dt>
              <dd>4 200+</dd>
            </div>
            <div>
              <dt>Telas en muestrario</dt>
              <dd>60</dd>
            </div>
          </dl>
        </div>

        <div className={s.heroDecor} aria-hidden="true" />
      </section>

      {/* ── Destacados ───────────────────────────────────────────────────── */}
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

      {/* ── Llamada final ────────────────────────────────────────────────── */}
      <section className={cx('re-container', l.section)}>
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

        <p className={s.demoNote}>
          <Icon name="info" size={15} />
          Versión de diseño con datos de demostración.{' '}
          <Link to={paths.login}>Entra con las cuentas de prueba</Link> para ver el área de cliente y
          el back-office.
        </p>
      </section>
    </>
  );
}
