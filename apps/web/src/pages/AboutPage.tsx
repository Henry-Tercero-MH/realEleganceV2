import { ButtonLink, Card, Icon, SectionHeading } from '@/components/ui';
import { paths } from '@/routes/paths';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './AboutPage.module.css';

const STEPS = [
  {
    icon: 'ruler' as const,
    title: 'Medidas',
    text: 'Veintidós medidas y las observaciones que no caben en un número: un hombro más bajo, la costumbre de llevar el reloj a la derecha.',
  },
  {
    icon: 'scissors' as const,
    title: 'Corte',
    text: 'El patrón se traza y se corta a mano sobre la tela. Es el paso que no admite prisa ni segunda oportunidad.',
  },
  {
    icon: 'needle' as const,
    title: 'Confección',
    text: 'Entretela cosida, hombros montados uno a uno y ojales rematados a mano.',
  },
  {
    icon: 'hanger' as const,
    title: 'Prueba y entrega',
    text: 'Dos pruebas para afinar el ajuste. Y si algo no cae bien seis meses después, se corrige.',
  },
];

export default function AboutPage() {
  return (
    <div className={cx('re-container', l.sectionFirst)}>
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow="Desde 1998"
        title="El taller"
        description="Real Elegance es una sastrería pequeña y deliberadamente lenta. Tres personas, un cuarto lleno de telas y la convicción de que un traje se hace una vez y se lleva veinte años."
      />

      <div className={cx(s.grid, l.afterHeading)}>
        {STEPS.map((step, index) => (
          <Card key={step.title} variant="raised" className={s.card}>
            <Card.Header
              eyebrow={`Etapa ${index + 1}`}
              title={
                <span className={s.cardTitle}>
                  <Icon name={step.icon} size={20} />
                  {step.title}
                </span>
              }
            />
            <Card.Body>{step.text}</Card.Body>
          </Card>
        ))}
      </div>

      <section className={cx(s.visit, l.section)}>
        <div>
          <h2 className={s.visitTitle}>Ven a vernos</h2>
          <p className={s.visitText}>
            Estamos en la zona 10 de la Ciudad de Guatemala, de lunes a sábado de 9:00 a 18:00.
            Puedes pasar sin cita para ver telas, pero para tomar medidas conviene reservar.
          </p>
        </div>
        <ButtonLink to={paths.bookAppointment} variant="primary" size="lg">
          Agendar una visita
        </ButtonLink>
      </section>
    </div>
  );
}
