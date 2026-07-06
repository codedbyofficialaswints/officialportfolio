"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import { Category, Project } from "@/lib/types";
import ImageUploader from "./ImageUploader";

const GRID_SIZES = ["1x1", "2x1", "1x2", "2x2"] as const;

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!project;

  const [form, setForm] = useState<Partial<Project>>(
    project ?? {
      title: "",
      slug: "",
      summary: "",
      description: "",
      cover_image_url: "",
      gallery: [],
      category_id: null,
      tags: [],
      year: new Date().getFullYear(),
      client: "",
      role: "",
      link_url: "",
      featured: false,
      grid_size: "1x1",
      sort_order: 0,
      status: "draft",
    }
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagsInput, setTagsInput] = useState(project?.tags?.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .eq("kind", "project")
      .order("sort_order")
      .then(({ data }) => setCategories((data as Category[]) ?? []));
  }, [supabase]);

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      slug: form.slug || slugify(form.title ?? ""),
    };

    const query = isEdit
      ? supabase.from("projects").update(payload).eq("id", project!.id)
      : supabase.from("projects").insert(payload);

    const { error } = await query;
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin/projects");
    router.refresh();
  }

  async function handleDelete() {
    if (!project || !confirm("Delete this project permanently?")) return;
    await supabase.from("projects").delete().eq("id", project.id);
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Field label="Title">
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="input"
        />
      </Field>
      <Field label="Slug (URL) — leave blank to auto-generate">
        <input
          value={form.slug}
          onChange={(e) => update("slug", slugify(e.target.value))}
          placeholder={slugify(form.title ?? "")}
          className="input"
        />
      </Field>
      <Field label="Summary (short, shown in listings)">
        <textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} className="input h-20" />
      </Field>
      <Field label="Full description">
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="input h-40"
        />
      </Field>

      <ImageUploader label="Cover image" value={form.cover_image_url ?? ""} onChange={(url) => update("cover_image_url", url)} />

      <Field label="Category">
        <select
          value={form.category_id ?? ""}
          onChange={(e) => update("category_id", e.target.value || null)}
          className="input"
        >
          <option value="">— None —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Tags (comma-separated)">
        <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="input" />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Year">
          <input
            type="number"
            value={form.year ?? ""}
            onChange={(e) => update("year", Number(e.target.value))}
            className="input"
          />
        </Field>
        <Field label="Client">
          <input value={form.client} onChange={(e) => update("client", e.target.value)} className="input" />
        </Field>
        <Field label="Role">
          <input value={form.role} onChange={(e) => update("role", e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="External link (optional)">
        <input value={form.link_url} onChange={(e) => update("link_url", e.target.value)} className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Grid tile size (homepage/grid views)">
          <select value={form.grid_size} onChange={(e) => update("grid_size", e.target.value as Project["grid_size"])} className="input">
            {GRID_SIZES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sort order (lower = shown first)">
          <input
            type="number"
            value={form.sort_order ?? 0}
            onChange={(e) => update("sort_order", Number(e.target.value))}
            className="input"
          />
        </Field>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
          <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
          Featured
        </label>
        <Field label="Status">
          <select value={form.status} onChange={(e) => update("status", e.target.value as Project["status"])} className="input">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
      </div>

      {error && <p className="text-coral font-mono text-sm">{error}</p>}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-ink text-paper font-mono text-xs uppercase tracking-widest px-6 py-3 disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-coral font-mono text-xs uppercase tracking-widest px-6 py-3 border border-coral"
          >
            Delete
          </button>
        )}
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid var(--color-line);
          padding: 0.5rem 0.75rem;
          background: white;
          font-size: 0.9rem;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block font-mono text-xs uppercase tracking-widest text-muted">{label}</label>
      {children}
    </div>
  );
}
