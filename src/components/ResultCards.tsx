import { formatInput } from '../lib/paramFields';
import { formatNumber, type Simulation } from '../lib/rocket';

interface ResultCardsProps {
  simulation: Simulation;
}

const ResultCards = ({ simulation }: ResultCardsProps) => {
  const last = simulation.iterations[simulation.iterations.length - 1];
  const tEnd = formatInput(simulation.params.tEnd);

  return (
    <div class="grid gap-4 sm:grid-cols-2">
      <article class="stat" aria-labelledby="stat-velocity-title">
        <h3 id="stat-velocity-title" class="stat__title">
          Velocidad
        </h3>
        <p class="mt-1 text-sm text-ink-faint">a los {tEnd} s</p>
        <dl class="stat__list">
          <div class="stat__row">
            <dt>Euler</dt>
            <dd>
              {formatNumber(last.v)} <span class="stat__unit">m/s</span>
            </dd>
          </div>
          <div class="stat__row">
            <dt>Solución exacta</dt>
            <dd>
              {formatNumber(simulation.exactAtEnd.v)}{' '}
              <span class="stat__unit">m/s</span>
            </dd>
          </div>
          <div class="stat__row stat__row--error">
            <dt>Error absoluto</dt>
            <dd>
              {formatNumber(simulation.errors.v)}{' '}
              <span class="stat__unit">m/s</span>
            </dd>
          </div>
        </dl>
      </article>

      <article class="stat" aria-labelledby="stat-height-title">
        <h3 id="stat-height-title" class="stat__title">
          Altura
        </h3>
        <p class="mt-1 text-sm text-ink-faint">a los {tEnd} s</p>
        <dl class="stat__list">
          <div class="stat__row">
            <dt>Euler</dt>
            <dd>
              {formatNumber(last.y)} <span class="stat__unit">m</span>
            </dd>
          </div>
          <div class="stat__row">
            <dt>Solución exacta</dt>
            <dd>
              {formatNumber(simulation.exactAtEnd.y)}{' '}
              <span class="stat__unit">m</span>
            </dd>
          </div>
          <div class="stat__row stat__row--error">
            <dt>Error absoluto</dt>
            <dd>
              {formatNumber(simulation.errors.y)}{' '}
              <span class="stat__unit">m</span>
            </dd>
          </div>
        </dl>
      </article>
    </div>
  );
};

export default ResultCards;
