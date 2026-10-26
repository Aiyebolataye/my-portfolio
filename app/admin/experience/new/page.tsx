import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExperienceForm } from "@/components/admin/experience-form";
import { SetupNotice } from "@/components/admin/setup-notice";
import { AdminPageHeader } from "@/components/admin/ui";
import { getExperience } from "@/lib/data";

export default async function NewExperiencePage() {
  const experience = await getExperience();
  const nextSortOrder =
    experience.reduce((max, item) => Math.max(max, item.sort_order), 0) + 1;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/experience"
        className="inline-flex cursor-pointer items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
        Experience
      </Link>

      <AdminPageHeader title="Add role" />

      <ExperienceForm nextSortOrder={nextSortOrder} />
    </div>
  );
}
