import { formatRange } from "@/lib/format";
import type { Experience } from "@/lib/types";

export function ExperienceList({ items }: { items: Experience[] }) {
  return (
    <ol className="space-y-0">
      {items.map((item, index) => (
        <li
          key={item.id}
          className={`grid gap-2 border-t border-line py-7 sm:grid-cols-[160px_1fr] sm:gap-8 ${
            index === items.length - 1 ? "border-b" : ""
          }`}
        >
          <div className="pt-0.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {formatRange(item.start_date, item.end_date, item.current)}
            </p>
          </div>
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h3 className="text-[15px] font-medium tracking-tight">
                {item.role}
              </h3>
              <span className="text-[13px] text-muted">· {item.company}</span>
            </div>
            {item.location ? (
              <p className="mt-0.5 text-[12.5px] text-muted">{item.location}</p>
            ) : null}
            {item.description ? (
              <p className="mt-2.5 max-w-xl text-[13.5px] leading-relaxed text-muted">
                {item.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
