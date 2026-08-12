"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Mail, MailOpen, ExternalLink, Inbox } from "lucide-react";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { SearchInput } from "@/components/admin/SearchInput";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { ErrorState } from "@/components/admin/ErrorState";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

const FILTERS = ["all", "unread", "read"] as const;

export function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch");
        setItems([]);
      } else {
        setItems(data.contacts ?? []);
      }
    } catch {
      setError("Network error");
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = items.filter((c) => {
    if (filter === "unread" && c.read) return false;
    if (filter === "read" && !c.read) return false;
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.subject || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const unreadCount = items.filter((c) => !c.read).length;

  async function toggleRead(id: string, currentRead: boolean) {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !currentRead }),
    });
    fetchItems();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/contacts/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    if (selected?.id === deleteId) setSelected(null);
    fetchItems();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search messages…"
          className="w-full sm:max-w-sm"
        />

        <div
          role="tablist"
          aria-label="Filter messages"
          className="flex gap-1 self-start rounded-xl border border-[var(--hairline)] bg-surface-high/40 p-1"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "focus-ring relative cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200",
                filter === f ? "text-brand" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter === f && (
                <motion.span
                  layoutId="contacts-filter-pill"
                  className="absolute inset-0 rounded-lg bg-brand/12 ring-1 ring-brand/20"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative capitalize">{f}</span>
              {f === "unread" && unreadCount > 0 && (
                <span className="relative ms-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[0.625rem] font-semibold text-[var(--brand-contrast)]">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-3">
          {loading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchItems} />
          ) : filtered.length === 0 ? (
            <AdminPanel bodyClassName="p-0">
              <EmptyState
                icon={Inbox}
                title={search || filter !== "all" ? "No matches" : "No messages"}
                description={
                  search || filter !== "all"
                    ? "Try a different search or filter."
                    : "Contact submissions will appear here."
                }
              />
            </AdminPanel>
          ) : (
            <AdminPanel bodyClassName="p-0">
              <ul className="divide-y divide-[var(--hairline)]">
                <AnimatePresence initial={false}>
                  {filtered.map((item, i) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.2), ease: [0.16, 1, 0.3, 1] }}
                    >
                      <button
                        onClick={() => setSelected(item)}
                        aria-current={selected?.id === item.id}
                        className={cn(
                          "focus-ring group relative flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-start",
                          "transition-colors duration-200 hover:bg-surface-high/40",
                          selected?.id === item.id && "bg-brand/[0.07]"
                        )}
                      >
                        {selected?.id === item.id && (
                          <motion.span
                            layoutId="contact-selected-edge"
                            className="absolute inset-y-0 start-0 w-0.5 brand-gradient"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}

                        <span className="relative flex h-2 w-2 shrink-0">
                          {!item.read && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 rounded-full bg-brand motion-safe:animate-[pulse-ring_2.4s_ease-out_infinite]"
                            />
                          )}
                          <span
                            className={cn(
                              "relative h-2 w-2 rounded-full",
                              item.read ? "bg-muted-foreground/30" : "bg-brand"
                            )}
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                "truncate text-sm",
                                item.read
                                  ? "text-muted-foreground"
                                  : "font-semibold text-foreground"
                              )}
                            >
                              {item.name}
                            </span>
                            <span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {item.subject || "No subject"}
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </AdminPanel>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          <AdminPanel index={1} bodyClassName="p-5 lg:sticky lg:top-20">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold tracking-tight text-foreground">
                        {selected.name}
                      </h3>
                      <a
                        href={`mailto:${selected.email}`}
                        className="focus-ring link-underline truncate text-sm text-brand"
                      >
                        {selected.email}
                      </a>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => toggleRead(selected.id, selected.read)}
                        className="focus-ring press cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-brand/10 hover:text-brand"
                        title={selected.read ? "Mark unread" : "Mark read"}
                        aria-label={selected.read ? "Mark unread" : "Mark read"}
                      >
                        {selected.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteId(selected.id)}
                        aria-label="Delete message"
                        className="focus-ring press cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {selected.subject && (
                    <p className="text-sm font-medium text-foreground">{selected.subject}</p>
                  )}

                  <div className="rounded-xl border border-[var(--hairline)] bg-surface-lowest/60 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {selected.message}
                    </p>
                  </div>

                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || ""}`}
                    className="focus-ring press sheen-hover inline-flex items-center gap-2 rounded-xl brand-gradient px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-2)] transition-shadow duration-200 hover:shadow-[var(--shadow-brand)]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Reply via Email
                  </a>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center py-14 text-center"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-high/60">
                    <Mail className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select a message to view
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </AdminPanel>
        </div>
      </div>

      <DeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete message" message="This message will be permanently deleted." />
    </div>
  );
}

export default ContactsPage;
