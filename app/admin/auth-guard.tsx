'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'aiyebolataye@gmail.com';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Bypass auth for testing
    setUser({ email: ADMIN_EMAIL });
    setReady(true);
    return;
  }, [router]);

  if (!ready) return null;
  if (!user) return null;

  const is = (p: string) => pathname === p || pathname.startsWith(p + '/');

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className={`text-sm ${pathname === '/admin' ? '' : 'text-muted hover:text-ink'}`}>Dashboard</Link>
            <nav className="hidden items-center gap-4 md:flex">
              <Link href="/admin/projects" className={`text-sm ${is('/admin/projects') ? '' : 'text-muted hover:text-ink'}`}>Projects</Link>
              <Link href="/admin/experience" className={`text-sm ${is('/admin/experience') ? '' : 'text-muted hover:text-ink'}`}>Experience</Link>
              <Link href="/admin/profile" className={`text-sm ${is('/admin/profile') ? '' : 'text-muted hover:text-ink'}`}>Profile</Link>
              <Link href="/admin/messages" className={`text-sm ${is('/admin/messages') ? '' : 'text-muted hover:text-ink'}`}>Messages</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted hover:text-ink">View site</Link>
            <button onClick={() => signOut(auth)} className="text-sm text-muted hover:text-ink">Sign out</button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 pb-2 md:hidden sm:px-6">
          <Link href="/admin/projects" className={`shrink-0 text-sm ${is('/admin/projects') ? '' : 'text-muted hover:text-ink'}`}>Projects</Link>
          <Link href="/admin/experience" className={`shrink-0 text-sm ${is('/admin/experience') ? '' : 'text-muted hover:text-ink'}`}>Experience</Link>
          <Link href="/admin/profile" className={`shrink-0 text-sm ${is('/admin/profile') ? '' : 'text-muted hover:text-ink'}`}>Profile</Link>
          <Link href="/admin/messages" className={`shrink-0 text-sm ${is('/admin/messages') ? '' : 'text-muted hover:text-ink'}`}>Messages</Link>
        </div>
      </header>
      {children}
    </div>
  );
}
