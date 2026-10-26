'use client';

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

const initialState = { ok: true, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-[13px] font-medium text-canvas transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
          Sign in
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [state, formAction] = useActionState(async (_prev: any, formData: FormData) => {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '').trim();
    if (!email || !password) return { ok: false, message: 'Email and password are required.' };
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(next.startsWith('/') ? next : '/admin');
      return { ok: true, message: '' };
    } catch (e: any) {
      return { ok: false, message: e?.message || 'Sign in failed' };
    }
  }, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent" />
      </div>
      {state.message ? <p className="text-[12.5px] text-danger" role="alert">{state.message}</p> : null}
      <SubmitButton />
    </form>
  );
}
