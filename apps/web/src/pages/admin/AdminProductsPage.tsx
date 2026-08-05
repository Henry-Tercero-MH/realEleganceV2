import { Badge, Button, Icon, SectionHeading, Skeleton, Table } from '@/components/ui';
import type { Column } from '@/components/ui';
import type { Product } from '@real-elegance/shared';
import { useAdminProducts } from '@/features/admin/hooks';
import { formatCurrency } from '@/lib/format';
import s from './admin.module.css';

const COLUMNS: Array<Column<Product>> = [
  {
    id: 'product',
    header: 'Producto',
    cell: (row) => (
      <div className={s.cellMain}>
        <span className={`${s.cellThumb} ${s.cellThumbSquare}`}>
          {row.primaryImage ? <img src={row.primaryImage.url} alt="" loading="lazy" /> : null}
        </span>
        <div>
          <span className={s.cellName}>{row.name}</span>
          <span className={s.cellSub}>{row.categoryName}</span>
        </div>
      </div>
    ),
  },
  { id: 'sku', header: 'SKU', cell: (row) => <span className={s.mono}>{row.sku}</span> },
  { id: 'price', header: 'Precio', align: 'right', cell: (row) => formatCurrency(row.price) },
  {
    id: 'stock',
    header: 'Existencias',
    align: 'right',
    cell: (row) => (
      <Badge tone={row.stock === 0 ? 'danger' : row.stock <= 10 ? 'warning' : 'neutral'} size="sm">
        {row.stock}
      </Badge>
    ),
  },
];

export default function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts();

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Catálogo"
        title="Accesorios"
        description="Corbatas, pañuelos, camisas y complementos listos para llevar."
        action={
          <Button variant="primary" leftIcon={<Icon name="plus" size={16} />} disabled>
            Nuevo accesorio
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton height="320px" radius="var(--radius-md)" />
      ) : (
        <Table
          columns={COLUMNS}
          rows={products ?? []}
          rowKey={(row) => row.id}
          caption="Accesorios listos para llevar"
        />
      )}
    </div>
  );
}
