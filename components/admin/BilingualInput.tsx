"use client";

import { cn } from "@/lib/utils";

interface BilingualInputProps {
  label: string;
  nameEn: string;
  nameAr: string;
  valueEn?: string;
  valueAr?: string;
  /** Supply to make the English field controlled. Omit to keep it uncontrolled (read via FormData on submit). */
  onChangeEn?: (value: string) => void;
  /** Supply to make the Arabic field controlled. Omit to keep it uncontrolled (read via FormData on submit). */
  onChangeAr?: (value: string) => void;
  required?: boolean;
  type?: "text" | "textarea";
  placeholder?: string;
}

type FieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

type FieldValueProps =
  | { value: string; onChange: (event: FieldChangeEvent) => void }
  | { defaultValue: string };

function valueProps(value: string, onChange?: (value: string) => void): FieldValueProps {
  if (!onChange) return { defaultValue: value };
  return { value, onChange: (event: FieldChangeEvent) => onChange(event.target.value) };
}

export function BilingualInput({
  label,
  nameEn,
  nameAr,
  valueEn = "",
  valueAr = "",
  onChangeEn,
  onChangeAr,
  required = false,
  type = "text",
  placeholder,
}: BilingualInputProps) {
  const localeChip =
    "inline-flex items-center rounded-md bg-surface-high/70 px-1.5 py-0.5 text-[0.6875rem] font-medium tracking-wide text-muted-foreground ring-1 ring-[var(--hairline)]";

  const enProps = valueProps(valueEn, onChangeEn);
  const arProps = valueProps(valueAr, onChangeAr);

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1 text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="text-brand" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <span className={localeChip}>EN</span>
          {type === "textarea" ? (
            <textarea
              name={nameEn}
              {...enProps}
              required={required}
              rows={4}
              placeholder={placeholder}
              className={cn("field resize-y")}
            />
          ) : (
            <input
              name={nameEn}
              type="text"
              {...enProps}
              required={required}
              placeholder={placeholder}
              className="field"
            />
          )}
        </div>

        <div className="space-y-1.5">
          <span className={localeChip}>العربية</span>
          {type === "textarea" ? (
            <textarea
              name={nameAr}
              {...arProps}
              required={required}
              rows={4}
              dir="rtl"
              placeholder={placeholder}
              className={cn("field resize-y")}
            />
          ) : (
            <input
              name={nameAr}
              type="text"
              {...arProps}
              required={required}
              dir="rtl"
              placeholder={placeholder}
              className="field"
            />
          )}
        </div>
      </div>
    </div>
  );
}
