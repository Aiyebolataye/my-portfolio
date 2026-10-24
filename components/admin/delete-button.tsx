"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteButton({
  label = "Delete",
  confirmMessage = "Delete this item? This cannot be undone.",
  compact = false,
}: {
  label?: string;
  confirmMessage?: string;
  compact?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
      className={`inline-flex cursor-pointer items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-danger disabled:cursor-not-allowed disabled:opacity-60 ${
        compact ? "" : "rounded-xl border border-line px-3 py-2"
      }`}
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.8} />
      ) : (
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
      )}
      {label}
    </button>
  );
}
