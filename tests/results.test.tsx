import { afterEach, beforeEach, describe, expect, test } from '@rstest/core';
import { fireEvent, screen, within } from '@testing-library/dom';
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

describe('presentación de resultados', () => {
  test('las tarjetas comparan Euler, exacta y error', () => {
    mount();

    const velocity = screen.getByRole('article', { name: 'Velocidad' });
    expect(within(velocity).getByText('46,3273')).toBeVisible();
    expect(within(velocity).getByText('44,8761')).toBeVisible();
    expect(within(velocity).getByText('1,4512')).toBeVisible();

    const height = screen.getByRole('article', { name: 'Altura' });
    expect(within(height).getByText('574,7272')).toBeVisible();
    expect(within(height).getByText('589,2390')).toBeVisible();
    expect(within(height).getByText('14,5118')).toBeVisible();
  });

  test('la tabla de iteraciones muestra las once filas del documento', () => {
    mount();

    const table = screen.getByRole('table', {
      name: /Iteraciones de Euler con paso de 2 s/,
    });
    expect(within(table).getAllByRole('row')).toHaveLength(12);
    expect(within(table).getByText('46,3273')).toBeVisible();
    expect(within(table).getByText('574,7272')).toBeVisible();

    const scroll = screen.getByRole('region', {
      name: 'Tabla de iteraciones',
    });
    expect(scroll).toHaveAttribute('tabindex', '0');
  });

  test('las fórmulas del modelo y de la analítica se renderizan', () => {
    mount();

    expect(document.querySelectorAll('.katex').length).toBeGreaterThanOrEqual(
      2,
    );
    expect(screen.getByText('Modelo matemático')).toBeVisible();
    expect(screen.getByText('Solución analítica')).toBeVisible();
  });

  test('las gráficas incluyen Euler y analítica y se actualizan', () => {
    mount();

    const velocity = screen.getByRole('figure', {
      name: 'Velocidad del cohete',
    });
    expect(within(velocity).getByText('Euler')).toBeVisible();
    expect(within(velocity).getByText('Analítica')).toBeVisible();
    expect(
      velocity.querySelector('[data-series="euler"]')?.getAttribute('data-points'),
    ).toBe('11');
    expect(
      velocity.querySelector('[data-series="analitica"]'),
    ).not.toBeNull();

    const height = screen.getByRole('figure', { name: 'Altura del cohete' });
    expect(within(height).getByText('Euler')).toBeVisible();
    expect(within(height).getByText('Analítica')).toBeVisible();

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Paso de 0,5 s' }));
    });

    expect(
      velocity.querySelector('[data-series="euler"]')?.getAttribute('data-points'),
    ).toBe('41');
    expect(
      screen.getByRole('table', { name: /Iteraciones de Euler con paso de 0,5 s/ }),
    ).toBeVisible();
  });

  test('la tabla de error incluye los cuatro pasos y la fila exacta', () => {
    mount();

    const table = screen.getByRole('table', {
      name: /Error absoluto al tiempo final/,
    });
    expect(within(table).getAllByRole('row')).toHaveLength(6);
    expect(within(table).getByText('Exacta')).toBeVisible();
    expect(within(table).getByText('0,25 s')).toBeVisible();
  });
});
