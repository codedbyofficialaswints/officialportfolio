"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import { Article, Category } from "@/lib/types";
import ImageUploader from "./ImageUploader";

export default function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!article;

  const [form, setForm] = useState<Partial<Article>>(
    article ?? {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image_url: "",
      category_id: null,
      tags: [],
      sort_order: 0,
      status: "draft",
      published_at: null,
    }
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagsInput, setTagsInput] = useState(article?.tags?.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .eq("kind", "article")
      .order("sort_order")
      .then(({ data }) => setCategories((data as Category[]) ?? []));
  }, [supabase]);

  function update<K extends keyof Article>(key: K, value: Article[K]) {
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
      published_at:
        form.status === "published" && !form.published_at ? new Date().toISOString() : form.published_at,
    };

    const query = isEdit
      ? supabase.from("articles").update(payload).eq("id", article!.id)
      : supabase.from("articles").insert(payload);

    const { error } = await query;
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin/articles");
    router.refresh();
  }

  async function handleDelete() {
    if (!article || !confirm("Delete this article permanently?")) return;
    await supabase.from("articles").delete().eq("id", article.id);
    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Field label="Title">
        <input required value={form.title} onChange={(e) => update("title", e.target.value)} className="input" />
      </Field>
      <Field label="Slug (URL) — leave blank to auto-generate">
        <input
          value={form.slug}
          onChange={(e) => update("slug", slugify(e.target.value))}
          placeholder={slugify(form.title ?? "")}
          className="input"
        />
      </Field>
      <Field label="Excerpt (shown in listings)">
        <textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} className="input h-20" />
      </Field>
      <Field label="Content">
        <textarea value={form.content} onChange={(e) => update("content", e.target.value)} className="input h-60" />
      </Field>

      <ImageUploader
        label="Cover image"
        value={form.cover_image_url ?? ""}
        onChange={(url) => update("cover_image_url", url)}
      />

      <Field label="Category">
        <select value={form.category_id ?? ""} onChange={(e) => update("category_id", e.target.value || null)} className="input">
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

      <Field label="Status">
        <select value={form.status} onChange={(e) => update("status", e.target.value as Article["status"])} className="input">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </Field>

      {error && <p className="text-coral font-mono text-sm">{error}</p>}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-ink text-paper font-mono text-xs uppercase tracking-widest px-6 py-3 disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create article"}
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
