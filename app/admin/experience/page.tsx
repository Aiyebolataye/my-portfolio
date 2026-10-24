import Link from "next/link";
import { Plus } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { SetupNotice } from "@/components/admin/setup-notice";
import { AdminPageHeader, Banner, Card } from "@/components/admin/ui";
import { deleteExperience } from "@/lib/actions";
import { getExperience } from "@/lib/data";
import { formatRange } from "@/lib/format";

export default async function AdminExperiencePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const [{ saved, deleted }, experience] = await Promise.all([
    searchParams,
    getExperience(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Experience"
        description="Roles shown in the timeline on the home page."
        action={
          <Link
            href="/admin/experience/new"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-medium text-canvas transition-opacity hover:opacity-85"
          >
            <Plus className="h-4 w-4" strokeWidth={1.8} />
            Add role
          </Link>
        }
      />

      <SetupNotice />

      {saved ? <Banner kind="ok">Role saved.</Banner> : null}
      {deleted ? <Banner kind="ok">Role deleted.</Banner> : null}

      <Card>
        {experience.length === 0 ? (
          <p className="px-5 py-10 text-center text-[12.5px] text-muted">
            No roles yet.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {experience.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium tracking-tight">
                    {item.role}{" "}
                    <span className="font-normal text-muted">· {item.company}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[10.5px] text-muted">
                    {formatRange(item.start_date, item.end_date, item.current)} · order{" "}
                    {item.sort_order}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/experience/${item.id}`}
                    className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-[12px] text-muted transition-colors hover:text-ink"
                  >
                    Edit
                  </Link>
                  <form action={deleteExperience}>
                    <input type="hidden" name="id" value={item.id} />
                    <DeleteButton
                      compact
                      confirmMessage={`Delete the ${item.role} role at ${item.company}?`}
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
