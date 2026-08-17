import { Card, EmptyState, Icon, SectionHeading, Skeleton } from '@/components/ui';
import { useLoyaltySettings, useMyLoyalty, useMyLoyaltyMovements } from '@/features/loyalty/hooks';
import { formatCurrency, formatDateTime, formatPoints } from '@/lib/format';
import s from './account.module.css';
import m from './MyLoyaltyPage.module.css';

const MOVEMENT_LABELS = {
  earned: 'Puntos ganados',
  redeemed: 'Puntos canjeados',
  adjustment: 'Ajuste del taller',
} as const;

export default function MyLoyaltyPage() {
  const { data: account, isLoading: loadingAccount } = useMyLoyalty();
  const { data: movements, isLoading: loadingMovements } = useMyLoyaltyMovements();
  const { data: settings } = useLoyaltySettings();

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Fidelización"
        title="Mis puntos"
        description="Ganas puntos con cada compra y los puedes canjear como descuento en tu próximo pedido, desde el carrito."
      />

      <div className={s.stats}>
        <div className={s.stat}>
          <p className={s.statLabel}>Saldo disponible</p>
          <p className={s.statValue}>
            {loadingAccount ? '—' : formatPoints(account?.pointsBalance ?? 0)}
          </p>
          <p className={s.statHint}>Listos para canjear</p>
        </div>
        <div className={s.stat}>
          <p className={s.statLabel}>Acumulados en total</p>
          <p className={s.statValue}>
            {loadingAccount ? '—' : formatPoints(account?.pointsLifetime ?? 0)}
          </p>
          <p className={s.statHint}>Desde tu primera compra</p>
        </div>
        <div className={s.stat}>
          <p className={s.statLabel}>Valor de tu saldo</p>
          <p className={s.statValue}>
            {settings && account
              ? formatCurrency(account.pointsBalance * settings.redemptionValueQuetzalPerPoint)
              : '—'}
          </p>
          <p className={s.statHint}>
            {settings ? `1 punto = ${formatCurrency(settings.redemptionValueQuetzalPerPoint)}` : ''}
          </p>
        </div>
      </div>

      <div className={m.explainer}>
        <Icon name="sparkle" size={16} />
        <p>
          {settings
            ? `Ganas 1 punto por cada ${formatCurrency(settings.earnRateQuetzalPerPoint)} de tu pedido (después de descuentos).`
            : 'Ganas puntos con cada pedido.'}{' '}
          Los usas como descuento la próxima vez que compres, marcando la casilla en el carrito.
        </p>
      </div>

      <Card variant="raised">
        <Card.Header title="Historial" />
        <Card.Body>
          {loadingMovements ? (
            <Skeleton height="160px" radius="var(--radius-md)" />
          ) : movements && movements.length > 0 ? (
            <ul role="list" className={m.movements}>
              {movements.map((movement) => {
                const isPositive = movement.points >= 0;
                return (
                  <li key={movement.id} className={m.movement}>
                    <span className={isPositive ? m.iconEarn : m.iconRedeem}>
                      <Icon name={isPositive ? 'sparkle' : 'tag'} size={15} />
                    </span>
                    <div className={m.movementBody}>
                      <p className={m.movementTitle}>
                        {movement.orderNumber
                          ? `${MOVEMENT_LABELS[movement.type]} · Pedido ${movement.orderNumber}`
                          : (movement.note ?? MOVEMENT_LABELS[movement.type])}
                      </p>
                      <p className={m.movementDate}>{formatDateTime(movement.createdAt)}</p>
                    </div>
                    <span className={isPositive ? m.pointsPositive : m.pointsNegative}>
                      {isPositive ? '+' : ''}
                      {formatPoints(movement.points)}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              size="sm"
              icon="sparkle"
              title="Todavía no tienes movimientos"
              description="En cuanto completes tu primera compra, aquí verás los puntos que ganaste."
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
