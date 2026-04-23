import type { ReactNode } from "react";
import type { FieldError, FieldErrors, FieldValues, Path } from "react-hook-form";
import { cx } from "../cx";

type Props<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label: string;
  errors: FieldErrors<TFieldValues>;
  hint?: string;
  children: (opts: { id: string; hasError: boolean; error?: FieldError }) => ReactNode;
};

export function FormField<TFieldValues extends FieldValues>({
  name,
  label,
  errors,
  hint,
  children,
}: Props<TFieldValues>) {
  const id = String(name);
  const error = errors[name] as FieldError | undefined;
  const hasError = Boolean(error?.message);

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-300">
        {label}
      </label>
      {children({ id, hasError, error })}
      {hint && !hasError && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
      {hasError && (
        <p className={cx("text-sm font-medium", "text-red-500")} role="alert">
          {String(error?.message)}
        </p>
      )}
    </div>
  );
}

