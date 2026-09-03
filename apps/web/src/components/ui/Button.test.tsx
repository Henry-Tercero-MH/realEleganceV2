import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Button, ButtonLink } from './Button';

describe('Button', () => {
  it('renderiza el texto y dispara onClick al hacer clic', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);

    const button = screen.getByRole('button', { name: 'Guardar' });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('es <button type="button"> por defecto, para no enviar formularios sin querer', () => {
    render(<Button>Cancelar</Button>);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveAttribute('type', 'button');
  });

  it('disabled bloquea el clic', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Enviar
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Enviar' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('isLoading desactiva el botón y lo marca aria-busy, sin perder el onClick al soltar la carga', async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Button isLoading onClick={onClick}>
        Guardar
      </Button>,
    );

    // Mientras carga, el texto queda oculto (visibility: hidden) para no saltar
    // de layout, así que el nombre accesible pasa a ser el del spinner.
    const button = screen.getByRole('button', { name: 'Procesando' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    rerender(
      <Button onClick={onClick} isLoading={false}>
        Guardar
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Guardar' })).not.toBeDisabled();
  });
});

describe('ButtonLink', () => {
  it('renderiza un <a> con el href del router para destinos internos', () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/carrito">Ver carrito</ButtonLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Ver carrito' });
    expect(link).toHaveAttribute('href', '/carrito');
  });

  it('con external, renderiza un <a> normal en pestaña nueva', () => {
    render(
      <MemoryRouter>
        <ButtonLink to="https://ejemplo.com" external>
          Sitio externo
        </ButtonLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Sitio externo' });
    expect(link).toHaveAttribute('href', 'https://ejemplo.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });
});
