"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, Briefcase, Building2 } from "lucide-react";
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

interface Experience {
  id: string;
  role_en: string;
  role_ar: string;
  company: string;
  company_logo_url: string | null;
  description_en: string;
  description_ar: string;
  start_date: string;
  end_date: string | null;
  sort_order: number;
}

const EMPTY: Partial<Experience> = {
  role_en: "", role_ar: "", company: "", company_logo_url: "",
  description_en: "", description_ar: "", start_date: "", end_date: "", sort_order: 0,
};

export function ExperiencesPage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // The request only returns data — applying it to state is the caller's job.
  // That keeps every setState inside a promise callback rather than in the
  // effect body, which is the shape React actually recommends here.
  type LoadResult = { items: Experience[]; error: string };

  const fetchItems = useCallback(async (): Promise<LoadResult> => {
    try {
      const res = await fetch("/api/admin/experiences");
      const data = await res.json();
      if (!res.ok) return { items: [], error: data.error || "Failed to fetch" };
      return { items: data.experiences ?? [], error: "" };
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

  const filtered = items.filter((e) =>
    e.company.toLowerCase().includes(search.toLowerCase()) ||
    e.role_en.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      role_en: fd.get("role_en"),
      role_ar: fd.get("role_ar"),
      company: fd.get("company"),
      company_logo_url: fd.get("company_logo_url") || "",
      description_en: fd.get("description_en"),
      description_ar: fd.get("description_ar"),
      start_date: fd.get("start_date"),
      end_date: fd.get("end_date") || null,
      sort_order: Number(fd.get("sort_order")) || 0,
    };

    try {
      const res = await fetch(
        editing?.id ? `/api/admin/experiences/${editing.id}` : "/api/admin/experiences",
        { method: editing?.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      );
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); setSaving(false); return; }
      setFormOpen(false);
      setEditing(null);
      refreshItems();
    } catch { setError("Network error"); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/experiences/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    refreshItems();
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
          placeholder="Search experiences…"
          className="w-full sm:max-w-sm"
        />
        <AdminButton onClick={openNew} icon={<Plus className="h-4 w-4" />}>
          New Experience
        </AdminButton>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : error && !formOpen ? (
        <ErrorState message={error} onRetry={fetchItems} />
      ) : filtered.length === 0 ? (
        <AdminPanel bodyClassName="p-0">
          <EmptyState
            icon={Briefcase}
            title={search ? "No matches" : "No experiences yet"}
            description={
              search ? "Try a different search term." : "Add your work experience."
            }
            action={
              !search && (
                <AdminButton onClick={openNew} icon={<Plus className="h-4 w-4" />}>
                  New Experience
                </AdminButton>
              )
            }
          />
        </AdminPanel>
      ) : (
        <AdminPanel bodyClassName="overflow-x-auto">
          <table className="w-full min-w-[36rem]">
            <thead className="border-b border-[var(--hairline)] bg-surface-high/40">
              <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-start font-semibold">Company</th>
                <th className="px-4 py-3 text-start font-semibold">Role</th>
                <th className="hidden px-4 py-3 text-start font-semibold sm:table-cell">Period</th>
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
                        {item.company_logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.company_logo_url}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-lg border border-[var(--hairline)] object-cover transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 ring-1 ring-brand/15">
                            <Building2 className="h-4 w-4 text-brand" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                          {item.company}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.role_en}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-high/70 px-2.5 py-1 text-xs tabular-nums text-muted-foreground ring-1 ring-[var(--hairline)]">
                        {item.start_date?.slice(0, 10)}
                        <span aria-hidden="true">→</span>
                        {item.end_date ? (
                          item.end_date.slice(0, 10)
                        ) : (
                          <span className="font-medium text-brand">Present</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5 opacity-70 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          onClick={() => { setEditing({ ...item }); setFormOpen(true); }}
                          aria-label={`Edit ${item.company}`}
                          className="focus-ring press cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-brand/10 hover:text-brand"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          aria-label={`Delete ${item.company}`}
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
        title={editing?.id ? "Edit Experience" : "New Experience"}
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

            <BilingualInput label="Role" nameEn="role_en" nameAr="role_ar" valueEn={editing.role_en} valueAr={editing.role_ar} required />

            <FormField label="Company" required htmlFor="exp-company">
              <input id="exp-company" name="company" defaultValue={editing.company} required className="field" />
            </FormField>

            <ImageUpload name="company_logo_url" defaultValue={editing.company_logo_url || ""} folder="logos" />

            <BilingualInput label="Description" nameEn="description_en" nameAr="description_ar" valueEn={editing.description_en} valueAr={editing.description_ar} type="textarea" required />

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Start Date" required htmlFor="exp-start">
                <input id="exp-start" name="start_date" type="date" defaultValue={editing.start_date?.slice(0, 10)} required className="field" />
              </FormField>
              <FormField label="End Date" htmlFor="exp-end" hint="Leave empty for Present">
                <input id="exp-end" name="end_date" type="date" defaultValue={editing.end_date?.slice(0, 10) || ""} className="field" />
              </FormField>
            </div>

            <FormField label="Sort Order" htmlFor="exp-sort" className="w-28">
              <input id="exp-sort" name="sort_order" type="number" defaultValue={editing.sort_order ?? 0} className="field tabular-nums" />
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

      <DeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete experience" message="This experience will be permanently deleted." />
    </div>
  );
}

export default ExperiencesPage;
