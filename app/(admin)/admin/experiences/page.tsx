"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, X, Loader2, Briefcase } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { EmptyState } from "@/components/admin/EmptyState";

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

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/experiences");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch");
        setItems([]);
      } else {
        setItems(data.experiences ?? []);
      }
    } catch {
      setError("Network error");
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

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
      fetchItems();
    } catch { setError("Network error"); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/experiences/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    fetchItems();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search experiences..." className="w-full rounded-lg border border-border/40 bg-surface-low px-3 py-2 ps-9 text-sm focus:border-brand/40 focus:outline-none" />
        </div>
        <button onClick={() => { setEditing({ ...EMPTY }); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg brand-gradient text-white text-sm font-medium hover:opacity-90 cursor-pointer">
          <Plus className="h-4 w-4" /> New Experience
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive font-medium">{error}</p>
          <button onClick={fetchItems} className="mt-3 text-sm text-brand hover:underline cursor-pointer">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Briefcase} title="No experiences" description="Add your work experience." />
      ) : (
        <div className="rounded-xl border border-border/30 overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-high/50">
              <tr className="text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 hidden sm:table-cell">Period</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-high/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{item.company}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{item.role_en}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                    {item.start_date} — {item.end_date || "Present"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditing({ ...item }); setFormOpen(true); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-high cursor-pointer"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setFormOpen(false); setEditing(null); }} />
          <div className="relative w-full max-w-xl bg-card border-s border-border/30 overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between border-b border-border/30 bg-card px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">{editing.id ? "Edit Experience" : "New Experience"}</h2>
              <button onClick={() => { setFormOpen(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2 text-sm text-destructive">{error}</div>}
              <BilingualInput label="Role" nameEn="role_en" nameAr="role_ar" valueEn={editing.role_en} valueAr={editing.role_ar} required />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Company <span className="text-brand">*</span></label>
                <input name="company" defaultValue={editing.company} required className="w-full rounded-lg border border-border/40 bg-surface-low px-3 py-2 text-sm focus:border-brand/40 focus:outline-none" />
              </div>
              <ImageUpload name="company_logo_url" defaultValue={editing.company_logo_url || ""} folder="logos" />
              <BilingualInput label="Description" nameEn="description_en" nameAr="description_ar" valueEn={editing.description_en} valueAr={editing.description_ar} type="textarea" required />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Start Date <span className="text-brand">*</span></label>
                  <input name="start_date" type="date" defaultValue={editing.start_date?.slice(0, 10)} required className="w-full rounded-lg border border-border/40 bg-surface-low px-3 py-2 text-sm focus:border-brand/40 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">End Date</label>
                  <input name="end_date" type="date" defaultValue={editing.end_date?.slice(0, 10) || ""} className="w-full rounded-lg border border-border/40 bg-surface-low px-3 py-2 text-sm focus:border-brand/40 focus:outline-none" />
                  <p className="text-xs text-muted-foreground">Leave empty for Present</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Sort Order</label>
                <input name="sort_order" type="number" defaultValue={editing.sort_order ?? 0} className="w-24 rounded-lg border border-border/40 bg-surface-low px-3 py-2 text-sm focus:border-brand/40 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setFormOpen(false); setEditing(null); }} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg brand-gradient text-white text-sm font-medium disabled:opacity-50 cursor-pointer">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editing.id ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete experience" message="This experience will be permanently deleted." />
    </div>
  );
}

export default ExperiencesPage;
