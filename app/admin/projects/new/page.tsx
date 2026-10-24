import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/project-form";
import { SetupNotice } from "@/components/admin/setup-notice";
import { AdminPageHeader } from "@/components/admin/ui";
import { getProjects } from "@/lib/data";

export default async function NewProjectPage() {
  const projects = await getProjects({ includeDrafts: true });
  const nextSortOrder =
    projects.reduce((max, project) => Math.max(max, project.sort_order), 0) + 1;

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
        title="New project"
        description="Add the story, links, and media that make this piece of work legible."
      />

      <SetupNotice />

      <ProjectForm nextSortOrder={nextSortOrder} />
    </div>
  );
}
