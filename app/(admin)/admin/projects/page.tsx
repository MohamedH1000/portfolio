"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, Star, X, FolderKanban } from "lucide-react";
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

  // The request only returns data — applying it to state is the caller's job.
  // That keeps every setState inside a promise callback rather than in the
  // effect body, which is the shape React actually recommends here.
  type LoadResult = { items: Project[]; error: string };

  const fetchItems = useCallback(async (): Promise<LoadResult> => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (!res.ok) return { items: [], error: data.error || "Failed to fetch projects" };
      return { items: data.projects ?? [], error: "" };
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
      refreshItems();
    } catch { setError("Network error"); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/projects/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    refreshItems();
  }

  async function toggleFeatured(id: string) {
    const item = items.find((p) => p.id === id);
    if (!item) return;
    await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, featured: !item.featured }),
    });
    refreshItems();
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
          placeholder="Search projects…"
          className="w-full sm:max-w-sm"
        />
        <AdminButton onClick={openNew} icon={<Plus className="h-4 w-4" />}>
          New Project
        </AdminButton>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : error && !formOpen ? (
        <ErrorState message={error} onRetry={fetchItems} />
      ) : filtered.length === 0 ? (
        <AdminPanel bodyClassName="p-0">
          <EmptyState
            icon={search ? Star : FolderKanban}
            title={search ? "No matches" : "No projects yet"}
            description={
              search
                ? "Try a different search term."
                : "Create your first project to get started."
            }
            action={
              !search && (
                <AdminButton onClick={openNew} icon={<Plus className="h-4 w-4" />}>
                  New Project
                </AdminButton>
              )
            }
          />
        </AdminPanel>
      ) : (
        <AdminPanel bodyClassName="overflow-x-auto">
          <table className="w-full min-w-[42rem]">
            <thead className="border-b border-[var(--hairline)] bg-surface-high/40">
              <tr className="text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-start font-semibold">Image</th>
                <th className="px-4 py-3 text-start font-semibold">Title</th>
                <th className="hidden px-4 py-3 text-start font-semibold md:table-cell">Tech Stack</th>
                <th className="px-4 py-3 text-start font-semibold">Featured</th>
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
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt=""
                          className="h-10 w-14 rounded-lg border border-[var(--hairline)] object-cover shadow-[var(--shadow-1)] transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-surface-high text-xs text-muted-foreground">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                        {item.title_en}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">{item.slug}</p>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tech_stack.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand ring-1 ring-brand/15"
                          >
                            {t}
                          </span>
                        ))}
                        {item.tech_stack.length > 3 && (
                          <span className="px-1 text-xs text-muted-foreground">
                            +{item.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(item.id)}
                        aria-pressed={item.featured}
                        className={cn(
                          "focus-ring press inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          "ring-1 transition-all duration-200",
                          item.featured
                            ? "bg-brand/15 text-brand ring-brand/25 hover:bg-brand/25"
                            : "bg-surface-high text-muted-foreground ring-transparent hover:text-foreground"
                        )}
                      >
                        <Star
                          className={cn(
                            "h-3 w-3 transition-transform duration-300 ease-[var(--ease-spring)]",
                            item.featured && "scale-110 fill-current"
                          )}
                        />
                        {item.featured ? "Featured" : "Standard"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5 opacity-70 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          onClick={() => openEdit(item)}
                          aria-label={`Edit ${item.title_en}`}
                          className="focus-ring press cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-brand/10 hover:text-brand"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          aria-label={`Delete ${item.title_en}`}
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
        title={editing?.id ? "Edit Project" : "New Project"}
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

            <BilingualInput label="Title" nameEn="title_en" nameAr="title_ar" valueEn={editing.title_en} valueAr={editing.title_ar} required />

            <FormField label="Slug" required htmlFor="project-slug" hint="Used in the public URL — lowercase, hyphenated.">
              <input id="project-slug" name="slug" defaultValue={editing.slug} required className="field font-mono" />
            </FormField>

            <BilingualInput label="Description" nameEn="description_en" nameAr="description_ar" valueEn={editing.description_en} valueAr={editing.description_ar} type="textarea" required />

            <FormField label="Tech Stack" htmlFor="project-tech">
              {(editing.tech_stack ?? []).length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <AnimatePresence initial={false}>
                    {(editing.tech_stack ?? []).map((tag) => (
                      <motion.span
                        key={tag}
                        layout
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand ring-1 ring-brand/15"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          aria-label={`Remove ${tag}`}
                          className="focus-ring cursor-pointer rounded-full transition-colors hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  id="project-tech"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add technology…"
                  className="field flex-1"
                />
                <AdminButton type="button" variant="secondary" onClick={addTag}>
                  Add
                </AdminButton>
              </div>
            </FormField>

            <ImageUpload name="image_url" defaultValue={editing.image_url || ""} folder="projects" />

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Live URL" htmlFor="project-live">
                <input id="project-live" name="live_url" defaultValue={editing.live_url || ""} className="field" />
              </FormField>
              <FormField label="GitHub URL" htmlFor="project-github">
                <input id="project-github" name="github_url" defaultValue={editing.github_url || ""} className="field" />
              </FormField>
            </div>

            <div className="flex flex-wrap items-end gap-6">
              <label className="group flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={editing.featured}
                  className="h-4 w-4 cursor-pointer accent-[var(--brand)]"
                />
                Featured
              </label>

              <FormField label="Sort Order" htmlFor="project-sort" className="w-28">
                <input id="project-sort" name="sort_order" type="number" defaultValue={editing.sort_order ?? 0} className="field tabular-nums" />
              </FormField>
            </div>

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

      <DeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete project" message="This project will be permanently deleted." />
    </div>
  );
}

export default ProjectsPage;
