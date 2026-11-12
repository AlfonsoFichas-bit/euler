import { afterEach, beforeEach, describe, expect, test } from '@rstest/core';
import { fireEvent, screen } from '@testing-library/dom';
import { render } from 'preact';
import { act } from 'preact/test-utils';
import App from '../src/App';

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.append(container);
});

afterEach(() => {
  render(null, container);
  container.remove();
});

const mount = () => {
  act(() => {
    render(<App />, container);
  });
};

const FIELDS = [
  ['Masa', '1000', 'kg'],
  ['Empuje', '15000', 'N'],
  ['Gravedad', '9,81', 'm/s²'],
  ['Coeficiente de resistencia', '100', 'kg/s'],
  ['Velocidad inicial', '0', 'm/s'],
  ['Altura inicial', '0', 'm'],
  ['Tiempo de simulación', '20', 's'],
  ['Paso de Euler', '2', 's'],
] as const;

describe('panel de parámetros', () => {
  test('muestra los ocho campos con sus valores y unidades', () => {
    mount();

    expect(screen.getAllByRole('textbox')).toHaveLength(8);

    for (const [label, value, unit] of FIELDS) {
      const input = screen.getByLabelText(label) as HTMLInputElement;
      expect(input.value).toBe(value);
      expect(input.getAttribute('inputmode')).toBe('decimal');
      expect(document.getElementById(`${input.id}-unit`)?.textContent).toBe(
        unit,
      );
      expect(document.querySelector(`label[for="${input.id}"]`)).not.toBeNull();
    }
  });

  test('marca cambios pendientes y recalcula al calcular', () => {
    mount();

    const step = screen.getByLabelText('Paso de Euler');
    act(() => {
      fireEvent.input(step, { target: { value: '1' } });
    });
    expect(screen.getByRole('status')).toHaveTextContent('Cambios sin aplicar');

    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Calcular trayectoria' }),
      );
    });

    expect(screen.getByRole('status')).toHaveTextContent('Resultados al día');
    expect(screen.getByText(/h = 1 s/)).toBeVisible();
    expect(screen.getByText(/21 filas/)).toBeVisible();
  });

  test('el preset de 0,5 s recalcula con ese paso', () => {
    mount();

    const preset = screen.getByRole('button', { name: 'Paso de 0,5 s' });
    act(() => {
      fireEvent.click(preset);
    });

    expect(screen.getByText(/h = 0,5 s/)).toBeVisible();
    expect(screen.getByText(/41 filas/)).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Resultados al día');
    expect(preset).toHaveAttribute('aria-pressed', 'true');
  });

  test('restablece los valores del enunciado', () => {
    mount();

    const mass = screen.getByLabelText('Masa');
    act(() => {
      fireEvent.input(mass, { target: { value: '1200' } });
    });
    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Calcular trayectoria' }),
      );
    });
    expect((screen.getByLabelText('Masa') as HTMLInputElement).value).toBe(
      '1200',
    );

    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Restablecer datos' }),
      );
    });

    expect((screen.getByLabelText('Masa') as HTMLInputElement).value).toBe(
      '1000',
    );
    expect((screen.getByLabelText('Gravedad') as HTMLInputElement).value).toBe(
      '9,81',
    );
    expect(screen.getByRole('status')).toHaveTextContent('Resultados al día');
  });

  test('un paso inválido muestra el mensaje y conserva la salida aplicada', () => {
    mount();

    const step = screen.getByLabelText('Paso de Euler');
    act(() => {
      fireEvent.input(step, { target: { value: '0' } });
    });
    act(() => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Calcular trayectoria' }),
      );
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'El paso debe ser mayor que cero.',
    );
    expect(step).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/h = 2 s/)).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Cambios sin aplicar');
  });

  test('todos los campos son enfocables y tienen etiqueta', () => {
    mount();

    for (const input of screen.getAllByRole('textbox')) {
      expect(input.tabIndex).toBe(0);
      expect(input.id).toBeTruthy();
      expect(document.querySelector(`label[for="${input.id}"]`)).not.toBeNull();
    }
  });
});
