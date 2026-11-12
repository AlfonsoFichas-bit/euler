export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartSeries {
  id: string;
  label: string;
  color: string;
  points: ChartPoint[];
  dots?: boolean;
}

interface LineChartProps {
  id: string;
  caption: string;
  unit: string;
  series: ChartSeries[];
  xMax: number;
}

const WIDTH = 760;
const HEIGHT = 340;
const MARGIN = { top: 20, right: 20, bottom: 48, left: 64 };
const INNER_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

const tickFormat = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 2,
});

function niceStep(span: number, target: number): number {
  const raw = span / Math.max(1, target);
  const magnitude = 10 ** Math.floor(Math.log10(raw || 1));
  const normalized = raw / magnitude;
  const factor =
    normalized <= 1
      ? 1
      : normalized <= 2
        ? 2
        : normalized <= 2.5
          ? 2.5
          : normalized <= 5
            ? 5
            : 10;
  return factor * magnitude;
}

function niceAxis(min: number, max: number, target: number) {
  const step = niceStep(max - min || 1, target);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const count = Math.round((hi - lo) / step);
  const ticks: number[] = [];
  for (let index = 0; index <= count; index++) {
    ticks.push(Number((lo + index * step).toFixed(10)));
  }
  return { lo, hi, ticks };
}

const LineChart = ({
  id,
  caption,
  unit,
  series,
  xMax,
}: LineChartProps) => {
  const values = series.flatMap((item) => item.points.map((point) => point.y));
  const yAxis = niceAxis(Math.min(0, ...values), Math.max(1, ...values), 5);
  const xAxis = niceAxis(0, xMax, 10);

  const scaleX = (x: number) =>
    MARGIN.left + (x / xMax) * INNER_WIDTH;
  const scaleY = (y: number) =>
    MARGIN.top +
    INNER_HEIGHT -
    ((y - yAxis.lo) / (yAxis.hi - yAxis.lo)) * INNER_HEIGHT;

  const pathFor = (points: ChartPoint[]) =>
    points
      .map((point, index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${command}${scaleX(point.x).toFixed(2)},${scaleY(
          point.y,
        ).toFixed(2)}`;
      })
      .join(' ');

  const yLabelX = 16;
  const yLabelY = MARGIN.top + INNER_HEIGHT / 2;

  return (
    <figure class="chart" aria-labelledby={`${id}-caption`}>
      <figcaption id={`${id}-caption`} class="chart__caption">
        {caption}
      </figcaption>
      <ul class="chart__legend">
        {series.map((item) => (
          <li key={item.id}>
            <span
              class="chart__swatch"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <svg
        class="chart__svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-labelledby={`${id}-title`}
      >
        <title id={`${id}-title`}>
          {caption}: Euler frente a la solución analítica
        </title>
        <desc>
          Serie de Euler y serie analítica a lo largo de {xMax} segundos, con
          el eje vertical en {unit}.
        </desc>

        {yAxis.ticks.map((tick) => (
          <g key={`y-${tick}`}>
            <line
              class="chart__grid"
              x1={MARGIN.left}
              x2={WIDTH - MARGIN.right}
              y1={scaleY(tick)}
              y2={scaleY(tick)}
            />
            <text
              class="chart__tick"
              x={MARGIN.left - 10}
              y={scaleY(tick)}
              text-anchor="end"
              dominant-baseline="middle"
            >
              {tickFormat.format(tick)}
            </text>
          </g>
        ))}

        {xAxis.ticks
          .filter((tick) => tick >= 0 && tick <= xMax)
          .map((tick) => (
            <g key={`x-${tick}`}>
              <line
                class="chart__grid"
                x1={scaleX(tick)}
                x2={scaleX(tick)}
                y1={MARGIN.top}
                y2={MARGIN.top + INNER_HEIGHT}
              />
              <text
                class="chart__tick"
                x={scaleX(tick)}
                y={HEIGHT - MARGIN.bottom + 22}
                text-anchor="middle"
              >
                {tickFormat.format(tick)}
              </text>
            </g>
          ))}

        <line
          class="chart__axis"
          x1={MARGIN.left}
          x2={WIDTH - MARGIN.right}
          y1={MARGIN.top + INNER_HEIGHT}
          y2={MARGIN.top + INNER_HEIGHT}
        />
        <line
          class="chart__axis"
          x1={MARGIN.left}
          x2={MARGIN.left}
          y1={MARGIN.top}
          y2={MARGIN.top + INNER_HEIGHT}
        />

        <text
          class="chart__axis-title"
          x={yLabelX}
          y={yLabelY}
          text-anchor="middle"
          transform={`rotate(-90 ${yLabelX} ${yLabelY})`}
        >
          {unit}
        </text>
        <text
          class="chart__axis-title"
          x={MARGIN.left + INNER_WIDTH / 2}
          y={HEIGHT - 8}
          text-anchor="middle"
        >
          Tiempo (s)
        </text>

        {series.map((item) => (
          <g key={item.id}>
            <path
              d={pathFor(item.points)}
              fill="none"
              stroke={item.color}
              stroke-width="2"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
              data-series={item.id}
              data-points={item.points.length}
            />
            {item.dots
              ? item.points.map((point) => (
                  <circle
                    key={`${item.id}-${point.x}`}
                    cx={scaleX(point.x)}
                    cy={scaleY(point.y)}
                    r="3.2"
                    fill="var(--color-paper-raised)"
                    stroke={item.color}
                    stroke-width="2"
                    vector-effect="non-scaling-stroke"
                    data-series={`${item.id}-dot`}
                  />
                ))
              : null}
          </g>
        ))}
      </svg>
    </figure>
  );
};

export default LineChart;
