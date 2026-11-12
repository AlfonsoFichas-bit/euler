interface NumberFieldProps {
  id: string;
  label: string;
  unit: string;
  value: string;
  error?: string;
  onValueChange: (value: string) => void;
}

const NumberField = ({
  id,
  label,
  unit,
  value,
  error,
  onValueChange,
}: NumberFieldProps) => {
  const describedBy = error ? `${id}-unit ${id}-error` : `${id}-unit`;

  return (
    <div class="field">
      <label class="field__label" for={id}>
        {label}
      </label>
      <div class="field__control">
        <input
          id={id}
          class="field__input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellcheck={false}
          value={value}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          onInput={(event) => onValueChange(event.currentTarget.value)}
        />
        <span class="field__unit" id={`${id}-unit`}>
          {unit}
        </span>
      </div>
      {error ? (
        <p class="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default NumberField;
