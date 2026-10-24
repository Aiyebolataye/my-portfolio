import { Plus, X } from "lucide-react";
import { ProfileForm } from "@/components/admin/profile-form";
import { SetupNotice } from "@/components/admin/setup-notice";
import { AdminPageHeader, Card, inputClass, labelClass } from "@/components/admin/ui";
import { addSkill, deleteSkill } from "@/lib/actions";
import { getProfile, getSkills } from "@/lib/data";

export default async function AdminProfilePage() {
  const [profile, skills] = await Promise.all([getProfile(), getSkills()]);

  const groups = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] ?? [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Profile"
        description="Your name, bio, links, photo, and résumé."
      />

      <SetupNotice />

      <ProfileForm profile={profile} />

      <Card className="p-5 sm:p-6">
        <h2 className="text-[14px] font-medium tracking-tight">Skills</h2>
        <p className="mt-0.5 text-[11.5px] text-muted">
          Grouped by category on the About section.
        </p>

        <div className="mt-5 space-y-4">
          {Object.entries(groups).map(([category, items]) => (
            <div key={category}>
              <p className={labelClass}>{category}</p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[12px]"
                  >
                    {skill.name}
                    <form action={deleteSkill} className="inline-flex">
                      <input type="hidden" name="id" value={skill.id} />
                      <button
                        type="submit"
                        aria-label={`Remove ${skill.name}`}
                        className="cursor-pointer text-muted transition-colors hover:text-danger"
                      >
                        <X className="h-3 w-3" strokeWidth={2} />
                      </button>
                    </form>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form
          action={addSkill}
          className="mt-6 flex flex-wrap items-end gap-3 border-t border-line pt-5"
        >
          <div className="min-w-40 flex-1">
            <label htmlFor="skill-name" className={labelClass}>
              Skill
            </label>
            <input
              id="skill-name"
              name="name"
              required
              className={inputClass}
              placeholder="Redis"
            />
          </div>
          <div className="min-w-40 flex-1">
            <label htmlFor="skill-category" className={labelClass}>
              Category
            </label>
            <input
              id="skill-category"
              name="category"
              className={inputClass}
              placeholder="Backend"
            />
          </div>
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-[12.5px] transition-colors hover:border-ink/30"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
            Add skill
          </button>
        </form>
      </Card>
    </div>
  );
}
