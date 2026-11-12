import {
  parseDecimal,
  validateParams,
  type RocketParams,
  type ValidationIssue,
} from './rocket';

/** Visible metadata for each editable simulation parameter. */
export interface ParamField {
  key: keyof RocketParams;
  label: string;
  unit: string;
  group: 'model' | 'simulation';
}

export const PARAM_FIELDS: readonly ParamField[] = [
  { key: 'm', label: 'Masa', unit: 'kg', group: 'model' },
  { key: 'T', label: 'Empuje', unit: 'N', group: 'model' },
  { key: 'g', label: 'Gravedad', unit: 'm/s²', group: 'model' },
  {
    key: 'k',
    label: 'Coeficiente de resistencia',
    unit: 'kg/s',
    group: 'model',
  },
  { key: 'v0', label: 'Velocidad inicial', unit: 'm/s', group: 'model' },
  { key: 'y0', label: 'Altura inicial', unit: 'm', group: 'model' },
  {
    key: 'tEnd',
    label: 'Tiempo de simulación',
    unit: 's',
    group: 'simulation',
  },
  { key: 'h', label: 'Paso de Euler', unit: 's', group: 'simulation' },
] as const;

/** Raw text kept in the form, one string per parameter. */
export type Draft = Record<keyof RocketParams, string>;

/** Render a parameter value for an input: decimal comma, no thousands. */
export function formatInput(n: number): string {
  return String(n).replace('.', ',');
}

/** Build the editable form state from a set of numeric parameters. */
export function draftFromParams(params: RocketParams): Draft {
  const draft = {} as Draft;
  for (const field of PARAM_FIELDS) {
    draft[field.key] = formatInput(params[field.key]);
  }
  return draft;
}

/**
 * Parse the form state and validate it against the model rules.
 * Values that cannot be parsed become `NaN` and receive a local message,
 * so `validateParams` is not duplicated for the same field.
 */
export function parseDraft(draft: Draft): {
  params: RocketParams;
  issues: ValidationIssue[];
} {
  const params = {} as RocketParams;
  const issues: ValidationIssue[] = [];
  const invalid = new Set<keyof RocketParams>();

  for (const field of PARAM_FIELDS) {
    const value = parseDecimal(draft[field.key]);
    params[field.key] = value;
    if (Number.isNaN(value)) {
      invalid.add(field.key);
      issues.push({ field: field.key, message: 'Ingresa un número válido.' });
    }
  }

  for (const issue of validateParams(params)) {
    if (!invalid.has(issue.field)) issues.push(issue);
  }

  return { params, issues };
}
