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
  const inputClasses = cn(
    "w-full rounded-lg border bg-surface-low px-3 py-2 text-sm text-foreground",
    "placeholder:text-muted-foreground/50",
    "border-border/40 focus:border-brand/40 focus:ring-1 focus:ring-brand/20 focus:outline-none",
    "transition-colors"
  );

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-brand ms-1">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1 text-xs text-muted-foreground">English</div>
          {type === "textarea" ? (
            <textarea
              name={nameEn}
              defaultValue={valueEn}
              required={required}
              rows={4}
              placeholder={placeholder}
              className={cn(inputClasses, "resize-y")}
            />
          ) : (
            <input
              name={nameEn}
              type="text"
              defaultValue={valueEn}
              required={required}
              placeholder={placeholder}
              className={inputClasses}
            />
          )}
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">العربية</div>
          {type === "textarea" ? (
            <textarea
              name={nameAr}
              defaultValue={valueAr}
              required={required}
              rows={4}
              dir="rtl"
              placeholder={placeholder}
              className={cn(inputClasses, "resize-y")}
            />
          ) : (
            <input
              name={nameAr}
              type="text"
              defaultValue={valueAr}
              required={required}
              dir="rtl"
              placeholder={placeholder}
              className={inputClasses}
            />
          )}
        </div>
      </div>
    </div>
  );
}
