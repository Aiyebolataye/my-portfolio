import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[13.5px] outline-none transition-colors placeholder:text-muted/60 focus:border-accent";

export const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-[11.5px] text-muted">{hint}</p> : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-line bg-surface ${className}`}>
      {children}
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl tracking-tight sm:text-[28px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-[13px] text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Banner({ kind, children }: { kind: "ok" | "error"; children: ReactNode }) {
  return (
    <p
      className={`rounded-xl border p-3 text-[12.5px] ${
        kind === "ok"
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-300"
      }`}
      role={kind === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
