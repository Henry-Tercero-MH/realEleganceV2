import { Badge, Button, Icon, SectionHeading, Skeleton, Table } from '@/components/ui';
import type { Column } from '@/components/ui';
import type { SuitModel } from '@real-elegance/shared';
import { useAdminSuits } from '@/features/admin/hooks';
import { formatCurrency } from '@/lib/format';
import s from './admin.module.css';

const COLUMNS: Array<Column<SuitModel>> = [
  {
    id: 'model',
    header: 'Modelo',
    cell: (row) => (
      <div className={s.cellMain}>
        <span className={s.cellThumb}>
          {row.primaryImage ? <img src={row.primaryImage.url} alt="" loading="lazy" /> : null}
        </span>
        <div>
          <span className={s.cellName}>{row.name}</span>
          <span className={s.cellSub}>{row.styleName}</span>
        </div>
      </div>
    ),
  },
  { id: 'code', header: 'Código', cell: (row) => <span className={s.mono}>{row.code}</span> },
  {
    id: 'images',
    header: 'Galería',
    align: 'right',
    hideOnMobile: true,
    cell: (row) => `${row.images.length} foto${row.images.length === 1 ? '' : 's'}`,
  },
  {
    id: 'price',
    header: 'Precio base',
    align: 'right',
    cell: (row) => formatCurrency(row.basePrice),
  },
  {
    id: 'status',
    header: 'Estado',
    align: 'right',
    cell: (row) => (
      <Badge tone={row.isActive ? 'success' : 'neutral'} size="sm">
        {row.isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
];

export default function AdminSuitsPage() {
  const { data: suits, isLoading } = useAdminSuits();

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Catálogo"
        title="Trajes"
        description="Modelos, galería de fotos y precio base."
        action={
          <Button variant="primary" leftIcon={<Icon name="plus" size={16} />} disabled>
            Nuevo modelo
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton height="320px" radius="var(--radius-md)" />
      ) : (
        <Table columns={COLUMNS} rows={suits ?? []} rowKey={(row) => row.id} caption="Trajes del catálogo" />
      )}

      <p className={s.designNote}>
        <Icon name="info" size={15} />
        En esta fase la tabla es de solo lectura. Crear/editar modelos y subir imágenes
        (<code>POST /admin/suits</code>, <code>POST /admin/suits/:id/images</code>) llegan con el
        backend y el bucket de MinIO.
      </p>
    </div>
  );
}
