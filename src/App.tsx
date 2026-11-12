import { useMemo, useState } from 'preact/hooks';
import './App.css';
import ErrorTable from './components/ErrorTable';
import Formula from './components/Formula';
import IterationTable from './components/IterationTable';
import LineChart, { type ChartSeries } from './components/LineChart';
import ParamPanel from './components/ParamPanel';
import ResultCards from './components/ResultCards';
import SectionHeader from './components/SectionHeader';
import {
  draftFromParams,
  formatInput,
  parseDraft,
  type Draft,
} from './lib/paramFields';
import {
  analytical,
  compareSteps,
  DEFAULT_PARAMS,
  simulate,
  type RocketParams,
  type ValidationIssue,
} from './lib/rocket';

const App = () => {
  const [draft, setDraft] = useState<Draft>(() => draftFromParams(DEFAULT_PARAMS));
  const [applied, setApplied] = useState<RocketParams>({ ...DEFAULT_PARAMS });
  const [pending, setPending] = useState(false);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  const simulation = useMemo(() => simulate(applied), [applied]);
  const comparison = useMemo(() => compareSteps(applied), [applied]);

  const chartData = useMemo(() => {
    const samples = 160;
    const exact = Array.from({ length: samples + 1 }, (_, index) => {
      const t = (applied.tEnd * index) / samples;
      return { t, ...analytical(applied, t) };
    });

    const velocity: ChartSeries[] = [
      {
        id: 'euler',
        label: 'Euler',
        color: 'var(--color-signal)',
        points: simulation.iterations.map((row) => ({ x: row.t, y: row.v })),
        dots: true,
      },
      {
        id: 'analitica',
        label: 'Analítica',
        color: 'var(--color-instrument)',
        points: exact.map((point) => ({ x: point.t, y: point.v })),
      },
    ];

    const height: ChartSeries[] = [
      {
        id: 'euler',
        label: 'Euler',
        color: 'var(--color-signal)',
        points: simulation.iterations.map((row) => ({ x: row.t, y: row.y })),
        dots: true,
      },
      {
        id: 'analitica',
        label: 'Analítica',
        color: 'var(--color-instrument)',
        points: exact.map((point) => ({ x: point.t, y: point.y })),
      },
    ];

    return { velocity, height };
  }, [applied, simulation]);

  const applyDraft = (next: Draft) => {
    const parsed = parseDraft(next);
    if (parsed.issues.length > 0) {
      setIssues(parsed.issues);
      setPending(true);
      return;
    }
    setIssues([]);
    setApplied(parsed.params);
    setPending(false);
  };

  const handleValueChange = (key: keyof RocketParams, value: string) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setPending(true);
    setIssues((previous) => previous.filter((issue) => issue.field !== key));
  };

  const handleCalculate = () => {
    applyDraft(draft);
  };

  const handleReset = () => {
    const next = draftFromParams(DEFAULT_PARAMS);
    setDraft(next);
    applyDraft(next);
  };

  const handlePreset = (step: number) => {
    const next = { ...draft, h: formatInput(step) };
    setDraft(next);
    applyDraft(next);
  };

  return (
    <div class="flex min-h-screen flex-col bg-paper">
      <header class="border-b-2 border-ink">
        <div class="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] pt-10 pb-7 sm:pt-14">
        <h1 class="mt-5 max-w-[20ch] font-display text-[length:var(--step-4)] leading-[var(--leading-tight)] tracking-[-0.012em] text-ink">
            Trayectoria de ascenso
          </h1>
          <p class="mt-4 max-w-[var(--measure)] text-[length:var(--step-1)] text-ink-soft">
            Cohete experimental, de 0 a 20 segundos, con el método de Euler.
          </p>
        </div>
      </header>

      <main class="mx-auto w-full max-w-[var(--container)] flex-1 px-[var(--gutter)] pt-10 pb-20">
        <section
          id="parametros"
          aria-labelledby="parametros-title"
          class="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(19rem,0.8fr)] lg:items-start"
        >
          <div class="panel">
            <SectionHeader
              index="01"
              title="Parámetros de la simulación"
              titleId="parametros-title"
              lead="Ajusta el modelo y el paso; la trayectoria se recalcula al confirmar."
            />
            <ParamPanel
              draft={draft}
              issues={issues}
              pending={pending}
              onValueChange={handleValueChange}
              onCalculate={handleCalculate}
              onReset={handleReset}
              onPreset={handlePreset}
            />
          </div>

          <aside class="min-w-0 lg:sticky lg:top-6" aria-labelledby="modelo-title">
            <h2
              id="modelo-title"
              class="font-display text-[length:var(--step-1)] text-ink"
            >
              Modelo matemático
            </h2>
            <p class="mt-2 max-w-[var(--measure)] text-sm text-ink-soft">
              Segunda ley de Newton con empuje, peso y resistencia lineal.
            </p>
            <div class="formula-block mt-4">
              <Formula tex="\begin{aligned} \frac{dv}{dt} &= \frac{T}{m} - g - \frac{k}{m}v \\[4pt] \frac{dy}{dt} &= v \end{aligned}" />
              <Formula tex="v(0)=v_0,\qquad y(0)=y_0" />
            </div>
          </aside>
        </section>

        <section
          id="resultados"
          aria-labelledby="resultados-title"
          class="mt-16"
        >
          <SectionHeader
            index="02"
            title="Resultados"
            titleId="resultados-title"
            lead="Valores al tiempo final y comparación con la solución exacta."
          />
          <p class="mb-6 font-mono text-sm text-ink-faint">
            Simulación aplicada con h = {formatInput(applied.h)} s y{' '}
            {simulation.iterations.length} filas.
          </p>

          <ResultCards simulation={simulation} />

          <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
            <div class="min-w-0">
              <h3 class="font-display text-[length:var(--step-1)] text-ink">
                Iteraciones
              </h3>
              <div class="mt-4">
                <IterationTable
                  iterations={simulation.iterations}
                  step={applied.h}
                />
              </div>
            </div>

            <div class="min-w-0">
              <h3 class="font-display text-[length:var(--step-1)] text-ink">
                Solución analítica
              </h3>
              <div class="formula-block mt-4">
                <Formula tex="v(t)=\frac{A}{B}+\left(v_0-\frac{A}{B}\right)e^{-Bt}" />
                <Formula tex="y(t)=y_0+\frac{A}{B}t+\frac{v_0-A/B}{B}\left(1-e^{-Bt}\right)" />
                <Formula tex="A=\frac{T}{m}-g,\qquad B=\frac{k}{m}" />
              </div>
            </div>
          </div>
        </section>

        <section id="graficas" aria-labelledby="graficas-title" class="mt-16">
          <SectionHeader
            index="03"
            title="Gráficas comparativas"
            titleId="graficas-title"
            lead={`Euler frente a la solución exacta durante los primeros ${formatInput(
              applied.tEnd,
            )} segundos.`}
          />
          <div class="grid gap-10">
            <LineChart
              id="chart-velocidad"
              caption="Velocidad del cohete"
              unit="m/s"
              series={chartData.velocity}
              xMax={applied.tEnd}
            />
            <LineChart
              id="chart-altura"
              caption="Altura del cohete"
              unit="m"
              series={chartData.height}
              xMax={applied.tEnd}
            />
          </div>
        </section>

        <section id="error" aria-labelledby="error-title" class="mt-16">
          <SectionHeader
            index="04"
            title="Error numérico"
            titleId="error-title"
            lead="Disminuir el paso acerca la aproximación a la solución exacta."
          />
          <ErrorTable rows={comparison} />
        </section>
      </main>

      <footer class="border-t-2 border-ink">
        <div class="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] py-8 text-sm text-ink-faint">
          <p>
            Métodos Numéricos. Misión espacial 1962. Datos ficticios para el
            ejercicio del método de Euler.
          </p>
          <p class="mt-2">
            Modelo didáctico de ascenso vertical con masa, empuje, gravedad y
            resistencia constantes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
