import { Check, Mail, MailOpen, Trash2 } from "lucide-react";
import { SetupNotice } from "@/components/admin/setup-notice";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { deleteMessage, toggleMessageRead } from "@/lib/actions";
import { getMessages } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((message) => !message.read).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Messages"
        description={`${messages.length} total · ${unread} unread`}
      />

      <SetupNotice />

      <Card>
        {messages.length === 0 ? (
          <p className="px-5 py-10 text-center text-[12.5px] text-muted">
            The inbox is empty.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {messages.map((message) => (
              <li key={message.id} className="px-4 py-5 sm:px-5">
                <div className="flex flex-wrap items-center gap-2">
                  {message.read ? (
                    <MailOpen className="h-3.5 w-3.5 text-muted" strokeWidth={1.7} />
                  ) : (
                    <Mail className="h-3.5 w-3.5 text-accent" strokeWidth={1.7} />
                  )}
                  <span className="text-[13.5px] font-medium">{message.name}</span>
                  <a
                    href={`mailto:${message.email}`}
                    className="cursor-pointer text-[12.5px] text-muted transition-colors hover:text-accent"
                  >
                    {message.email}
                  </a>
                  {!message.read ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent-ink">
                      New
                    </span>
                  ) : null}
                  <span className="ml-auto font-mono text-[10.5px] text-muted">
                    {formatDate(message.created_at)}
                  </span>
                </div>

                <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-muted">
                  {message.message}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <form action={toggleMessageRead}>
                    <input type="hidden" name="id" value={message.id} />
                    <input
                      type="hidden"
                      name="read"
                      value={String(message.read)}
                    />
                    <button
                      type="submit"
                      className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-ink"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Mark as {message.read ? "unread" : "read"}
                    </button>
                  </form>

                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={message.id} />
                    <button
                      type="submit"
                      className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Delete
                    </button>
                  </form>

                  <a
                    href={`mailto:${message.email}?subject=Re: your message`}
                    className="ml-auto cursor-pointer rounded-lg border border-line px-3 py-1.5 text-[12px] text-muted transition-colors hover:text-ink"
                  >
                    Reply
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
