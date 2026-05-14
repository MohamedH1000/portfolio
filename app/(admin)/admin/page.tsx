import { getDashboardStats, getRecentContacts } from "@/app/actions/admin-dashboard";
import { StatsCard } from "@/components/admin/StatsCard";
import { FolderKanban, Briefcase, MessageSquareQuote, Mail } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, recentContacts] = await Promise.all([
    getDashboardStats(),
    getRecentContacts(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Projects" value={stats.projects} icon={FolderKanban} />
        <StatsCard label="Experiences" value={stats.experiences} icon={Briefcase} />
        <StatsCard label="Testimonials" value={stats.testimonials} icon={MessageSquareQuote} />
        <StatsCard label="Unread Messages" value={stats.unreadMessages} icon={Mail} />
      </div>

      <div className="rounded-xl border border-border/30 bg-card">
        <div className="flex items-center justify-between border-b border-border/30 px-5 py-4">
          <h2 className="font-semibold text-foreground">Recent Messages</h2>
          <Link
            href="/admin/contacts"
            className="text-sm text-brand hover:underline"
          >
            View all
          </Link>
        </div>
        {recentContacts.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground text-center">
            No messages yet.
          </p>
        ) : (
          <div className="divide-y divide-border/20">
            {recentContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-4 px-5 py-3"
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    contact.read ? "bg-muted-foreground/30" : "bg-brand"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {contact.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {contact.subject || "No subject"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(contact.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
