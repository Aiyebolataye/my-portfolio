"use client";

import { useActionState } from "react";
import { updateProfile, type ActionState } from "@/lib/actions";
import type { Profile } from "@/lib/types";
import { UploadField } from "./upload-field";
import { SubmitButton } from "./submit-button";
import { Banner, Card, Field, inputClass } from "./ui";

const initialState: ActionState = { ok: true };

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfile, initialState);
  const isDemo = profile.id === "demo";

  return (
    <form action={formAction} className="space-y-5">
      {!isDemo ? <input type="hidden" name="id" value={profile.id} /> : null}

      {state.message ? (
        <Banner kind={state.ok ? "ok" : "error"}>{state.message}</Banner>
      ) : null}

      <Card className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="full_name">
            <input
              id="full_name"
              name="full_name"
              required
              defaultValue={profile.full_name}
              className={inputClass}
            />
          </Field>
          <Field label="Availability" htmlFor="availability">
            <input
              id="availability"
              name="availability"
              defaultValue={profile.availability ?? ""}
              className={inputClass}
              placeholder="Open to remote backend and full-stack roles"
            />
          </Field>
        </div>

        <Field label="Headline" htmlFor="headline" hint="Shown under your name in the hero.">
          <input
            id="headline"
            name="headline"
            defaultValue={profile.headline ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Bio" htmlFor="bio" hint="Separate paragraphs with a blank line.">
          <textarea
            id="bio"
            name="bio"
            rows={7}
            defaultValue={profile.bio ?? ""}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location" htmlFor="location">
            <input
              id="location"
              name="location"
              defaultValue={profile.location ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Email" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={profile.email ?? ""}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" htmlFor="phone">
            <input
              id="phone"
              name="phone"
              defaultValue={profile.phone ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="GitHub URL" htmlFor="github_url">
            <input
              id="github_url"
              name="github_url"
              type="url"
              defaultValue={profile.github_url ?? ""}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="LinkedIn URL" htmlFor="linkedin_url">
            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              defaultValue={profile.linkedin_url ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="X / Twitter URL" htmlFor="twitter_url">
            <input
              id="twitter_url"
              name="twitter_url"
              type="url"
              defaultValue={profile.twitter_url ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-5 p-5 sm:p-6">
        <UploadField
          name="avatar_url"
          label="Profile photo"
          folder="profile"
          initialUrl={profile.avatar_url ?? ""}
          accept="image/*"
        />

        <UploadField
          name="resume_url"
          label="Résumé (PDF)"
          folder="profile"
          initialUrl={profile.resume_url ?? ""}
          accept="application/pdf"
          preview="none"
        />
      </Card>

      <SubmitButton label="Save profile" />
    </form>
  );
}
