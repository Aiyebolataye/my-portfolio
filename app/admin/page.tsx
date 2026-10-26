import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Eye,
  FolderKanban,
  Mail,
  TrendingUp,
} from "lucide-react";
import { ViewsChart } from "@/components/admin/views-chart";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { formatDate } from "@/lib/format";
import { getDashboardStats, getMessages } from "@/lib/data";

export default async function AdminOverviewPage() {
  const [stats, messages] = await Promise.all([
    getDashboardStats(),
    getMessages(),
  ]);

  const recent = messages.slice(0, 4);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Overview"
        description="Traffic, content, and inbox at a glance."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Eye className="h-4 w-4" strokeWidth={1.7} />}
          label="Total views"
          value={stats.totalViews.toLocaleString()}
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" strokeWidth={1.7} />}
          label="Views · 7 days"
          value={stats.viewsLast7Days.toLocaleString()}
        />
        <StatCard
          icon={<Mail className="h-4 w-4" strokeWidth={1.7} />}
          label="Unread messages"
          value={String(stats.unreadMessages)}
        />
        <StatCard
          icon={<FolderKanban className="h-4 w-4" strokeWidth={1.7} />}
          label="Published projects"
          value={`${stats.publishedCount}/${stats.projectCount}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-medium tracking-tight">
                Page views
              </h2>
              <p className="text-[11.5px] text-muted">Last 14 days</p>
            </div>
          </div>
          <div className="mt-4">
            <ViewsChart data={stats.viewsByDay} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[14px] font-medium tracking-tight">Top pages</h2>
          <p className="text-[11.5px] text-muted">Last 14 days</p>

          <ul className="mt-4 space-y-3">
            {stats.topPages.length === 0 ? (
              <li className="text-[12.5px] text-muted">No data yet.</li>
            ) : (
              stats.topPages.map((page) => (
                <li
                  key={page.path}
                  className="flex items-center justify-between gap-3 text-[12.5px]"
                >
                  <span className="truncate font-mono text-muted">
                    {page.path}
                  </span>
                  <span className="shrink-0 tabular-nums">{page.views}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[14px] font-medium tracking-tight">Inbox</h2>
            <p className="text-[11.5px] text-muted">Latest messages</p>
          </div>
          <Link
            href="/admin/messages"
            className="inline-flex cursor-pointer items-center gap-1 text-[12px] text-muted transition-colors hover:text-ink"
          >
            All messages
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-8 text-[12.5px] text-muted">
            No messages yet. The contact form on the home page feeds this inbox.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((message) => (
              <li key={message.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[13px] font-medium">{message.name}</span>
                  <span className="text-[12px] text-muted">{message.email}</span>
                  {!message.read ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent-ink">
                      New
                    </span>
                  ) : null}
                  <span className="ml-auto font-mono text-[10.5px] text-muted">
                    {formatDate(message.created_at)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-[12.5px] text-muted">
                  {message.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl tracking-tight">{value}</p>
    </Card>
  );
}
