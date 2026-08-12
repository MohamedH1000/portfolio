"use client";

import { cn } from "@/lib/utils";

interface BilingualInputProps {
  label: string;
  nameEn: string;
  nameAr: string;
  valueEn?: string;
  valueAr?: string;
  required?: boolean;
  type?: "text" | "textarea";
  placeholder?: string;
}

export function BilingualInput({
  label,
  nameEn,
  nameAr,
  valueEn = "",
  valueAr = "",
  required = false,
  type = "text",
  placeholder,
}: BilingualInputProps) {
  const localeChip =
    "inline-flex items-center rounded-md bg-surface-high/70 px-1.5 py-0.5 text-[0.6875rem] font-medium tracking-wide text-muted-foreground ring-1 ring-[var(--hairline)]";

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
              defaultValue={valueEn}
              required={required}
              rows={4}
              placeholder={placeholder}
              className={cn("field resize-y")}
            />
          ) : (
            <input
              name={nameEn}
              type="text"
              defaultValue={valueEn}
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
              defaultValue={valueAr}
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
              defaultValue={valueAr}
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
