"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Search, Mail, MailOpen, X, Loader2, ExternalLink } from "lucide-react";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { EmptyState } from "@/components/admin/EmptyState";
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

export function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);

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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="w-full rounded-lg border border-border/40 bg-surface-low px-3 py-2 ps-9 text-sm focus:border-brand/40 focus:outline-none" />
        </div>
        <div className="flex gap-1 rounded-lg border border-border/30 p-1">
          {(["all", "unread", "read"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors", filter === f ? "bg-brand/10 text-brand" : "text-muted-foreground hover:text-foreground")}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-3 rounded-xl border border-border/30 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-sm text-destructive font-medium">{error}</p>
              <button onClick={fetchItems} className="mt-3 text-sm text-brand hover:underline cursor-pointer">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Mail} title="No messages" description="Contact submissions will appear here." />
          ) : (
            <div className="divide-y divide-border/20">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={cn(
                    "flex w-full items-center gap-4 px-4 py-3 text-start hover:bg-surface-high/20 transition-colors cursor-pointer",
                    selected?.id === item.id && "bg-surface-high/30"
                  )}
                >
                  <div className={cn("h-2 w-2 rounded-full shrink-0", item.read ? "bg-muted-foreground/30" : "bg-brand")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("text-sm truncate", item.read ? "text-muted-foreground" : "font-medium text-foreground")}>{item.name}</p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{item.subject || "No subject"}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 rounded-xl border border-border/30 bg-card p-5">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-sm text-brand hover:underline">{selected.email}</a>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleRead(selected.id, selected.read)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-high cursor-pointer" title={selected.read ? "Mark unread" : "Mark read"}>
                    {selected.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </button>
                  <button onClick={() => setDeleteId(selected.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {selected.subject && <p className="text-sm font-medium text-foreground">{selected.subject}</p>}
              <div className="rounded-lg bg-surface-low p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || ""}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg brand-gradient text-white text-sm font-medium hover:opacity-90">
                <ExternalLink className="h-4 w-4" /> Reply via Email
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mail className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">Select a message to view</p>
            </div>
          )}
        </div>
      </div>

      <DeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete message" message="This message will be permanently deleted." />
    </div>
  );
}

export default ContactsPage;
