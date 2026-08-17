import { useLocation, useParams } from 'react-router-dom';
import { Button, ButtonLink, Card, Icon, Stepper } from '@/components/ui';
import { useOrder, useResendConfirmation } from '@/features/orders/hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatPoints } from '@/lib/format';
import { downloadReceipt } from '@/lib/receipt';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CheckoutSuccessPage.module.css';

interface SuccessState {
  dueNow?: number;
  requiresAppointment?: boolean;
  pointsEarned?: number;
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
  const { data: order } = useOrder(orderNumber);
  const resendConfirmation = useResendConfirmation();
  const toast = useToast();

  async function handleResend() {
    try {
      const { sentTo } = await resendConfirmation.mutateAsync(orderNumber);
      toast.success('Confirmación reenviada', `La enviamos a ${sentTo}.`);
    } catch (error) {
      toast.error(
        'No se pudo reenviar',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

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

        {typeof state.pointsEarned === 'number' && state.pointsEarned > 0 ? (
          <p className={s.points}>
            <Icon name="sparkle" size={15} />
            Ganaste {formatPoints(state.pointsEarned)} de fidelización.
          </p>
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
        {order ? (
          <Button
            variant="ghost"
            size="lg"
            leftIcon={<Icon name="download" size={16} />}
            onClick={() => downloadReceipt(order)}
          >
            Descargar comprobante
          </Button>
        ) : null}
        <Button variant="ghost" size="lg" isLoading={resendConfirmation.isPending} onClick={handleResend}>
          Reenviar confirmación
        </Button>
      </div>
    </div>
  );
}
