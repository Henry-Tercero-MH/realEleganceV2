import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Icon,
  Input,
  Price,
  Rule,
  SectionHeading,
} from '@/components/ui';
import { CartLineRow } from '@/features/cart/CartLineRow';
import { DEPOSIT_RATE } from '@/features/cart/pricing';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatPercent } from '@/lib/format';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CartPage.module.css';

export default function CartPage() {
  const { cart, totals, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | undefined>();
  const [isValidating, setValidating] = useState(false);

  async function handleCoupon(event: React.FormEvent) {
    event.preventDefault();
    if (!couponCode.trim()) return;

    setValidating(true);
    setCouponError(undefined);
    try {
      // El cupón lo valida siempre el servidor (`fn_validate_coupon`): el
      // cliente solo pinta el resultado.
      const result = await api.cart.validateCoupon(couponCode, totals.subtotal);

      if (!result.valid) {
        setCouponError(result.reason ?? 'No pudimos aplicar el cupón.');
        return;
      }

      applyCoupon({
        code: couponCode.trim().toUpperCase(),
        type: 'percent',
        value: 0,
        discount: result.discount,
      });
      setCouponCode('');
      toast.success('Cupón aplicado', `Ahorras ${formatCurrency(result.discount)}.`);
    } finally {
      setValidating(false);
    }
  }

  if (cart.lines.length === 0) {
    return (
      <div className={cx('re-container', l.sectionFirst)}>
        <SectionHeading as="h1" size="lg" eyebrow="Carrito" title="Tu carrito" />
        <div className={l.afterHeading}>
          <EmptyState
            icon="cart"
            title="No hay pedidos aún. Diseña tu primer traje."
            description="Elige un modelo del catálogo, escoge la tela y los acabados, y lo verás aquí antes de confirmar."
            action={
              <ButtonLink to={paths.catalog} variant="primary" size="lg">
                Ver el catálogo
              </ButtonLink>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cx('re-container', l.sectionFirst)}>
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow="Paso 3 de 8 · Carrito"
        title="Revisa tu pedido"
        description="Comprueba los detalles antes de pasar al pago. Todavía puedes cambiar cantidades o quitar algo."
      />

      <div className={cx(l.withSummary, l.afterHeading, s.body)}>
        {/* ── Líneas ───────────────────────────────────────────────────── */}
        <section aria-label="Artículos del carrito">
          {cart.lines.map((line) => (
            <CartLineRow
              key={line.lineId}
              line={line}
              variant="full"
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
            />
          ))}

          <ButtonLink
            to={paths.catalog}
            variant="ghost"
            className={s.keepShopping}
            leftIcon={<Icon name="arrowLeft" size={16} />}
          >
            Seguir mirando
          </ButtonLink>
        </section>

        {/* ── Resumen ──────────────────────────────────────────────────── */}
        <aside className={l.summaryColumn}>
          <Card variant="raised">
            <Card.Header title="Resumen" />

            <Card.Body>
              {/* Cupón */}
              {cart.coupon ? (
                <div className={s.couponApplied}>
                  <span>
                    <Icon name="tag" size={15} /> {cart.coupon.code}
                  </span>
                  <button type="button" onClick={removeCoupon} className={s.couponRemove}>
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCoupon} className={s.couponForm}>
                  <Input
                    label="¿Tienes un cupón?"
                    placeholder="PRIMERTRAJE"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    error={couponError}
                    fieldClassName={s.couponInput}
                    autoComplete="off"
                  />
                  <Button type="submit" isLoading={isValidating} className={s.couponButton}>
                    Aplicar
                  </Button>
                </form>
              )}

              <Rule variant="stitch" className={s.rule} />

              <dl className={s.totals}>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatCurrency(totals.subtotal)}</dd>
                </div>
                {totals.discount > 0 ? (
                  <div className={s.discount}>
                    <dt>Descuento</dt>
                    <dd>−{formatCurrency(totals.discount)}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>IVA (12 %)</dt>
                  <dd>{formatCurrency(totals.tax)}</dd>
                </div>
                <div className={s.grandTotal}>
                  <dt>Total del pedido</dt>
                  <dd>
                    <Price amount={totals.total} size="md" />
                  </dd>
                </div>
              </dl>

              {totals.requiresAppointment ? (
                <div className={s.split}>
                  <p className={s.splitTitle}>Cómo se paga</p>
                  <dl className={s.totals}>
                    <div>
                      <dt>Ahora ({formatPercent(DEPOSIT_RATE)} del traje + accesorios)</dt>
                      <dd>{formatCurrency(totals.dueNow)}</dd>
                    </div>
                    <div>
                      <dt>En la entrega</dt>
                      <dd>{formatCurrency(totals.balanceLater)}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}
            </Card.Body>

            <Card.Footer className={s.footer}>
              <Button variant="primary" fullWidth size="lg" onClick={() => navigate(paths.checkout)}>
                Ir al pago
              </Button>
              <p className={s.secure}>
                <Icon name="checkCircle" size={14} />
                Precios y existencias se revalidan al confirmar.
              </p>
            </Card.Footer>
          </Card>
        </aside>
      </div>
    </div>
  );
}
