import { Database } from "lucide-react";
import { hasSupabaseEnv } from "@/lib/config";

export function SetupNotice() {
  if (hasSupabaseEnv) return null;

  return (
    <div className="flex gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
      <Database
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300"
        strokeWidth={1.8}
      />
      <div className="text-[12.5px] leading-relaxed text-amber-800 dark:text-amber-200">
        <p className="font-medium">Demo mode — nothing is saved yet.</p>
        <p className="mt-1">
          Create a free Supabase project, run{" "}
          <code className="font-mono">supabase/schema.sql</code>, then add your
          URL and anon key to <code className="font-mono">.env.local</code> and
          restart the server. See the README for the full checklist.
        </p>
      </div>
    </div>
  );
}
