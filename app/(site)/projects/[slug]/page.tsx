import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, GitBranch } from "lucide-react";
import { ProjectVisual } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { ViewTracker } from "@/components/view-tracker";
import { getProject, getProjectMedia } from "@/lib/data";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.tagline ?? undefined,
    openGraph: {
      title: project.title,
      description: project.tagline ?? undefined,
      images: project.cover_image_url ? [project.cover_image_url] : undefined,
    },
  };
}

function youtubeEmbed(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const media = await getProjectMedia(project.id);
  const paragraphs = (project.description ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <ViewTracker path={`/projects/${slug}`} />

      <article className="mx-auto max-w-5xl px-5 pt-28 sm:px-8 sm:pt-32">
        <Link
          href="/#work"
          className="inline-flex cursor-pointer items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          All work
        </Link>

        <Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
              {String(project.sort_order).padStart(2, "0")}
            </span>
          </div>

          <h1 className="mt-5 font-display text-[clamp(2.4rem,7vw,4.6rem)] leading-[0.98] tracking-[-0.03em]">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[clamp(1rem,2vw,1.2rem)] leading-relaxed text-muted">
            {project.tagline}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            {(project.tech_stack ?? []).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] text-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.live_url ? (
              <Link
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-canvas transition-opacity hover:opacity-85"
              >
                View live product
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            ) : null}
            {project.repo_url ? (
              <Link
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-[13px] font-medium transition-colors hover:border-ink/30"
              >
                <GitBranch className="h-4 w-4" strokeWidth={1.8} />
                Source
              </Link>
            ) : null}
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-line">
            {project.cover_image_url ? (
              <div className="relative aspect-[16/9] w-full bg-surface-2">
                <Image
                  src={project.cover_image_url}
                  alt={`${project.title} cover`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <ProjectVisual
                project={project}
                className="aspect-[16/9] w-full [&>div:last-child]:p-8"
              />
            )}
          </div>
        </Reveal>

        {paragraphs.length > 0 ? (
          <Reveal className="mt-14 grid gap-8 md:grid-cols-[180px_1fr]">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
              Overview
            </p>
            <div className="prose-editorial max-w-2xl text-[15px] leading-[1.8] text-ink/80">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        ) : null}

        {media.length > 0 ? (
          <Reveal className="mt-16">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
                Gallery
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {media.map((item) => {
                const embed = item.type === "video" ? youtubeEmbed(item.url) : null;

                return (
                  <figure
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-line bg-surface"
                  >
                    {item.type === "video" ? (
                      embed ? (
                        <div className="aspect-video w-full">
                          <iframe
                            src={embed}
                            title={item.caption ?? `${project.title} video`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full"
                          />
                        </div>
                      ) : (
                        <video
                          src={item.url}
                          controls
                          className="aspect-video w-full bg-black object-cover"
                        />
                      )
                    ) : (
                      <div className="relative aspect-[4/3] w-full bg-surface-2">
                        <Image
                          src={item.url}
                          alt={item.caption ?? `${project.title} image`}
                          fill
                          sizes="(min-width: 640px) 480px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    {item.caption ? (
                      <figcaption className="border-t border-line px-4 py-2.5 text-[12.5px] text-muted">
                        {item.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                );
              })}
            </div>
          </Reveal>
        ) : null}

        <div className="mt-20 border-t border-line py-12">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="font-display text-2xl tracking-tight">
              Want something like this?
            </p>
            <Link
              href="/#contact"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-canvas transition-opacity hover:opacity-85"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
