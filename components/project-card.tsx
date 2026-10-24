import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GitBranch } from "lucide-react";
import type { Project } from "@/lib/types";
import { StatusBadge } from "./status-badge";

export function ProjectVisual({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  if (project.cover_image_url) {
    return (
      <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
        <Image
          src={project.cover_image_url}
          alt={`${project.title} preview`}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-surface-2 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 grid-lines opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent-soft),transparent_58%)]" />
      <div className="absolute inset-0 flex items-end justify-between p-5 sm:p-6">
        <span className="font-display text-[clamp(1.6rem,4.4vw,2.9rem)] leading-none tracking-tight text-ink/85">
          {project.title}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {String(project.sort_order).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-ink/25"
    >
      <ProjectVisual
        project={project}
        className="aspect-[16/10] w-full border-b border-line"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl tracking-tight">{project.title}</h3>
          <ArrowUpRight
            className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
            strokeWidth={1.8}
          />
        </div>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-muted">
          {project.tagline}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {(project.tech_stack ?? []).slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-line px-2 py-0.5 font-mono text-[10.5px] text-muted"
            >
              {tech}
            </span>
          ))}
          {(project.tech_stack?.length ?? 0) > 4 ? (
            <span className="font-mono text-[10.5px] text-muted">
              +{(project.tech_stack?.length ?? 0) - 4}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <StatusBadge status={project.status} />
          <div className="flex items-center gap-2">
            {project.repo_url ? (
              <span className="grid h-7 w-7 place-items-center rounded-full border border-line text-muted">
                <GitBranch className="h-3.5 w-3.5" strokeWidth={1.8} />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
