import { Checkbox, Icon } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import { maxRedeemablePoints, pointsToCurrency } from '@/features/cart/pricing';
import { useLoyaltySettings, useMyLoyalty } from './hooks';
import { formatCurrency, formatPoints } from '@/lib/format';
import s from './PointsRedeemBox.module.css';

/**
 * Canje de puntos en el carrito.
 *
 * Es todo-o-nada a propósito (un checkbox, no un contador): «usa mis puntos
 * disponibles» es la decisión real que toma la mayoría; quien quiera dejar
 * puntos de sobra para otra compra puede no marcarlo. Si no hay sesión, no
 * hay saldo que canjear y el componente no pinta nada.
 */
export function PointsRedeemBox() {
  const { cart, totals, redeemPoints } = useCart();
  const { data: settings } = useLoyaltySettings();
  const { data: account } = useMyLoyalty();

  if (!settings || !account || !settings.isActive || account.pointsBalance <= 0) return null;

  const amountAvailableForPoints = Math.max(0, totals.subtotal - totals.couponDiscount);
  const cap = maxRedeemablePoints(amountAvailableForPoints, account.pointsBalance, settings);
  if (cap <= 0) return null;

  const isUsingPoints = cart.redeemedPoints > 0;

  return (
    <div className={s.box}>
      <Checkbox
        label={
          <>
            Usar {formatPoints(cap)} disponibles
            <span className={s.saving}>−{formatCurrency(pointsToCurrency(cap, settings))}</span>
          </>
        }
        checked={isUsingPoints}
        onChange={(event) => redeemPoints(event.target.checked ? cap : 0)}
      />
      <p className={s.hint}>
        <Icon name="sparkle" size={13} />
        Tienes {formatPoints(account.pointsBalance)} en total · 1 punto ={' '}
        {formatCurrency(settings.redemptionValueQuetzalPerPoint)}
      </p>
    </div>
  );
}
