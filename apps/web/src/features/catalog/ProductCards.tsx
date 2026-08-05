import { Link } from 'react-router-dom';
import type { Fabric, Product, SuitModel } from '@real-elegance/shared';
import { Badge, Card, Icon, Price } from '@/components/ui';
import { paths } from '@/routes/paths';
import { formatCurrency, truncate } from '@/lib/format';
import s from './ProductCards.module.css';

/** `srcset` a partir de las variantes que devuelve el backend. */
function srcSet(variants: Array<{ url: string; width: number | null }>): string | undefined {
  const usable = variants.filter((variant) => variant.width);
  if (usable.length === 0) return undefined;
  return usable.map((variant) => `${variant.url} ${variant.width}w`).join(', ');
}

export interface SuitCardProps {
  suit: SuitModel;
}

/** Tarjeta de un modelo de traje, para las rejillas de la tienda. */
export function SuitCard({ suit }: SuitCardProps) {
  const image = suit.primaryImage;

  return (
    <Card interactive className={s.card}>
      <Card.Media ratio="3/4">
        {image ? (
          <img
            src={image.url}
            srcSet={srcSet(image.variants)}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
            alt={image.altText ?? suit.name}
            loading="lazy"
          />
        ) : (
          <div className={s.noImage}>
            <Icon name="hanger" size={28} />
          </div>
        )}
        <span className={s.code}>{suit.code}</span>
      </Card.Media>

      <Card.Header
        eyebrow={suit.styleName}
        title={
          // El enlace envuelve solo el título, pero su ::after cubre la tarjeta
          // entera: un único destino para el lector de pantalla, área grande
          // para el ratón.
          <Link to={paths.suit(suit.code)} className={s.link}>
            {suit.name}
          </Link>
        }
      />

      <Card.Body>{suit.description ? truncate(suit.description, 110) : null}</Card.Body>

      <Card.Footer className={s.footer}>
        <Price amount={suit.basePrice} prefix="Desde" size="sm" />
        <span className={s.cta}>
          Personalizar <Icon name="arrowRight" size={15} />
        </span>
      </Card.Footer>
    </Card>
  );
}

export interface ProductCardProps {
  product: Product;
  onAdd?: (product: Product) => void;
}

/** Tarjeta de un accesorio listo para llevar. */
export function ProductCard({ product, onAdd }: ProductCardProps) {
  const image = product.primaryImage;
  const outOfStock = product.stock <= 0;

  return (
    <Card interactive={!outOfStock} className={s.card}>
      <Card.Media ratio="1/1">
        {image ? (
          <img
            src={image.url}
            srcSet={srcSet(image.variants)}
            sizes="(max-width: 640px) 45vw, 260px"
            alt={image.altText ?? product.name}
            loading="lazy"
          />
        ) : (
          <div className={s.noImage}>
            <Icon name="tag" size={26} />
          </div>
        )}
        {outOfStock ? (
          <span className={s.stockFlag}>
            <Badge tone="danger" size="sm">
              Agotado
            </Badge>
          </span>
        ) : product.stock <= 10 ? (
          <span className={s.stockFlag}>
            <Badge tone="warning" size="sm">
              Últimas {product.stock}
            </Badge>
          </span>
        ) : null}
      </Card.Media>

      <Card.Header eyebrow={product.categoryName} title={product.name} subtitle={product.sku} />

      <Card.Footer className={s.footer}>
        <Price amount={product.price} size="sm" />
        {onAdd ? (
          <button
            type="button"
            className={s.addButton}
            onClick={() => onAdd(product)}
            disabled={outOfStock}
            aria-label={`Añadir ${product.name} al carrito`}
          >
            <Icon name="plus" size={15} />
            Añadir
          </button>
        ) : null}
      </Card.Footer>
    </Card>
  );
}

export interface FabricCardProps {
  fabric: Fabric;
  /** Acción opcional al pulsar (elegir la tela para un traje). */
  onSelect?: (fabric: Fabric) => void;
}

/** Muestra del muestrario de telas. */
export function FabricCard({ fabric, onSelect }: FabricCardProps) {
  const image = fabric.primaryImage;
  const lowStock = fabric.stockMeters < 15;

  const content = (
    <>
      <span
        className={s.swatch}
        style={{ backgroundColor: fabric.colorHex ?? undefined }}
        aria-hidden="true"
      >
        {image ? <img src={image.url} alt="" loading="lazy" /> : null}
      </span>

      <span className={s.fabricBody}>
        <span className={s.fabricEyebrow}>{fabric.categoryName}</span>
        <span className={s.fabricName}>{fabric.name}</span>
        <span className={s.fabricComposition}>{fabric.composition}</span>
        <span className={s.fabricMeta}>
          <span className={s.fabricPrice}>{formatCurrency(fabric.pricePerMeter)} / metro</span>
          {lowStock ? (
            <Badge tone="warning" size="sm">
              {fabric.stockMeters} m
            </Badge>
          ) : null}
        </span>
      </span>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" className={s.fabricCard} onClick={() => onSelect(fabric)}>
        {content}
      </button>
    );
  }

  return <div className={s.fabricCard}>{content}</div>;
}
