"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProject, type ActionState } from "@/lib/actions";
import type { Project } from "@/lib/types";
import { UploadField } from "./upload-field";
import { SubmitButton } from "./submit-button";
import { Banner, Card, Field, inputClass, labelClass } from "./ui";

const initialState: ActionState = { ok: true };

export function ProjectForm({
  project,
  nextSortOrder = 0,
}: {
  project?: Project;
  nextSortOrder?: number;
}) {
  const [state, formAction] = useActionState(saveProject, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      {state.message && !state.ok ? (
        <Banner kind="error">{state.message}</Banner>
      ) : null}

      <Card className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" htmlFor="title">
            <input
              id="title"
              name="title"
              required
              defaultValue={project?.title ?? ""}
              className={inputClass}
              placeholder="Shopmoda"
            />
          </Field>
          <Field
            label="Slug"
            htmlFor="slug"
            hint="Leave empty to generate from the title."
          >
            <input
              id="slug"
              name="slug"
              defaultValue={project?.slug ?? ""}
              className={inputClass}
              placeholder="shopmoda"
            />
          </Field>
        </div>

        <Field label="Tagline" htmlFor="tagline" hint="One line. Shown on the card.">
          <input
            id="tagline"
            name="tagline"
            defaultValue={project?.tagline ?? ""}
            className={inputClass}
            placeholder="A live marketplace for second-hand fashion in Nigeria."
          />
        </Field>

        <Field
          label="Description"
          htmlFor="description"
          hint="Separate paragraphs with a blank line."
        >
          <textarea
            id="description"
            name="description"
            rows={9}
            defaultValue={project?.description ?? ""}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </Field>

        <Field
          label="Tech stack"
          htmlFor="tech_stack"
          hint="Comma separated: Next.js, TypeScript, PostgreSQL"
        >
          <input
            id="tech_stack"
            name="tech_stack"
            defaultValue={(project?.tech_stack ?? []).join(", ")}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Live URL" htmlFor="live_url">
            <input
              id="live_url"
              name="live_url"
              type="url"
              defaultValue={project?.live_url ?? ""}
              className={inputClass}
              placeholder="https://"
            />
          </Field>
          <Field label="Repository URL" htmlFor="repo_url">
            <input
              id="repo_url"
              name="repo_url"
              type="url"
              defaultValue={project?.repo_url ?? ""}
              className={inputClass}
              placeholder="https://github.com/…"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue={project?.status ?? "live"}
              className={inputClass}
            >
              <option value="live">Live</option>
              <option value="in-development">In development</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Sort order" htmlFor="sort_order" hint="Lower numbers appear first.">
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={project?.sort_order ?? nextSortOrder}
              className={inputClass}
            />
          </Field>
        </div>

        <UploadField
          name="cover_image_url"
          label="Cover image"
          folder="covers"
          initialUrl={project?.cover_image_url ?? ""}
          accept="image/*"
        />

        <div className="flex flex-wrap gap-5 border-t border-line pt-5">
          <label className="flex cursor-pointer items-center gap-2.5 text-[13px]">
            <input
              type="checkbox"
              name="published"
              defaultChecked={project?.published ?? true}
              className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
            />
            Published
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-[13px]">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured ?? false}
              className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
            />
            Featured
          </label>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton label={project ? "Save changes" : "Create project"} />
        <Link
          href="/admin/projects"
          className="cursor-pointer rounded-xl border border-line px-4 py-2.5 text-[13px] text-muted transition-colors hover:text-ink"
        >
          Cancel
        </Link>
      </div>

      <p className="text-[11.5px] text-muted">
        Tip: <span className={labelClass}>Published</span> controls whether the
        project appears on the public site.
      </p>
    </form>
  );
}
