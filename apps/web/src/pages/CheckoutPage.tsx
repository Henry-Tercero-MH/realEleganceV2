import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonLink,
  Card,
  Checkbox,
  EmptyState,
  Icon,
  Input,
  Price,
  Rule,
  SectionHeading,
  Select,
  Textarea,
} from '@/components/ui';
import { checkoutSchema, PAYMENT_METHOD_OPTIONS } from '@/features/checkout/schema';
import type { CheckoutFormValues } from '@/features/checkout/schema';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api, ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatPoints } from '@/lib/format';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { cart, totals, clear } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'card' },
    // Se valida al salir del campo: no regañamos mientras se escribe.
    mode: 'onBlur',
  });

  // Si hay sesión, rellenamos lo que ya sabemos de la persona.
  useEffect(() => {
    if (!user) return;
    if (user.firstName) setValue('firstName', user.firstName);
    if (user.lastName) setValue('lastName', user.lastName);
    setValue('email', user.email);
  }, [user, setValue]);

  async function onSubmit(values: CheckoutFormValues) {
    try {
      // Equivale a `POST /api/v1/checkout` → `sp_checkout`. Los puntos van con
      // `taxableBase` (para ganar) y `redeemedPoints` (para canjear): el
      // servidor los recalcula con su propia tasa, nunca confía en la del cliente.
      const result = await api.cart.checkout({
        items: cart.lines.map((line) => ({
          itemType: line.itemType,
          suitModelId: line.suitModelId,
          fabricId: line.fabricId,
          productId: line.productId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          selectedOptions: line.selectedOptions,
        })),
        subtotal: totals.subtotal,
        discountAmount: totals.couponDiscount,
        taxableBase: totals.taxableBase,
        tax: totals.tax,
        total: totals.total,
        dueNow: totals.dueNow,
        requiresAppointment: totals.requiresAppointment,
        customerId: user?.customerId ?? null,
        pointsToRedeem: cart.redeemedPoints,
        couponCode: cart.coupon?.code ?? null,
        contact: values,
      });

      clear();
      toast.success('Pedido confirmado', `Tu número de pedido es ${result.orderNumber}.`);
      navigate(paths.checkoutSuccess(result.orderNumber), {
        state: {
          dueNow: result.dueNow,
          requiresAppointment: result.requiresAppointment,
          pointsEarned: result.pointsEarned,
        },
        replace: true,
      });
    } catch (error) {
      toast.error(
        'No pudimos confirmar el pedido',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo en unos segundos.',
      );
    }
  }

  if (cart.lines.length === 0) {
    return (
      <div className={cx('re-container', l.sectionFirst)}>
        <EmptyState
          icon="cart"
          title="No hay nada que pagar"
          description="Tu carrito está vacío. Elige un traje o un accesorio para continuar."
          action={
            <ButtonLink to={paths.catalog} variant="primary">
              Ver el catálogo
            </ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <div className={cx('re-container', l.sectionFirst)}>
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow="Paso 5 de 8 · Pago"
        title="Confirma tu pedido"
        description="Solo cobramos el anticipo de los trajes a medida; el saldo se paga en la entrega."
      />

      <form onSubmit={handleSubmit(onSubmit)} className={cx(l.withSummary, l.afterHeading, s.body)} noValidate>
        <div className={s.fields}>
          {/* ── Datos de contacto ────────────────────────────────────── */}
          <fieldset className={s.fieldset}>
            <legend className={s.legend}>Tus datos</legend>
            <div className={s.grid2}>
              <Input
                label="Nombre"
                required
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Apellidos"
                required
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
              <Input
                label="Correo electrónico"
                type="email"
                required
                autoComplete="email"
                hint="Aquí te enviaremos el número de pedido y los avisos de prueba."
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Teléfono"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+502 5555 1234"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
          </fieldset>

          {/* ── Entrega ──────────────────────────────────────────────── */}
          <fieldset className={s.fieldset}>
            <legend className={s.legend}>Dirección de entrega</legend>
            <div className={s.grid2}>
              <Input
                label="Dirección"
                required
                autoComplete="address-line1"
                fieldClassName={s.span2}
                error={errors.addressLine1?.message}
                {...register('addressLine1')}
              />
              <Input
                label="Ciudad"
                required
                autoComplete="address-level2"
                error={errors.city?.message}
                {...register('city')}
              />
              <Input
                label="Departamento"
                autoComplete="address-level1"
                error={errors.state?.message}
                {...register('state')}
              />
              <Input
                label="Código postal"
                autoComplete="postal-code"
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
            </div>
          </fieldset>

          {/* ── Pago ─────────────────────────────────────────────────── */}
          <fieldset className={s.fieldset}>
            <legend className={s.legend}>Forma de pago</legend>
            <Select
              label="Método"
              required
              options={PAYMENT_METHOD_OPTIONS}
              error={errors.paymentMethod?.message}
              {...register('paymentMethod')}
            />

            <Textarea
              label="Nota para el taller"
              placeholder="Por ejemplo: lo necesito antes del 20 de septiembre."
              hint="Opcional. Lo leerá quien corte tu traje."
              error={errors.note?.message}
              {...register('note')}
            />

            <Checkbox
              label="Acepto las condiciones de encargo y la política de ajustes."
              error={errors.acceptsTerms?.message}
              {...register('acceptsTerms')}
            />
          </fieldset>
        </div>

        {/* ── Resumen ──────────────────────────────────────────────────── */}
        <aside className={l.summaryColumn}>
          <Card variant="raised">
            <Card.Header title="Tu pedido" subtitle={`${totals.itemCount} artículos`} />

            <Card.Body>
              <ul role="list" className={s.recap}>
                {cart.lines.map((line) => (
                  <li key={line.lineId}>
                    <span className={s.recapQty}>{line.quantity}×</span>
                    <span className={s.recapName}>{line.displayName}</span>
                    <span className={s.recapPrice}>
                      {formatCurrency(line.unitPrice * line.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <Rule variant="stitch" className={s.rule} />

              <dl className={s.totals}>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatCurrency(totals.subtotal)}</dd>
                </div>
                {totals.couponDiscount > 0 ? (
                  <div className={s.discount}>
                    <dt>Descuento del cupón</dt>
                    <dd>−{formatCurrency(totals.couponDiscount)}</dd>
                  </div>
                ) : null}
                {totals.pointsDiscount > 0 ? (
                  <div className={s.discount}>
                    <dt>Descuento por puntos</dt>
                    <dd>−{formatCurrency(totals.pointsDiscount)}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>IVA</dt>
                  <dd>{formatCurrency(totals.tax)}</dd>
                </div>
                <div className={s.grandTotal}>
                  <dt>Total</dt>
                  <dd>{formatCurrency(totals.total)}</dd>
                </div>
              </dl>

              <div className={s.dueNow}>
                <span>A pagar ahora</span>
                <Price amount={totals.dueNow} size="lg" />
              </div>

              {totals.balanceLater > 0 ? (
                <p className={s.balance}>
                  Quedan {formatCurrency(totals.balanceLater)} para la entrega.
                </p>
              ) : null}

              {totals.estimatedPointsEarned > 0 ? (
                <p className={s.balance}>
                  Este pedido te dejará {formatPoints(totals.estimatedPointsEarned)}.
                </p>
              ) : null}
            </Card.Body>

            <Card.Footer className={s.footer}>
              <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>
                Confirmar y pagar
              </Button>
              {totals.requiresAppointment ? (
                <p className={s.note}>
                  <Icon name="calendar" size={14} />
                  Al confirmar te llevaremos a agendar la cita de medidas.
                </p>
              ) : null}
            </Card.Footer>
          </Card>
        </aside>
      </form>
    </div>
  );
}
