import { useLocation, useParams } from 'react-router-dom';
import { ButtonLink, Card, Icon, Stepper } from '@/components/ui';
import { paths } from '@/routes/paths';
import { formatCurrency } from '@/lib/format';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CheckoutSuccessPage.module.css';

interface SuccessState {
  dueNow?: number;
  requiresAppointment?: boolean;
}

const NEXT_STEPS = [
  { id: 'pago', label: 'Anticipo recibido', description: 'Ya tenemos tu pedido' },
  { id: 'cita', label: 'Toma de medidas', description: 'Agenda tu cita en el taller' },
  { id: 'taller', label: 'Confección', description: 'Corte, costura y pruebas' },
  { id: 'entrega', label: 'Entrega', description: 'Pagas el saldo y te lo llevas' },
];

export default function CheckoutSuccessPage() {
  const { orderNumber = '' } = useParams<{ orderNumber: string }>();
  const state = (useLocation().state ?? {}) as SuccessState;

  return (
    <div className={cx('re-container', 're-container--narrow', l.section)}>
      <div className={s.hero}>
        <span className={s.mark}>
          <Icon name="check" size={30} />
        </span>
        <h1 className={s.title}>Tu pedido está confirmado</h1>
        <p className={s.text}>
          Gracias por confiarnos tu traje. Te hemos enviado un correo con el resumen y este número,
          que también sirve para consultar el avance sin iniciar sesión.
        </p>

        <p className={s.orderNumber}>
          <span>Número de pedido</span>
          <strong>{orderNumber}</strong>
        </p>

        {typeof state.dueNow === 'number' ? (
          <p className={s.paid}>Cobrado hoy: {formatCurrency(state.dueNow)}</p>
        ) : null}
      </div>

      <Card variant="raised" className={s.next}>
        <Card.Header title="Qué pasa ahora" />
        <Card.Body>
          <Stepper
            steps={NEXT_STEPS}
            current={1}
            orientation="vertical"
            aria-label="Siguientes pasos de tu pedido"
          />
        </Card.Body>
      </Card>

      <div className={s.actions}>
        {state.requiresAppointment !== false ? (
          <ButtonLink
            to={paths.bookAppointment}
            variant="primary"
            size="lg"
            leftIcon={<Icon name="calendar" size={17} />}
          >
            Agendar la toma de medidas
          </ButtonLink>
        ) : null}
        <ButtonLink to={paths.trackingFor(orderNumber)} variant="secondary" size="lg">
          Ver el seguimiento
        </ButtonLink>
      </div>
    </div>
  );
}
