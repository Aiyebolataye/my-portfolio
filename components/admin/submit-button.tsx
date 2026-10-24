"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function SubmitButton({
  label = "Save",
  pendingLabel = "Saving",
}: {
  label?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-medium text-canvas transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
