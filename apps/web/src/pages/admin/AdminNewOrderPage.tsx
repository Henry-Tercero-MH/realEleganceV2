import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  EmptyState,
  Icon,
  IconButton,
  Input,
  OptionCard,
  Price,
  QuantityStepper,
  Rule,
  SectionHeading,
  Select,
  Skeleton,
  Textarea,
} from '@/components/ui';
import type { CartItemType } from '@real-elegance/shared';
import {
  useAdminCustomer,
  useAdminCustomers,
  useAdminFabrics,
  useAdminProducts,
  useAdminSuits,
  useCreateCustomer,
  useCreateOrder,
} from '@/features/admin/hooks';
import { MeasurementModal } from '@/features/admin/MeasurementModal';
import { useOptionGroups } from '@/features/catalog/hooks';
import { describeOptions, priceMadeToMeasure, DEPOSIT_RATE, METERS_PER_SUIT, TAX_RATE } from '@/features/cart/pricing';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency } from '@/lib/format';
import { isValidEmail, isValidName, isValidPhoneGT } from '@/lib/validation';
import { randomId } from '@/lib/id';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './admin.module.css';

const PAYMENT_METHODS = [
  { id: 1, name: 'Efectivo' },
  { id: 2, name: 'Tarjeta de crédito' },
  { id: 3, name: 'Transferencia bancaria' },
];

interface DraftItem {
  key: string;
  itemType: CartItemType;
  suitModelId: number | null;
  fabricId: number | null;
  productId: number | null;
  measurementSetId: number | null;
  quantity: number;
  unitPrice: number;
  displayName: string;
  displaySubtitle: string | null;
  customizations: Array<{ optionValueId: number; groupName: string; optionName: string; priceDelta: number }>;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export default function AdminNewOrderPage() {
  const [searchParams] = useSearchParams();
  const preselected = Number(searchParams.get('customerId')) || null;
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const staffName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Personal del taller';

  // ── Cliente ──────────────────────────────────────────────────────────────
  const [customerId, setCustomerId] = useState<number | null>(preselected);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const { data: customers } = useAdminCustomers();
  const { data: selectedCustomer } = useAdminCustomer(customerId ?? undefined);
  const createCustomer = useCreateCustomer();

  // ── Catálogo ─────────────────────────────────────────────────────────────
  const { data: suits, isLoading: loadingSuits } = useAdminSuits();
  const { data: fabrics, isLoading: loadingFabrics } = useAdminFabrics();
  const { data: products, isLoading: loadingProducts } = useAdminProducts();
  const { data: optionGroups, isLoading: loadingOptions } = useOptionGroups();

  // ── Artículo en construcción ─────────────────────────────────────────────
  const [itemType, setItemType] = useState<CartItemType>('made_to_measure');
  const [suitModelId, setSuitModelId] = useState<number | null>(null);
  const [fabricId, setFabricId] = useState<number | null>(null);
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [measurementSetId, setMeasurementSetId] = useState<number | null>(null);
  const [mtmQuantity, setMtmQuantity] = useState(1);
  const [measureModalOpen, setMeasureModalOpen] = useState(false);

  const [productId, setProductId] = useState<number | null>(null);
  const [rtwQuantity, setRtwQuantity] = useState(1);

  const [items, setItems] = useState<DraftItem[]>([]);

  // ── Pago ─────────────────────────────────────────────────────────────────
  const [paymentMethodId, setPaymentMethodId] = useState(PAYMENT_METHODS[0]!.id);
  const [depositAmount, setDepositAmount] = useState('');
  const [note, setNote] = useState('');

  const createOrder = useCreateOrder();

  const suit = suits?.find((item) => item.id === suitModelId) ?? null;
  const fabric = fabrics?.find((item) => item.id === fabricId) ?? null;
  const product = products?.find((item) => item.id === productId) ?? null;

  const defaults = useMemo(() => {
    if (!optionGroups) return {};
    return Object.fromEntries(
      optionGroups.filter((group) => group.isRequired && group.values[0]).map((group) => [group.id, group.values[0]!.id]),
    ) as Record<number, number>;
  }, [optionGroups]);

  const effectiveSelections = { ...defaults, ...selections };
  const selectedOptionIds = Object.values(effectiveSelections);
  const mtmUnitPrice =
    suit && fabric && optionGroups ? priceMadeToMeasure(suit, fabric, selectedOptionIds, optionGroups) : null;

  function addMadeToMeasureItem() {
    if (!suit || !fabric || mtmUnitPrice === null || !optionGroups) return;

    setItems((current) => [
      ...current,
      {
        key: randomId('item'),
        itemType: 'made_to_measure',
        suitModelId: suit.id,
        fabricId: fabric.id,
        productId: null,
        measurementSetId,
        quantity: mtmQuantity,
        unitPrice: mtmUnitPrice,
        displayName: suit.name,
        displaySubtitle: `${fabric.name} · ${suit.styleName}`,
        customizations: describeOptions(selectedOptionIds, optionGroups).map((option) => ({
          optionValueId: option.id,
          groupName: option.groupName,
          optionName: option.name,
          priceDelta: option.priceDelta,
        })),
      },
    ]);

    setSuitModelId(null);
    setFabricId(null);
    setSelections({});
    setMeasurementSetId(null);
    setMtmQuantity(1);
  }

  function addReadyToWearItem() {
    if (!product) return;

    setItems((current) => [
      ...current,
      {
        key: randomId('item'),
        itemType: 'ready_to_wear',
        suitModelId: null,
        fabricId: null,
        productId: product.id,
        measurementSetId: null,
        quantity: rtwQuantity,
        unitPrice: product.price,
        displayName: product.name,
        displaySubtitle: product.categoryName,
        customizations: [],
      },
    ]);

    setProductId(null);
    setRtwQuantity(1);
  }

  function removeItem(key: string) {
    setItems((current) => current.filter((item) => item.key !== key));
  }

  const subtotal = round(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
  const tax = round(subtotal * TAX_RATE);
  const total = round(subtotal + tax);
  const mtmSubtotal = round(
    items
      .filter((item) => item.itemType === 'made_to_measure')
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
  const rtwSubtotal = round(subtotal - mtmSubtotal);
  const suggestedDeposit = round((mtmSubtotal * DEPOSIT_RATE + rtwSubtotal) * (1 + TAX_RATE));
  const depositValue = Number(depositAmount) || 0;
  const balanceDue = round(total - depositValue);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (items.length === 0) {
      toast.error('Falta el artículo', 'Agrega al menos un artículo al pedido.');
      return;
    }

    const trimmedDeposit = depositAmount.trim();
    const parsedDeposit = trimmedDeposit === '' ? 0 : Number(trimmedDeposit);
    if (!Number.isFinite(parsedDeposit) || parsedDeposit < 0) {
      toast.error('Anticipo inválido', 'Escribe un monto válido, mayor o igual a Q 0.00.');
      return;
    }
    if (parsedDeposit > total) {
      toast.error('Anticipo inválido', 'El anticipo no puede ser mayor que el total del pedido.');
      return;
    }

    let finalCustomerId = customerId;

    try {
      if (creatingCustomer) {
        if (!isValidName(newFirstName) || !isValidName(newLastName)) {
          toast.error('Revisa el nombre', 'Nombre y apellidos deben tener entre 2 y 60 letras.');
          return;
        }
        if (!isValidEmail(newEmail)) {
          toast.error('Revisa el correo', 'Ingresa un correo válido, ej. nombre@dominio.com.');
          return;
        }
        if (newPhone.trim() && !isValidPhoneGT(newPhone)) {
          toast.error('Revisa el teléfono', 'Ingresa un teléfono válido de 8 dígitos (ej. 5555-1234).');
          return;
        }
        const created = await createCustomer.mutateAsync({
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          phone: newPhone,
        });
        finalCustomerId = created.id;
      }

      if (!finalCustomerId) {
        toast.error('Falta el cliente', 'Elige un cliente o registra uno nuevo.');
        return;
      }

      const paymentMethod = PAYMENT_METHODS.find((method) => method.id === paymentMethodId)!;

      const order = await createOrder.mutateAsync({
        customerId: finalCustomerId,
        items: items.map((item) => ({
          itemType: item.itemType,
          suitModelId: item.suitModelId,
          fabricId: item.fabricId,
          productId: item.productId,
          measurementSetId: item.measurementSetId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          customizations: item.customizations,
        })),
        paymentMethodId: paymentMethod.id,
        paymentMethodName: paymentMethod.name,
        depositAmount: parsedDeposit,
        note: note || undefined,
        createdByName: staffName || 'Personal del taller',
      });

      toast.success('Pedido creado', `Número de pedido ${order.orderNumber}.`);
      navigate(paths.adminOrder(order.orderNumber));
    } catch (error) {
      toast.error(
        'No se pudo crear el pedido',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  const measurementOptions = (selectedCustomer?.measurementSets ?? []).map((set) => ({
    value: set.id,
    label: `Tomadas el ${new Date(set.takenAt).toLocaleDateString('es-GT')}${set.takenByName ? ` — ${set.takenByName}` : ''}`,
  }));

  const isSubmitting = createOrder.isPending || createCustomer.isPending;

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow={<Link to={paths.adminOrders}>← Pedidos</Link>}
        title="Nuevo pedido"
        description="Para clientes que llegan al mostrador: sin carrito, sin checkout web."
      />

      <form onSubmit={handleSubmit} className={cx(l.withSummary, l.afterHeading)}>
        <div className={l.stack}>
          {/* ── Cliente ────────────────────────────────────────────────── */}
          <Card variant="raised">
            <Card.Header title="Cliente" />
            <Card.Body>
              {!creatingCustomer ? (
                <>
                  <Select
                    label="Cliente"
                    placeholder="Elige un cliente"
                    value={customerId ?? ''}
                    onChange={(event) => setCustomerId(event.target.value ? Number(event.target.value) : null)}
                    options={(customers ?? []).map((customer) => ({
                      value: customer.id,
                      label: `${customer.firstName} ${customer.lastName} — ${customer.email}`,
                    }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={<Icon name="plus" size={14} />}
                    onClick={() => {
                      setCreatingCustomer(true);
                      setCustomerId(null);
                    }}
                  >
                    Registrar cliente nuevo
                  </Button>
                </>
              ) : (
                <>
                  <div className={s.formGrid2}>
                    <Input label="Nombre" required value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
                    <Input label="Apellidos" required value={newLastName} onChange={(e) => setNewLastName(e.target.value)} />
                    <Input
                      label="Correo electrónico"
                      type="email"
                      required
                      fieldClassName={s.span2}
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <Input
                      label="Teléfono"
                      type="tel"
                      placeholder="+502 5555 1234"
                      fieldClassName={s.span2}
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setCreatingCustomer(false)}>
                    Elegir un cliente existente
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>

          {/* ── Artículos ──────────────────────────────────────────────── */}
          <Card variant="raised">
            <Card.Header title="Artículos" subtitle="Agrega uno o varios a la vez." />
            <Card.Body>
              <div className={l.row}>
                <OptionCard
                  layout="tile"
                  name="tipo-articulo"
                  value="made_to_measure"
                  checked={itemType === 'made_to_measure'}
                  onChange={() => setItemType('made_to_measure')}
                  title="Traje a medida"
                />
                <OptionCard
                  layout="tile"
                  name="tipo-articulo"
                  value="ready_to_wear"
                  checked={itemType === 'ready_to_wear'}
                  onChange={() => setItemType('ready_to_wear')}
                  title="Listo para llevar"
                />
              </div>

              {itemType === 'made_to_measure' ? (
                loadingSuits || loadingFabrics || loadingOptions ? (
                  <Skeleton height="220px" radius="var(--radius-md)" />
                ) : (
                  <div className={s.builderBody}>
                    <Select
                      label="Modelo"
                      placeholder="Elige un traje"
                      value={suitModelId ?? ''}
                      onChange={(event) => setSuitModelId(event.target.value ? Number(event.target.value) : null)}
                      options={(suits ?? [])
                        .filter((item) => item.isActive)
                        .map((item) => ({ value: item.id, label: `${item.name} — ${formatCurrency(item.basePrice)}` }))}
                    />
                    <Select
                      label="Tela"
                      placeholder="Elige una tela"
                      value={fabricId ?? ''}
                      onChange={(event) => setFabricId(event.target.value ? Number(event.target.value) : null)}
                      options={(fabrics ?? [])
                        .filter((item) => item.isActive)
                        .map((item) => ({
                          value: item.id,
                          label: `${item.name} — ${item.stockMeters} m disponibles`,
                          disabled: item.stockMeters < METERS_PER_SUIT,
                        }))}
                    />

                    {(optionGroups ?? []).map((group) => (
                      <Select
                        key={group.id}
                        label={group.name}
                        placeholder={group.isRequired ? undefined : 'Sin elegir'}
                        value={effectiveSelections[group.id] ?? ''}
                        onChange={(event) =>
                          setSelections((current) => ({ ...current, [group.id]: Number(event.target.value) }))
                        }
                        options={group.values.map((value) => ({
                          value: value.id,
                          label:
                            value.priceDelta !== 0
                              ? `${value.name} (${value.priceDelta > 0 ? '+' : '−'}${formatCurrency(Math.abs(value.priceDelta))})`
                              : value.name,
                        }))}
                      />
                    ))}

                    <div className={l.rowBetween}>
                      <Select
                        label="Ficha de medidas"
                        fieldClassName={l.grow}
                        placeholder={
                          creatingCustomer || !customerId
                            ? 'Elige un cliente para ver sus fichas'
                            : 'Se tomará después, en su cita'
                        }
                        value={measurementSetId ?? ''}
                        disabled={creatingCustomer || !customerId || measurementOptions.length === 0}
                        onChange={(event) =>
                          setMeasurementSetId(event.target.value ? Number(event.target.value) : null)
                        }
                        options={measurementOptions}
                      />
                      {!creatingCustomer && customerId ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          leftIcon={<Icon name="ruler" size={14} />}
                          onClick={() => setMeasureModalOpen(true)}
                        >
                          Tomar medidas
                        </Button>
                      ) : null}
                    </div>

                    <div className={l.rowBetween}>
                      <QuantityStepper label="Cantidad" value={mtmQuantity} onChange={setMtmQuantity} min={1} max={5} size="sm" />
                      {mtmUnitPrice !== null ? <Price amount={mtmUnitPrice} size="md" /> : null}
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      leftIcon={<Icon name="plus" size={14} />}
                      disabled={!suit || !fabric}
                      onClick={addMadeToMeasureItem}
                    >
                      Agregar artículo a medida
                    </Button>
                  </div>
                )
              ) : loadingProducts ? (
                <Skeleton height="140px" radius="var(--radius-md)" />
              ) : (
                <div className={s.builderBody}>
                  <Select
                    label="Producto"
                    placeholder="Elige un accesorio"
                    value={productId ?? ''}
                    onChange={(event) => setProductId(event.target.value ? Number(event.target.value) : null)}
                    options={(products ?? [])
                      .filter((item) => item.isActive && item.stock > 0)
                      .map((item) => ({ value: item.id, label: `${item.name} — ${formatCurrency(item.price)}` }))}
                  />

                  <div className={l.rowBetween}>
                    <QuantityStepper
                      label="Cantidad"
                      value={rtwQuantity}
                      onChange={setRtwQuantity}
                      min={1}
                      max={product?.stock ?? 99}
                      size="sm"
                    />
                    {product ? <Price amount={product.price} size="md" /> : null}
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    leftIcon={<Icon name="plus" size={14} />}
                    disabled={!product}
                    onClick={addReadyToWearItem}
                  >
                    Agregar accesorio
                  </Button>
                </div>
              )}

              <Rule variant="stitch" className={s.ruleGap} />

              {items.length === 0 ? (
                <EmptyState size="sm" icon="package" title="Todavía no hay artículos en este pedido" />
              ) : (
                <div className={s.lineItems}>
                  {items.map((item) => (
                    <div key={item.key} className={s.lineItem}>
                      <div>
                        <span className={s.lineItemName}>
                          {item.quantity} × {item.displayName}
                        </span>
                        {item.displaySubtitle ? <span className={s.lineItemSub}>{item.displaySubtitle}</span> : null}
                      </div>
                      <Price amount={round(item.unitPrice * item.quantity)} size="sm" />
                      <IconButton
                        label="Quitar artículo"
                        icon={<Icon name="trash" size={16} />}
                        onClick={() => removeItem(item.key)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* ── Pago ───────────────────────────────────────────────────── */}
          <Card variant="raised">
            <Card.Header title="Pago" />
            <Card.Body>
              <div className={s.formGrid2}>
                <Select
                  label="Método de pago"
                  value={paymentMethodId}
                  onChange={(event) => setPaymentMethodId(Number(event.target.value))}
                  options={PAYMENT_METHODS.map((method) => ({ value: method.id, label: method.name }))}
                />
                <Input
                  label="Monto pagado ahora"
                  type="number"
                  min="0"
                  step="0.01"
                  hint={
                    total > 0
                      ? `Sugerido (50 % de anticipo en lo a medida): ${formatCurrency(suggestedDeposit)}`
                      : undefined
                  }
                  value={depositAmount}
                  onChange={(event) => setDepositAmount(event.target.value)}
                />
              </div>
              {total > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDepositAmount(String(suggestedDeposit))}
                >
                  Usar el anticipo sugerido
                </Button>
              ) : null}

              <Textarea
                label="Nota para el taller"
                placeholder="Por ejemplo: lo necesita antes del 20 de septiembre."
                hint="Opcional."
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </Card.Body>
          </Card>
        </div>

        {/* ── Resumen ──────────────────────────────────────────────────── */}
        <aside className={l.summaryColumn}>
          <Card variant="raised">
            <Card.Header title="Resumen" subtitle={`${items.length} artículo(s)`} />
            <Card.Body>
              {items.length === 0 ? (
                <p className={s.cellSub}>Agrega artículos para ver el total.</p>
              ) : (
                <ul role="list" className={s.lineItems}>
                  {items.map((item) => (
                    <li key={item.key} className={s.cellSub}>
                      {item.quantity}× {item.displayName} — {formatCurrency(round(item.unitPrice * item.quantity))}
                    </li>
                  ))}
                </ul>
              )}

              <Rule variant="stitch" className={s.ruleGapSm} />

              <dl className={s.totals}>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatCurrency(subtotal)}</dd>
                </div>
                <div>
                  <dt>IVA</dt>
                  <dd>{formatCurrency(tax)}</dd>
                </div>
                <div className={s.grandTotal}>
                  <dt>Total</dt>
                  <dd>{formatCurrency(total)}</dd>
                </div>
                <div>
                  <dt>Pagado ahora</dt>
                  <dd>{formatCurrency(depositValue)}</dd>
                </div>
                <div>
                  <dt>Saldo pendiente</dt>
                  <dd>{formatCurrency(Math.max(0, balanceDue))}</dd>
                </div>
              </dl>
            </Card.Body>
            <Card.Footer>
              <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
                Confirmar pedido
              </Button>
            </Card.Footer>
          </Card>
        </aside>
      </form>

      {customerId ? (
        <MeasurementModal
          open={measureModalOpen}
          onClose={() => setMeasureModalOpen(false)}
          customerId={customerId}
          onSaved={(set) => setMeasurementSetId(set.id)}
        />
      ) : null}
    </div>
  );
}
