import type {
  ActionParameterDefinition,
  ActionParameterValue,
} from "@/core/actions";

type ParameterFieldProps = {
  parameter: ActionParameterDefinition;
  value: ActionParameterValue;
  onChange: (value: ActionParameterValue) => void;
  disabled?: boolean;
  error?: string;
};

export function ParameterField({
  parameter,
  value,
  onChange,
  disabled = false,
  error,
}: ParameterFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <label
            htmlFor={parameter.key}
            className="block text-sm font-semibold text-slate-800"
          >
            {parameter.label}

            {parameter.required && (
              <span className="ml-1 text-rose-500">
                *
              </span>
            )}
          </label>

          {parameter.description && (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {parameter.description}
            </p>
          )}
        </div>

        {parameter.type === "number" &&
          parameter.unit && (
            <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
              {parameter.unit}
            </span>
          )}
      </div>

      {renderParameterControl(
        parameter,
        value,
        onChange,
        disabled,
      )}

      {error && (
        <p className="text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}

function renderParameterControl(
  parameter: ActionParameterDefinition,
  value: ActionParameterValue,
  onChange: (value: ActionParameterValue) => void,
  disabled: boolean,
) {
  switch (parameter.type) {
    case "number": {
      const numberValue =
        typeof value === "number"
          ? value
          : parameter.defaultValue;

      if (parameter.variant === "stepper") {
        return (
          <StepperParameterControl
            parameter={parameter}
            value={numberValue}
            onChange={onChange}
            disabled={disabled}
          />
        );
      }

      return (
        <NumberParameterControl
          parameter={parameter}
          value={numberValue}
          onChange={onChange}
          disabled={disabled}
        />
      );
    }

    case "string":
      return (
        <input
          id={parameter.key}
          type="text"
          value={
            typeof value === "string"
              ? value
              : parameter.defaultValue
          }
          placeholder={parameter.placeholder}
          disabled={disabled}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        />
      );

    case "boolean":
      return (
        <BooleanParameterControl
          parameterKey={parameter.key}
          checked={
            typeof value === "boolean"
              ? value
              : parameter.defaultValue
          }
          onChange={onChange}
          disabled={disabled}
        />
      );

    case "select":
      return (
        <select
          id={parameter.key}
          value={String(
            value ?? parameter.defaultValue,
          )}
          disabled={disabled}
          onChange={(event) => {
            const selectedOption =
              parameter.options.find(
                (option) =>
                  String(option.value) ===
                  event.target.value,
              );

            onChange(
              selectedOption?.value ??
                parameter.defaultValue,
            );
          }}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          {parameter.options.map((option) => (
            <option
              key={String(option.value)}
              value={String(option.value)}
            >
              {option.label}
            </option>
          ))}
        </select>
      );

    default: {
      const exhaustiveCheck: never = parameter;
      return exhaustiveCheck;
    }
  }
}

type NumberParameterControlProps = {
  parameter: Extract<
    ActionParameterDefinition,
    { type: "number" }
  >;
  value: number;
  onChange: (value: ActionParameterValue) => void;
  disabled: boolean;
};

function NumberParameterControl({
  parameter,
  value,
  onChange,
  disabled,
}: NumberParameterControlProps) {
  const min =
    parameter.min ?? Number.MIN_SAFE_INTEGER;

  const max =
    parameter.max ?? Number.MAX_SAFE_INTEGER;

  const step = parameter.step ?? 1;

  const updateValue = (nextValue: number) => {
    if (!Number.isFinite(nextValue)) {
      return;
    }

    const clampedValue = Math.min(
      max,
      Math.max(min, nextValue),
    );

    onChange(clampedValue);
  };

  const hasVisibleRange =
    parameter.min !== undefined &&
    parameter.max !== undefined;

  return (
    <div className="space-y-3">
      {hasVisibleRange && (
        <input
          id={parameter.key}
          type="range"
          min={parameter.min}
          max={parameter.max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(event) =>
            updateValue(
              Number(event.target.value),
            )
          }
          className="h-2 w-full cursor-pointer accent-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
        />
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || value <= min}
          onClick={() =>
            updateValue(value - step)
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`${parameter.label}を減らす`}
        >
          −
        </button>

        <div className="relative min-w-0 flex-1">
          <input
            type="number"
            min={parameter.min}
            max={parameter.max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(event) =>
              updateValue(
                Number(event.target.value),
              )
            }
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-center text-sm font-semibold text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          />

          {parameter.unit && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              {parameter.unit}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={disabled || value >= max}
          onClick={() =>
            updateValue(value + step)
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`${parameter.label}を増やす`}
        >
          ＋
        </button>
      </div>

      {hasVisibleRange && (
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>{parameter.min}</span>
          <span>{parameter.max}</span>
        </div>
      )}
    </div>
  );
}

type StepperParameterControlProps = {
  parameter: Extract<
    ActionParameterDefinition,
    { type: "number" }
  >;
  value: number;
  onChange: (value: ActionParameterValue) => void;
  disabled: boolean;
};

function StepperParameterControl({
  parameter,
  value,
  onChange,
  disabled,
}: StepperParameterControlProps) {
  const min =
    parameter.min ?? Number.MIN_SAFE_INTEGER;

  const max =
    parameter.max ?? Number.MAX_SAFE_INTEGER;

  const step = parameter.step ?? 1;

  const updateValue = (nextValue: number) => {
    if (!Number.isFinite(nextValue)) {
      return;
    }

    const clampedValue = Math.min(
      max,
      Math.max(min, nextValue),
    );

    onChange(clampedValue);
  };

  return (
    <div className="inline-flex h-11 items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() =>
          updateValue(value - step)
        }
        className="flex h-full w-11 items-center justify-center border-r border-slate-200 text-lg font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
        aria-label={`${parameter.label}を減らす`}
      >
        −
      </button>

      <input
        id={parameter.key}
        type="number"
        min={parameter.min}
        max={parameter.max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          updateValue(
            Number(event.target.value),
          )
        }
        className="h-full w-20 border-0 bg-white px-2 text-center text-base font-bold text-slate-800 outline-none [appearance:textfield] focus:bg-violet-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() =>
          updateValue(value + step)
        }
        className="flex h-full w-11 items-center justify-center border-l border-slate-200 text-lg font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
        aria-label={`${parameter.label}を増やす`}
      >
        ＋
      </button>
    </div>
  );
}

type BooleanParameterControlProps = {
  parameterKey: string;
  checked: boolean;
  onChange: (value: ActionParameterValue) => void;
  disabled: boolean;
};

function BooleanParameterControl({
  parameterKey,
  checked,
  onChange,
  disabled,
}: BooleanParameterControlProps) {
  return (
    <label
      htmlFor={parameterKey}
      className={[
        "flex min-h-10 items-center justify-between rounded-lg border px-3 transition",
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-60"
          : "cursor-pointer border-slate-200 bg-white hover:border-violet-300",
      ].join(" ")}
    >
      <span className="text-sm font-medium text-slate-600">
        {checked ? "有効" : "無効"}
      </span>

      <span
        className={[
          "relative h-6 w-11 rounded-full transition",
          checked
            ? "bg-violet-600"
            : "bg-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition",
            checked ? "left-6" : "left-1",
          ].join(" ")}
        />
      </span>

      <input
        id={parameterKey}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="sr-only"
      />
    </label>
  );
}