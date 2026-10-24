const styles: Record<string, { dot: string; label: string; text: string }> = {
  live: {
    dot: "bg-emerald-500",
    label: "border-emerald-500/25 bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  "in-development": {
    dot: "bg-amber-500",
    label: "border-amber-500/25 bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
  },
  archived: {
    dot: "bg-zinc-400",
    label: "border-zinc-400/25 bg-zinc-400/10",
    text: "text-zinc-600 dark:text-zinc-400",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const style = styles[status] ?? styles.archived;
  const label =
    status === "in-development"
      ? "In development"
      : status === "live"
        ? "Live"
        : "Archived";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${style.label} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}
