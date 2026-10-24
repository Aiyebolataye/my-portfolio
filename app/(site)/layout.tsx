import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProfile } from "@/lib/data";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await getProfile();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter profile={profile} />
    </>
  );
}
