"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveExperience, type ActionState } from "@/lib/actions";
import type { Experience } from "@/lib/types";
import { SubmitButton } from "./submit-button";
import { Banner, Card, Field, inputClass } from "./ui";

const initialState: ActionState = { ok: true };

export function ExperienceForm({
  item,
  nextSortOrder = 0,
}: {
  item?: Experience;
  nextSortOrder?: number;
}) {
  const [state, formAction] = useActionState(saveExperience, initialState);
  const [current, setCurrent] = useState(item?.current ?? false);

  return (
    <form action={formAction} className="space-y-5">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      {state.message && !state.ok ? (
        <Banner kind="error">{state.message}</Banner>
      ) : null}

      <Card className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company" htmlFor="company">
            <input
              id="company"
              name="company"
              required
              defaultValue={item?.company ?? ""}
              className={inputClass}
              placeholder="Legend Internet"
            />
          </Field>
          <Field label="Role" htmlFor="role">
            <input
              id="role"
              name="role"
              required
              defaultValue={item?.role ?? ""}
              className={inputClass}
              placeholder="Full-Stack Developer"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location" htmlFor="location">
            <input
              id="location"
              name="location"
              defaultValue={item?.location ?? ""}
              className={inputClass}
              placeholder="Abuja, Nigeria"
            />
          </Field>
          <Field label="Sort order" htmlFor="sort_order" hint="Lower numbers appear first.">
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={item?.sort_order ?? nextSortOrder}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start month" htmlFor="start_date">
            <input
              id="start_date"
              name="start_date"
              type="month"
              required
              defaultValue={item?.start_date ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="End month" htmlFor="end_date">
            <input
              id="end_date"
              name="end_date"
              type="month"
              disabled={current}
              defaultValue={item?.end_date ?? ""}
              className={`${inputClass} disabled:opacity-50`}
            />
          </Field>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-[13px]">
          <input
            type="checkbox"
            name="current"
            checked={current}
            onChange={(event) => setCurrent(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
          />
          I currently work here
        </label>

        <Field label="Description" htmlFor="description">
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={item?.description ?? ""}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </Field>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton label={item ? "Save changes" : "Add role"} />
        <Link
          href="/admin/experience"
          className="cursor-pointer rounded-xl border border-line px-4 py-2.5 text-[13px] text-muted transition-colors hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
