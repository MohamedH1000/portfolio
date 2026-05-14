"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, Star, X, Loader2 } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  sort_order: number;
}

const EMPTY: Partial<Project> = {
  slug: "",
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  tech_stack: [],
  image_url: "",
  live_url: "",
  github_url: "",
  featured: false,
  sort_order: 0,
};

export function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch projects");
        setItems([]);
      } else {
        setItems(data.projects ?? []);
      }
    } catch {
      setError("Network error");
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = items.filter((p) =>
    p.title_en.toLowerCase().includes(search.toLowerCase()) ||
    p.title_ar.includes(search)
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const techStack = (editing?.tech_stack ?? []) as string[];
    const body = {
      slug: fd.get("slug"),
      title_en: fd.get("title_en"),
      title_ar: fd.get("title_ar"),
      description_en: fd.get("description_en"),
      description_ar: fd.get("description_ar"),
      tech_stack: techStack,
      image_url: fd.get("image_url") || "",
      live_url: fd.get("live_url") || "",
      github_url: fd.get("github_url") || "",
      featured: fd.get("featured") === "on",
      sort_order: Number(fd.get("sort_order")) || 0,
    };

    try {
      const res = await fetch(
        editing?.id ? `/api/admin/projects/${editing.id}` : "/api/admin/projects",
        { method: editing?.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      );
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
      setFormOpen(false);
      setEditing(null);
      fetchItems();
    } catch { setError("Network error"); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/projects/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    fetchItems();
  }

  async function toggleFeatured(id: string) {
    const item = items.find((p) => p.id === id);
    if (!item) return;
    await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, featured: !item.featured }),
    });
    fetchItems();
  }

  function addTag() {
    const tag = tagInput.trim();
    if (!tag) return;
    const current = (editing?.tech_stack ?? []) as string[];
    setEditing({ ...editing!, tech_stack: [...current, tag] });
    setTagInput("");
  }

  function removeTag(tag: string) {
    const current = (editing?.tech_stack ?? []) as string[];
    setEditing({ ...editing!, tech_stack: current.filter((t) => t !== tag) });
  }

  function openNew() {
    setEditing({ ...EMPTY });
    setFormOpen(true);
  }

  function openEdit(item: Project) {
    setEditing({ ...item });
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-border/40 bg-surface-low px-3 py-2 ps-9 text-sm focus:border-brand/40 focus:outline-none"
          />
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg brand-gradient text-white text-sm font-medium hover:opacity-90 cursor-pointer">
          <Plus className="h-4 w-4" /> New Project
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
        <EmptyState icon={Star} title="No projects" description="Create your first project to get started." />
      ) : (
        <div className="rounded-xl border border-border/30 overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-high/50">
              <tr className="text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 hidden md:table-cell">Tech Stack</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-high/20 transition-colors">
                  <td className="px-4 py-3">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="h-10 w-14 rounded object-cover border border-border/30" />
                    ) : (
                      <div className="h-10 w-14 rounded bg-surface-high flex items-center justify-center text-xs text-muted-foreground">—</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{item.title_en}</p>
                    <p className="text-xs text-muted-foreground">{item.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {item.tech_stack.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-brand/10 text-brand">{t}</span>
                      ))}
                      {item.tech_stack.length > 3 && <span className="text-xs text-muted-foreground">+{item.tech_stack.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(item.id)} className={cn("text-xs px-2 py-1 rounded-full cursor-pointer transition-colors", item.featured ? "bg-brand/20 text-brand" : "bg-surface-high text-muted-foreground")}>
                      {item.featured ? "Featured" : "Standard"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-high cursor-pointer"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {formOpen && editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setFormOpen(false); setEditing(null); }} />
          <div className="relative w-full max-w-xl bg-card border-s border-border/30 overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between border-b border-border/30 bg-card px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">{editing.id ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => { setFormOpen(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2 text-sm text-destructive">{error}</div>}
              <BilingualInput label="Title" nameEn="title_en" nameAr="title_ar" valueEn={editing.title_en} valueAr={editing.title_ar} required />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Slug <span className="text-brand">*</span></label>
                <input name="slug" defaultValue={editing.slug} required className="w-full rounded-lg border border-border/40 bg-surface-low px-3 py-2 text-sm focus:border-brand/40 focus:outline-none" />
              </div>
              <BilingualInput label="Description" nameEn="description_en" nameAr="description_ar" valueEn={editing.description_en} valueAr={editing.description_ar} type="textarea" required />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Tech Stack</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(editing.tech_stack ?? []).map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-brand/10 text-brand">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive cursor-pointer"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add technology..." className="flex-1 rounded-lg border border-border/40 bg-surface-low px-3 py-2 text-sm focus:border-brand/40 focus:outline-none" />
                  <button type="button" onClick={addTag} className="px-3 py-2 rounded-lg bg-surface-high text-sm hover:bg-surface-highest cursor-pointer">Add</button>
                </div>
              </div>
              <ImageUpload name="image_url" defaultValue={editing.image_url || ""} folder="projects" />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Live URL</label>
                  <input name="live_url" defaultValue={editing.live_url || ""} className="w-full rounded-lg border border-border/40 bg-surface-low px-3 py-2 text-sm focus:border-brand/40 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">GitHub URL</label>
                  <input name="github_url" defaultValue={editing.github_url || ""} className="w-full rounded-lg border border-border/40 bg-surface-low px-3 py-2 text-sm focus:border-brand/40 focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-foreground">Featured</label>
                <input type="checkbox" name="featured" defaultChecked={editing.featured} className="h-4 w-4 accent-brand cursor-pointer" />
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

      <DeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete project" message="This project will be permanently deleted." />
    </div>
  );
}

export default ProjectsPage;
