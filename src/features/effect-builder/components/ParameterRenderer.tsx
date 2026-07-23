import type {
  ActionDefinition,
  ActionParameterValue,
  ActionParameterValues,
} from "@/core/actions";

import { ParameterField } from "./ParameterField";

type ParameterRendererProps = {
  action: ActionDefinition;

  values: ActionParameterValues;

  onChange: (
    key: string,
    value: ActionParameterValue,
  ) => void;

  errors?: Record<string, string>;

  disabled?: boolean;
};

export function ParameterRenderer({
  action,
  values,
  onChange,
  errors,
  disabled = false,
}: ParameterRendererProps) {
  const parameters = action.parameters ?? [];

  if (parameters.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center">
        <p className="text-sm text-slate-500">
          このActionは設定項目がありません。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {parameters.map((parameter) => (
        <ParameterField
          key={parameter.key}
          parameter={parameter}
          value={values[parameter.key]}
          onChange={(value) =>
            onChange(parameter.key, value)
          }
          disabled={disabled}
          error={errors?.[parameter.key]}
        />
      ))}
    </div>
  );
}