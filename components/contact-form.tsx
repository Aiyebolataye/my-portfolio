"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { sendMessage, type ActionState } from "@/lib/actions";

const initialState: ActionState = { ok: true };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-canvas transition-opacity duration-200 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
          Sending
        </>
      ) : (
        <>
          Send message
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
        </>
      )}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(sendMessage, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-y rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
          placeholder="What are you building, and where do you need help?"
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton />
        {state.message ? (
          <p
            className={`text-[12.5px] ${
              state.ok ? "text-emerald-600 dark:text-emerald-400" : "text-danger"
            }`}
            role="status"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
