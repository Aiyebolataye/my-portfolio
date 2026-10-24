"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  FolderKanban,
  LayoutDashboard,
  Mail,
  UserRound,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col md:gap-0.5 md:overflow-visible">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
              active
                ? "bg-ink text-canvas"
                : "text-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.7} />
            <span>{link.label}</span>
            {link.label === "Messages" && unread > 0 ? (
              <span
                className={`ml-auto grid h-5 min-w-5 place-items-center rounded-full px-1 font-mono text-[10px] ${
                  active ? "bg-canvas/20 text-canvas" : "bg-accent text-accent-ink"
                }`}
              >
                {unread}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
