import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { MediaManager } from "@/components/admin/media-manager";
import { ProjectForm } from "@/components/admin/project-form";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { deleteProject } from "@/lib/actions";
import { getProjectById, getProjectMedia } from "@/lib/data";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  const media = await getProjectMedia(project.id);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex cursor-pointer items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
        Projects
      </Link>

      <AdminPageHeader
        title={project.title}
        description={`Last updated ${project.updated_at ? new Date(project.updated_at).toLocaleDateString("en-GB") : "—"}`}
        action={
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-[12.5px] text-muted transition-colors hover:text-ink"
          >
            View page
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
          </Link>
        }
      />

      <ProjectForm project={project} />

      <MediaManager projectId={project.id} media={media} />

      <Card className="flex flex-wrap items-center justify-between gap-3 border-red-500/20 p-4">
        <div>
          <p className="text-[13px] font-medium">Delete this project</p>
          <p className="text-[11.5px] text-muted">
            Removes the project and its gallery from the site.
          </p>
        </div>
        <form action={deleteProject}>
          <input type="hidden" name="id" value={project.id} />
          <DeleteButton
            label="Delete project"
            confirmMessage={`Delete “${project.title}”? This cannot be undone.`}
          />
        </form>
      </Card>
    </div>
  );
}
