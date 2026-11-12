import {
  COMPARISON_STEPS,
  parseDecimal,
  type RocketParams,
  type ValidationIssue,
} from '../lib/rocket';
import { formatInput, PARAM_FIELDS, type Draft } from '../lib/paramFields';
import NumberField from './NumberField';

interface ParamPanelProps {
  draft: Draft;
  issues: ValidationIssue[];
  pending: boolean;
  onValueChange: (key: keyof RocketParams, value: string) => void;
  onCalculate: () => void;
  onReset: () => void;
  onPreset: (step: number) => void;
}

const GROUPS = [
  {
    id: 'model',
    title: 'Modelo',
    fields: PARAM_FIELDS.filter((field) => field.group === 'model'),
  },
  {
    id: 'simulation',
    title: 'Simulación',
    fields: PARAM_FIELDS.filter((field) => field.group === 'simulation'),
  },
] as const;

const ParamPanel = ({
  draft,
  issues,
  pending,
  onValueChange,
  onCalculate,
  onReset,
  onPreset,
}: ParamPanelProps) => {
  const currentStep = parseDecimal(draft.h);

  return (
    <form
      class="params"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
    >
      {GROUPS.map((group) => (
        <fieldset class="params__group" key={group.id}>
          <legend class="params__legend">{group.title}</legend>
          <div class="params__grid">
            {group.fields.map((field) => (
              <NumberField
                key={field.key}
                id={`param-${field.key}`}
                label={field.label}
                unit={field.unit}
                value={draft[field.key]}
                error={issues.find((issue) => issue.field === field.key)?.message}
                onValueChange={(value) => onValueChange(field.key, value)}
              />
            ))}
          </div>
        </fieldset>
      ))}

      <div class="params__presets">
        <span class="params__presets-label" id="presets-label">
          Paso de Euler rápido
        </span>
        <div class="preset-row" role="group" aria-labelledby="presets-label">
          {COMPARISON_STEPS.map((step) => (
            <button
              key={step}
              type="button"
              class="preset"
              aria-label={`Paso de ${formatInput(step)} s`}
              aria-pressed={currentStep === step}
              onClick={() => onPreset(step)}
            >
              {formatInput(step)} s
            </button>
          ))}
        </div>
      </div>

      <div class="params__actions">
        <button type="submit" class="button button--primary">
          Calcular trayectoria
        </button>
        <button type="button" class="button button--quiet" onClick={onReset}>
          Restablecer datos
        </button>
      </div>

      <p
        class="params__status"
        role="status"
        aria-live="polite"
        data-state={pending ? 'pending' : 'applied'}
      >
        {pending ? 'Cambios sin aplicar' : 'Resultados al día'}
      </p>
    </form>
  );
};

export default ParamPanel;
