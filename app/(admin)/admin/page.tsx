import { getDashboardStats, getRecentContacts } from "@/app/actions/admin-dashboard";
import { StatsCard } from "@/components/admin/StatsCard";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { ErrorState } from "@/components/admin/ErrorState";
import { FolderKanban, Briefcase, MessageSquareQuote, Mail, ArrowRight, Inbox } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [{ stats, error: statsError }, { contacts: recentContacts, error: contactsError }] =
    await Promise.all([getDashboardStats(), getRecentContacts()]);

  return (
    <div className="space-y-6">
      {statsError ? (
        <ErrorState message={statsError} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard label="Projects" value={stats.projects} icon={FolderKanban} index={0} />
          <StatsCard label="Experiences" value={stats.experiences} icon={Briefcase} index={1} />
          <StatsCard label="Testimonials" value={stats.testimonials} icon={MessageSquareQuote} index={2} />
          <StatsCard
            label="Unread Messages"
            value={stats.unreadMessages}
            icon={Mail}
            index={3}
            accent={stats.unreadMessages > 0 ? "warning" : "brand"}
          />
        </div>
      )}

      <AdminPanel
        index={4}
        title="Recent Messages"
        action={
          <Link
            href="/admin/contacts"
            className="focus-ring group inline-flex items-center gap-1 rounded-lg text-sm font-medium text-brand transition-colors hover:text-brand-strong"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-0.5" />
          </Link>
        }
      >
        {contactsError ? (
          <ErrorState message={contactsError} />
        ) : recentContacts.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No messages yet"
            description="Messages sent through the contact form will appear here."
          />
        ) : (
          <ul className="divide-y divide-[var(--hairline)]">
            {recentContacts.map((contact) => (
              <li key={contact.id}>
                <Link
                  href="/admin/contacts"
                  className="focus-ring group flex items-center gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-surface-high/50"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    {!contact.read && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-brand motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]"
                      />
                    )}
                    <span
                      className={`relative h-2 w-2 rounded-full ${
                        contact.read ? "bg-muted-foreground/30" : "bg-brand"
                      }`}
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                      {contact.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {contact.subject || "No subject"}
                    </span>
                  </span>

                  <span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  );
}
