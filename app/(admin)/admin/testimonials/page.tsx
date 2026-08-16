"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, MessageSquareQuote } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AdminButton } from "@/components/admin/AdminButton";
import { SearchInput } from "@/components/admin/SearchInput";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { ErrorState } from "@/components/admin/ErrorState";
import { SlideOver } from "@/components/admin/SlideOver";
import { FormField } from "@/components/admin/FormField";

interface Testimonial {
  id: string;
  name_en: string;
  name_ar: string;
  title_en: string;
  title_ar: string;
  message_en: string;
  message_ar: string;
  avatar_url: string | null;
  sort_order: number;
}

const EMPTY: Partial<Testimonial> = {
  name_en: "", name_ar: "", title_en: "", title_ar: "",
  message_en: "", message_ar: "", avatar_url: "", sort_order: 0,
};

export function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // The request only returns data — applying it to state is the caller's job.
  // That keeps every setState inside a promise callback rather than in the
  // effect body, which is the shape React actually recommends here.
  type LoadResult = { items: Testimonial[]; error: string };

  const fetchItems = useCallback(async (): Promise<LoadResult> => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (!res.ok) return { items: [], error: data.error || "Failed to fetch" };
      return { items: data.testimonials ?? [], error: "" };
    } catch {
      return { items: [], error: "Network error" };
    }
  }, []);

  const applyResult = useCallback((result: LoadResult) => {
    setItems(result.items);
    setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchItems().then((result) => {
      if (!cancelled) applyResult(result);
    });
    return () => { cancelled = true; };
  }, [fetchItems, applyResult]);

  // A refresh after a mutation shows the spinner again; the mount path does
  // not, because `loading` already starts true.
  const refreshItems = useCallback(() => {
    setLoading(true);
    void fetchItems().then(applyResult);
  }, [fetchItems, applyResult]);

  const filtered = items.filter((t) =>
    t.name_en.toLowerCase().includes(search.toLowerCase()) ||
    t.name_ar.includes(search)
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      name_en: fd.get("name_en"), name_ar: fd.get("name_ar"),
      title_en: fd.get("title_en"), title_ar: fd.get("title_ar"),
      message_en: fd.get("message_en"), message_ar: fd.get("message_ar"),
      avatar_url: fd.get("avatar_url") || "",
      sort_order: Number(fd.get("sort_order")) || 0,
    };

    try {
      const res = await fetch(
        editing?.id ? `/api/admin/testimonials/${editing.id}` : "/api/admin/testimonials",
        { method: editing?.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      );
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); setSaving(false); return; }
      setFormOpen(false); setEditing(null); refreshItems();
    } catch { setError("Network error"); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" });
    setDeleting(false); setDeleteId(null); refreshItems();
  }

  function openNew() {
    setEditing({ ...EMPTY });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search testimonials…"
          className="w-full sm:max-w-sm"
        />
        <AdminButton onClick={openNew} icon={<Plus className="h-4 w-4" />}>
          New Testimonial
        </AdminButton>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : error && !formOpen ? (
        <ErrorState message={error} onRetry={fetchItems} />
      ) : filtered.length === 0 ? (
        <AdminPanel bodyClassName="p-0">
          <EmptyState
            icon={MessageSquareQuote}
            title={search ? "No matches" : "No testimonials yet"}
            description={
              search ? "Try a different search term." : "Add client testimonials."
            }
            action={
              !search && (
                <AdminButton onClick={openNew} icon={<Plus className="h-4 w-4" />}>
                  New Testimonial
                </AdminButton>
              )
            }
          />
        </AdminPanel>
      ) : (
        <AdminPanel bodyClassName="overflow-x-auto">
          <table className="w-full min-w-[32rem]">
            <thead className="border-b border-[var(--hairline)] bg-surface-high/40">
              <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-start font-semibold">Name</th>
                <th className="hidden px-4 py-3 text-start font-semibold sm:table-cell">Title</th>
                <th className="px-4 py-3 text-end font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)]">
              <AnimatePresence initial={false}>
                {filtered.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.32, delay: Math.min(i * 0.035, 0.25), ease: [0.16, 1, 0.3, 1] }}
                    className="group transition-colors duration-200 hover:bg-surface-high/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.avatar_url}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-brand/20 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand ring-1 ring-brand/15">
                            {item.name_en[0]?.toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                          {item.name_en}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                      {item.title_en}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5 opacity-70 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          onClick={() => { setEditing({ ...item }); setFormOpen(true); }}
                          aria-label={`Edit testimonial from ${item.name_en}`}
                          className="focus-ring press cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-brand/10 hover:text-brand"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          aria-label={`Delete testimonial from ${item.name_en}`}
                          className="focus-ring press cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </AdminPanel>
      )}

      <SlideOver
        open={formOpen && !!editing}
        onClose={closeForm}
        title={editing?.id ? "Edit Testimonial" : "New Testimonial"}
      >
        {editing && (
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  role="alert"
                  className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <BilingualInput label="Name" nameEn="name_en" nameAr="name_ar" valueEn={editing.name_en} valueAr={editing.name_ar} required />
            <BilingualInput label="Title / Role" nameEn="title_en" nameAr="title_ar" valueEn={editing.title_en} valueAr={editing.title_ar} required />
            <BilingualInput label="Message" nameEn="message_en" nameAr="message_ar" valueEn={editing.message_en} valueAr={editing.message_ar} type="textarea" required />

            <ImageUpload name="avatar_url" defaultValue={editing.avatar_url || ""} folder="avatars" />

            <FormField label="Sort Order" htmlFor="testimonial-sort" className="w-28">
              <input id="testimonial-sort" name="sort_order" type="number" defaultValue={editing.sort_order ?? 0} className="field tabular-nums" />
            </FormField>

            <div className="flex justify-end gap-3 border-t border-[var(--hairline)] pt-5">
              <AdminButton type="button" variant="ghost" onClick={closeForm}>
                Cancel
              </AdminButton>
              <AdminButton type="submit" loading={saving}>
                {editing.id ? "Update" : "Create"}
              </AdminButton>
            </div>
          </form>
        )}
      </SlideOver>

      <DeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete testimonial" message="This testimonial will be permanently deleted." />
    </div>
  );
}

export default TestimonialsPage;
