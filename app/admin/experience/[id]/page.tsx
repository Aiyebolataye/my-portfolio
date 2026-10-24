import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ExperienceForm } from "@/components/admin/experience-form";
import { AdminPageHeader } from "@/components/admin/ui";
import { getExperience } from "@/lib/data";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getExperience();
  const item = experience.find((entry) => entry.id === id);

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/experience"
        className="inline-flex cursor-pointer items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
        Experience
      </Link>

      <AdminPageHeader title={`${item.role} · ${item.company}`} />

      <ExperienceForm item={item} />
    </div>
  );
}
