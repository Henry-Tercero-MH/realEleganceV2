import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from './CartContext';

/**
 * Harness mínimo: no monta una página entera (router, React Query, mocks…),
 * solo ejercita el flujo real «añadir al carrito» a través del `CartProvider`
 * de verdad — mismo reducer, mismo cálculo de totales, misma persistencia.
 */
function AddToCartHarness() {
  const { cart, totals, isDrawerOpen, addItem, updateQuantity } = useCart();
  const line = cart.lines[0];

  return (
    <div>
      <button
        onClick={() =>
          addItem({
            itemType: 'ready_to_wear',
            quantity: 1,
            unitPrice: 480,
            suitModelId: null,
            fabricId: null,
            optionValueIds: [],
            productId: 7,
            displayName: 'Corbata de seda granadina',
            displaySubtitle: null,
            imageUrl: null,
            selectedOptions: [],
            maxQuantity: 9,
          })
        }
      >
        Añadir al carrito
      </button>

      {line ? (
        <button onClick={() => updateQuantity(line.lineId, line.quantity + 1)}>Sumar uno más</button>
      ) : null}

      <p>Artículos en el carrito: {totals.itemCount}</p>
      <p>Total: {totals.total}</p>
      <p>Drawer: {isDrawerOpen ? 'abierto' : 'cerrado'}</p>
    </div>
  );
}

beforeEach(() => {
  // El carrito persiste en localStorage entre renders: cada test parte de cero.
  window.localStorage.clear();
});

describe('flujo «añadir al carrito»', () => {
  it('añadir un artículo lo refleja en los totales y abre el drawer', async () => {
    render(
      <CartProvider>
        <AddToCartHarness />
      </CartProvider>,
    );

    expect(screen.getByText('Artículos en el carrito: 0')).toBeInTheDocument();
    expect(screen.getByText('Drawer: cerrado')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }));

    expect(screen.getByText('Artículos en el carrito: 1')).toBeInTheDocument();
    expect(screen.getByText('Drawer: abierto')).toBeInTheDocument();
    // 480 + 12% de IVA, calculado por la misma pricing.ts que prueba pricing.test.ts.
    expect(screen.getByText('Total: 537.6')).toBeInTheDocument();
  });

  it('añadir el mismo artículo dos veces suma cantidad en vez de duplicar la línea', async () => {
    render(
      <CartProvider>
        <AddToCartHarness />
      </CartProvider>,
    );

    const addButton = screen.getByRole('button', { name: 'Añadir al carrito' });
    await userEvent.click(addButton);
    await userEvent.click(addButton);

    expect(screen.getByText('Artículos en el carrito: 2')).toBeInTheDocument();
  });

  it('el carrito sobrevive a un remount (persistencia en localStorage)', async () => {
    const { unmount } = render(
      <CartProvider>
        <AddToCartHarness />
      </CartProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }));
    unmount();

    render(
      <CartProvider>
        <AddToCartHarness />
      </CartProvider>,
    );
    expect(screen.getByText('Artículos en el carrito: 1')).toBeInTheDocument();
  });
});
