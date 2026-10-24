export function SectionHeading({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
          {index}
        </span>
        <span className="h-px w-8 bg-line" />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
          {label}
        </span>
      </div>
      <h2 className="mt-5 font-display text-3xl leading-[1.1] tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
