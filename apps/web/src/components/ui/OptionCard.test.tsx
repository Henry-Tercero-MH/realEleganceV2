import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptionCard } from './OptionCard';

describe('OptionCard', () => {
  it('es un radio real: name/value correctos y checked refleja la prop', () => {
    render(
      <OptionCard name="solapa" value="pico" checked title="Solapa de pico" onChange={vi.fn()} />,
    );

    const radio = screen.getByRole('radio', { name: 'Solapa de pico' });
    expect(radio).toBeChecked();
    expect(radio).toHaveAttribute('name', 'solapa');
    expect(radio).toHaveAttribute('value', 'pico');
  });

  it('seleccionar la opción llama a onChange con su value', async () => {
    const onChange = vi.fn();
    render(
      <OptionCard name="solapa" value="pico" checked={false} title="Solapa de pico" onChange={onChange} />,
    );

    // El <input> real está visualmente oculto con pointer-events: none — se
    // interactúa como lo haría una persona, con la tarjeta (el <label>).
    await userEvent.click(screen.getByText('Solapa de pico'));
    expect(onChange).toHaveBeenCalledWith('pico');
  });

  it('disabled no deja seleccionarla', async () => {
    const onChange = vi.fn();
    render(
      <OptionCard
        name="solapa"
        value="pico"
        checked={false}
        title="Solapa de pico"
        onChange={onChange}
        disabled
      />,
    );

    const radio = screen.getByRole('radio', { name: 'Solapa de pico' });
    expect(radio).toBeDisabled();
    await userEvent.click(screen.getByText('Solapa de pico'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('un priceDelta de 0 se muestra como «Incluido»', () => {
    render(
      <OptionCard name="forro" value="std" checked={false} title="Forro estándar" priceDelta={0} onChange={vi.fn()} />,
    );
    expect(screen.getByText('Incluido')).toBeInTheDocument();
  });

  // getByText normaliza los espacios del DOM (incluye el NBSP que deja
  // Intl.NumberFormat) a un espacio normal, así que se compara con una
  // expresión regular tolerante en vez del string exacto de formatCurrency.
  it('un priceDelta positivo se muestra con signo + y el monto', () => {
    render(
      <OptionCard name="solapa" value="pico" checked={false} title="Solapa de pico" priceDelta={150} onChange={vi.fn()} />,
    );
    expect(screen.getByText(/^\+Q\s*150\.00$/)).toBeInTheDocument();
  });

  it('un priceDelta negativo se muestra con signo − y el monto absoluto', () => {
    render(
      <OptionCard name="tela" value="basica" checked={false} title="Tela básica" priceDelta={-80} onChange={vi.fn()} />,
    );
    expect(screen.getByText(/^−Q\s*80\.00$/)).toBeInTheDocument();
  });

  it('sin priceDelta no muestra ninguna etiqueta de precio', () => {
    render(<OptionCard name="forro" value="std" checked={false} title="Forro estándar" onChange={vi.fn()} />);
    expect(screen.queryByText('Incluido')).not.toBeInTheDocument();
  });
});
