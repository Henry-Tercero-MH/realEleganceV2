import { Badge, Icon, IconButton, Price, QuantityStepper } from '@/components/ui';
import { CART_ITEM_TYPE_LABELS } from '@real-elegance/shared';
import { lineTotal } from './pricing';
import type { CartLine } from './types';
import { cx } from '@/lib/cx';
import s from './CartLineRow.module.css';

export interface CartLineRowProps {
  line: CartLine;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  /** `compact` es la del drawer; `full` muestra el desglose de opciones. */
  variant?: 'compact' | 'full';
}

/**
 * Una línea del carrito. La comparten el panel lateral y la página `/carrito`
 * para que el traje se vea igual en los dos sitios.
 */
export function CartLineRow({
  line,
  onQuantityChange,
  onRemove,
  variant = 'compact',
}: CartLineRowProps) {
  const isMadeToMeasure = line.itemType === 'made_to_measure';

  return (
    <article className={cx(s.row, s[variant])}>
      <div className={s.thumb}>
        {line.imageUrl ? (
          <img src={line.imageUrl} alt="" loading="lazy" />
        ) : (
          <Icon name="hanger" size={22} />
        )}
      </div>

      <div className={s.body}>
        <div className={s.headline}>
          <h3 className={s.name}>{line.displayName}</h3>
          <Badge tone={isMadeToMeasure ? 'gold' : 'neutral'} size="sm">
            {CART_ITEM_TYPE_LABELS[line.itemType]}
          </Badge>
        </div>

        {line.displaySubtitle ? <p className={s.subtitle}>{line.displaySubtitle}</p> : null}

        {/* El desglose de la personalización solo cabe en la página completa. */}
        {variant === 'full' && line.selectedOptions.length > 0 ? (
          <dl className={s.options}>
            {line.selectedOptions.map((option) => (
              <div key={option.id} className={s.option}>
                <dt>{option.groupName}</dt>
                <dd>
                  {option.name}
                  {option.priceDelta !== 0 ? (
                    <span className={s.delta}>
                      {option.priceDelta > 0 ? '+' : '−'}Q{Math.abs(option.priceDelta)}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className={s.controls}>
          <QuantityStepper
            value={line.quantity}
            onChange={(quantity) => onQuantityChange(line.lineId, quantity)}
            max={line.maxQuantity}
            size={variant === 'compact' ? 'sm' : 'md'}
            label={line.displayName}
          />
          <Price amount={lineTotal(line)} size={variant === 'compact' ? 'sm' : 'md'} />
        </div>
      </div>

      <IconButton
        label={`Quitar ${line.displayName} del carrito`}
        icon={<Icon name="trash" size={16} />}
        variant="danger"
        size="sm"
        onClick={() => onRemove(line.lineId)}
        className={s.remove}
      />
    </article>
  );
}
