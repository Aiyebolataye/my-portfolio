import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { SetupNotice } from "@/components/admin/setup-notice";
import { AdminPageHeader, Banner, Card } from "@/components/admin/ui";
import { StatusBadge } from "@/components/status-badge";
import { deleteProject } from "@/lib/actions";
import { getProjects } from "@/lib/data";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const [{ saved, deleted }, projects] = await Promise.all([
    searchParams,
    getProjects({ includeDrafts: true }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects"
        description="Create, edit, publish, and remove portfolio projects."
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-medium text-canvas transition-opacity hover:opacity-85"
          >
            <Plus className="h-4 w-4" strokeWidth={1.8} />
            New project
          </Link>
        }
      />

      <SetupNotice />

      {saved ? <Banner kind="ok">Project saved.</Banner> : null}
      {deleted ? <Banner kind="ok">Project deleted.</Banner> : null}

      <Card>
        {projects.length === 0 ? (
          <p className="px-5 py-10 text-center text-[12.5px] text-muted">
            No projects yet. Create your first one.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="cursor-pointer text-[13.5px] font-medium tracking-tight transition-colors hover:text-accent"
                    >
                      {project.title}
                    </Link>
                    <StatusBadge status={project.status} />
                    {!project.published ? (
                      <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">
                        Draft
                      </span>
                    ) : null}
                    {project.featured ? (
                      <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 font-mono text-[10.5px] text-muted">
                    /projects/{project.slug} · order {project.sort_order}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-line text-muted transition-colors hover:text-ink"
                    aria-label={`View ${project.title}`}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-[12px] text-muted transition-colors hover:text-ink"
                  >
                    Edit
                  </Link>
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <DeleteButton
                      compact
                      label="Delete"
                      confirmMessage={`Delete “${project.title}”? This cannot be undone.`}
                    />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
