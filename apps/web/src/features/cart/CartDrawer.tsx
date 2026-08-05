import { useNavigate } from 'react-router-dom';
import { Button, ButtonLink, Drawer, EmptyState, Price, Rule } from '@/components/ui';
import { CartLineRow } from './CartLineRow';
import { useCart } from '@/context/CartContext';
import { paths } from '@/routes/paths';
import { formatCurrency } from '@/lib/format';
import s from './CartDrawer.module.css';

interface SummaryProps {
  subtotal: number;
  discount: number;
  dueNow: number;
  requiresAppointment: boolean;
  onCheckout: () => void;
  onViewCart: () => void;
}

/** Pie fijo del panel: totales y las dos salidas posibles. */
function DrawerSummary({
  subtotal,
  discount,
  dueNow,
  requiresAppointment,
  onCheckout,
  onViewCart,
}: SummaryProps) {
  return (
    <div className={s.summary}>
      <dl className={s.totals}>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        {discount > 0 ? (
          <div className={s.discount}>
            <dt>Descuento</dt>
            <dd>−{formatCurrency(discount)}</dd>
          </div>
        ) : null}
        <Rule variant="stitch" className={s.rule} />
        <div className={s.dueNow}>
          <dt>A pagar ahora</dt>
          <dd>
            <Price amount={dueNow} size="md" />
          </dd>
        </div>
      </dl>

      {requiresAppointment ? (
        <p className={s.note}>
          Los trajes a medida se confirman con el 50 % de anticipo y una cita para tomarte las
          medidas. El saldo se paga en la entrega.
        </p>
      ) : null}

      <div className={s.actions}>
        <Button variant="primary" fullWidth onClick={onCheckout}>
          Ir al pago
        </Button>
        <ButtonLink to={paths.cart} variant="ghost" fullWidth onClick={onViewCart}>
          Ver el carrito completo
        </ButtonLink>
      </div>
    </div>
  );
}

/**
 * Panel lateral del carrito.
 *
 * Vive montado en `AppLayout` y se abre desde la cabecera o al añadir un
 * artículo: la persona ve lo que acaba de meter sin perder la página en la que
 * estaba.
 */
export function CartDrawer() {
  const { cart, totals, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const isEmpty = cart.lines.length === 0;

  function goToCheckout() {
    closeDrawer();
    navigate(paths.checkout);
  }

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={closeDrawer}
      title="Tu carrito"
      footer={
        isEmpty ? null : (
          <DrawerSummary
            subtotal={totals.subtotal}
            discount={totals.discount}
            dueNow={totals.dueNow}
            requiresAppointment={totals.requiresAppointment}
            onCheckout={goToCheckout}
            onViewCart={closeDrawer}
          />
        )
      }
    >
      {isEmpty ? (
        <EmptyState
          icon="hanger"
          size="sm"
          title="El carrito está vacío"
          description="Todavía no has elegido nada. Empieza por el catálogo y personaliza tu primer traje."
          action={
            <ButtonLink to={paths.catalog} variant="primary" onClick={closeDrawer}>
              Ver el catálogo
            </ButtonLink>
          }
        />
      ) : (
        <div className={s.lines}>
          {cart.lines.map((line) => (
            <CartLineRow
              key={line.lineId}
              line={line}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
      )}
    </Drawer>
  );
}
