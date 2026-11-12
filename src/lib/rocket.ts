// ---------- Types ----------

/** Parameters for the rocket simulation. */
export interface RocketParams {
  /** Mass of the rocket (kg). */
  m: number;
  /** Engine thrust (N). */
  T: number;
  /** Gravitational acceleration (m/s²). */
  g: number;
  /** Linear drag coefficient (kg/s). */
  k: number;
  /** Initial velocity (m/s). */
  v0: number;
  /** Initial height (m). */
  y0: number;
  /** End time of the simulation (s). */
  tEnd: number;
  /** Euler step size (s). */
  h: number;
}

/** A single row of the Euler iteration table. */
export interface Iteration {
  /** Step index. */
  n: number;
  /** Time (s). */
  t: number;
  /** Velocity (m/s). */
  v: number;
  /** Height (m). */
  y: number;
}

/** Exact (analytical) values at a given time. */
export interface ExactValues {
  /** Velocity (m/s). */
  v: number;
  /** Height (m). */
  y: number;
}

/** Full simulation result. */
export interface Simulation {
  params: RocketParams;
  iterations: Iteration[];
  exactAtEnd: ExactValues;
  errors: { v: number; y: number };
}

/** A single row in the step-comparison table. */
export interface StepComparison {
  /** Step size label, or `'exact'` for the reference row. */
  h: number | 'exact';
  v: number;
  y: number;
  vError: number;
  yError: number;
}

/** A validation problem on a specific field. */
export interface ValidationIssue {
  field: keyof RocketParams;
  message: string;
}

// ---------- Default parameters ----------

export const DEFAULT_PARAMS: Readonly<RocketParams> = {
  m: 1000,
  T: 15000,
  g: 9.81,
  k: 100,
  v0: 0,
  y0: 0,
  tEnd: 20,
  h: 2,
};

// ---------- Validation ----------

/**
 * Validate simulation parameters.
 * Returns an empty array when everything is valid.
 */
export function validateParams(p: RocketParams): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!Number.isFinite(p.m)) {
    issues.push({ field: 'm', message: 'La masa debe ser un número finito.' });
  } else if (p.m <= 0) {
    issues.push({ field: 'm', message: 'La masa debe ser mayor que cero.' });
  }

  if (!Number.isFinite(p.T)) {
    issues.push({
      field: 'T',
      message: 'El empuje debe ser un número finito.',
    });
  }

  if (!Number.isFinite(p.g)) {
    issues.push({
      field: 'g',
      message: 'La gravedad debe ser un número finito.',
    });
  }

  if (!Number.isFinite(p.k)) {
    issues.push({
      field: 'k',
      message: 'El coeficiente de resistencia debe ser un número finito.',
    });
  }

  if (!Number.isFinite(p.v0)) {
    issues.push({
      field: 'v0',
      message: 'La velocidad inicial debe ser un número finito.',
    });
  }

  if (!Number.isFinite(p.y0)) {
    issues.push({
      field: 'y0',
      message: 'La altura inicial debe ser un número finito.',
    });
  }

  if (!Number.isFinite(p.tEnd)) {
    issues.push({
      field: 'tEnd',
      message: 'El tiempo final debe ser un número finito.',
    });
  } else if (p.tEnd <= 0) {
    issues.push({
      field: 'tEnd',
      message: 'El tiempo final debe ser mayor que cero.',
    });
  }

  if (!Number.isFinite(p.h)) {
    issues.push({
      field: 'h',
      message: 'El paso debe ser un número finito.',
    });
  } else if (p.h <= 0) {
    issues.push({
      field: 'h',
      message: 'El paso debe ser mayor que cero.',
    });
  } else if (p.tEnd > 0 && p.h > 0) {
    const steps = p.tEnd / p.h;
    if (Math.abs(steps - Math.round(steps)) > 1e-9) {
      issues.push({
        field: 'h',
        message:
          'El paso debe dividir exactamente el tiempo de simulación.',
      });
    }
  }

  return issues;
}

// ---------- Euler integration ----------

/**
 * Run the Euler method on the rocket model.
 * Assumes parameters have been validated.
 */
export function simulateEuler(p: RocketParams): Iteration[] {
  const numSteps = Math.round(p.tEnd / p.h);
  const iterations: Iteration[] = [];

  let v = p.v0;
  let y = p.y0;

  iterations.push({ n: 0, t: 0, v, y });

  for (let i = 1; i <= numSteps; i++) {
    const dv = p.T / p.m - p.g - (p.k / p.m) * v;
    const nextV = v + p.h * dv;
    const nextY = y + p.h * v; // uses velocity at START of interval
    v = nextV;
    y = nextY;
    iterations.push({ n: i, t: i * p.h, v, y });
  }

  return iterations;
}

// ---------- Analytical solution ----------

/**
 * Evaluate the closed-form analytical solution at time `t`.
 *
 * With A = T/m − g and B = k/m:
 *   v(t) = A/B + (v0 − A/B)·e^(−Bt)
 *   y(t) = y0 + (A/B)·t + ((v0 − A/B)/B)·(1 − e^(−Bt))
 */
export function analytical(p: RocketParams, t: number): ExactValues {
  const A = p.T / p.m - p.g; // net specific force at v=0
  const B = p.k / p.m; // drag rate

  // Without drag the closed form is the limit B → 0:
  //   v(t) = v0 + A·t,  y(t) = y0 + v0·t + A·t²/2
  if (B === 0) {
    return {
      v: p.v0 + A * t,
      y: p.y0 + p.v0 * t + 0.5 * A * t * t,
    };
  }

  const ratio = A / B; // terminal velocity
  const expBt = Math.exp(-B * t);
  const v = ratio + (p.v0 - ratio) * expBt;
  const y = p.y0 + ratio * t + ((p.v0 - ratio) / B) * (1 - expBt);
  return { v, y };
}

/**
 * Build a full Simulation: Euler iterations + exact values + errors at tEnd.
 */
export function simulate(p: RocketParams): Simulation {
  const iterations = simulateEuler(p);
  const exactAtEnd = analytical(p, p.tEnd);
  const last = iterations[iterations.length - 1];
  return {
    params: p,
    iterations,
    exactAtEnd,
    errors: {
      v: Math.abs(exactAtEnd.v - last.v),
      y: Math.abs(exactAtEnd.y - last.y),
    },
  };
}

// ---------- Step comparison ----------

/** Steps used for convergence comparison. */
const COMPARISON_STEPS = [2, 1, 0.5, 0.25] as const;

/**
 * Compare Euler results across multiple step sizes and include an exact row.
 * Steps that do not evenly divide `tEnd` are omitted.
 */
export function compareSteps(p: RocketParams): StepComparison[] {
  const exact = analytical(p, p.tEnd);
  const rows: StepComparison[] = [];

  for (const step of COMPARISON_STEPS) {
    const ratio = p.tEnd / step;
    if (Math.abs(ratio - Math.round(ratio)) > 1e-9) {
      continue; // skip non-applicable step
    }
    const sim = simulateEuler({ ...p, h: step });
    const last = sim[sim.length - 1];
    rows.push({
      h: step,
      v: last.v,
      y: last.y,
      vError: Math.abs(exact.v - last.v),
      yError: Math.abs(exact.y - last.y),
    });
  }

  rows.push({
    h: 'exact',
    v: exact.v,
    y: exact.y,
    vError: 0,
    yError: 0,
  });

  return rows;
}

// ---------- Number formatting ----------

const esFormatter = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

/**
 * Format a number to 4 decimal places using comma as the decimal separator.
 */
export function formatNumber(n: number): string {
  return esFormatter.format(n);
}

/**
 * Parse a numeric string that may use comma **or** period as the decimal
 * separator.  Rejects strings with more than one decimal separator (e.g.
 * `"1.000"` with a thousands-style dot when it also contains a comma, or
 * multiple commas/dots).
 *
 * Returns `NaN` when the input is not a valid number.
 */
export function parseDecimal(input: string): number {
  const trimmed = input.trim();
  if (trimmed === '') return NaN;

  const commas = (trimmed.match(/,/g) || []).length;
  const dots = (trimmed.match(/\./g) || []).length;

  // More than one of the same separator → invalid (e.g. "1.000.000" or "1,0,0")
  if (commas > 1 || dots > 1) return NaN;

  // Both separators present → invalid (ambiguous, e.g. "1.000,5")
  if (commas > 0 && dots > 0) return NaN;

  // A lone dot followed by exactly three digits is the Spanish thousands
  // format (e.g. "1.000" = 1000), not a decimal value; reject it so it is
  // never silently read as 1. Thousands separators are not supported.
  if (dots === 1 && /\.\d{3}$/.test(trimmed)) return NaN;

  // Replace comma with dot for standard parseFloat
  const normalized = trimmed.replace(',', '.');
  const result = Number(normalized);
  return Number.isFinite(result) ? result : NaN;
}
