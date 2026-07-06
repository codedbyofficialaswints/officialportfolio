"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/types";

export default function AdminThemePage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setSettings(data as SiteSettings);
        setLoading(false);
      });
  }, [supabase]);

  function updateColor(key: keyof SiteSettings["colors"], value: string) {
    setSettings((s) => ({ ...s, colors: { ...s.colors, [key]: value } }));
  }
  function updateFont(key: keyof SiteSettings["fonts"], value: string) {
    setSettings((s) => ({ ...s, fonts: { ...s.fonts, [key]: value } }));
  }
  function updateField<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await supabase.from("site_settings").update(settings).eq("id", 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <p className="font-mono text-sm text-muted">Loading…</p>;

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-12 pb-24">
      <div>
        <h1 className="font-display text-3xl mb-2">Theme &amp; site settings</h1>
        <p className="text-sm text-muted">
          Changes here apply live across the whole site — colors, type, and your bio/contact info.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-coral">Colors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(Object.keys(settings.colors) as (keyof SiteSettings["colors"])[]).map((key) => (
            <div key={key} className="space-y-1">
              <label className="font-mono text-xs uppercase tracking-widest text-muted">{key}</label>
              <div className="flex items-center gap-2 border hairline bg-white px-2 py-1.5">
                <input
                  type="color"
                  value={settings.colors[key]}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="w-8 h-8 border-0 p-0 bg-transparent"
                />
                <input
                  value={settings.colors[key]}
                  onChange={(e) => updateColor(key, e.target.value)}
                  className="flex-1 text-sm font-mono outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-coral">Typography</h2>
        <p className="text-xs text-muted">
          Enter any Google Fonts family name exactly as it appears on fonts.google.com.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {(Object.keys(settings.fonts) as (keyof SiteSettings["fonts"])[]).map((key) => (
            <div key={key} className="space-y-1">
              <label className="font-mono text-xs uppercase tracking-widest text-muted capitalize">{key}</label>
              <input
                value={settings.fonts[key]}
                onChange={(e) => updateFont(key, e.target.value)}
                className="input"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-coral">Site info</h2>
        <Field label="Site name">
          <input value={settings.site_name} onChange={(e) => updateField("site_name", e.target.value)} className="input" />
        </Field>
        <Field label="Tagline (hero)">
          <input value={settings.tagline} onChange={(e) => updateField("tagline", e.target.value)} className="input" />
        </Field>
        <Field label="Role label (status rail)">
          <input value={settings.role_label} onChange={(e) => updateField("role_label", e.target.value)} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Location">
            <input value={settings.location} onChange={(e) => updateField("location", e.target.value)} className="input" />
          </Field>
          <Field label="Timezone (IANA, e.g. Asia/Kolkata)">
            <input value={settings.timezone} onChange={(e) => updateField("timezone", e.target.value)} className="input" />
          </Field>
        </div>
        <Field label="Availability status">
          <input value={settings.availability} onChange={(e) => updateField("availability", e.target.value)} className="input" />
        </Field>
        <Field label="Instagram URL">
          <input value={settings.instagram_url} onChange={(e) => updateField("instagram_url", e.target.value)} className="input" />
        </Field>
        <Field label="Contact email">
          <input value={settings.contact_email} onChange={(e) => updateField("contact_email", e.target.value)} className="input" />
        </Field>
        <Field label="About page bio">
          <textarea value={settings.about_bio} onChange={(e) => updateField("about_bio", e.target.value)} className="input h-32" />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-coral">Layout</h2>
        <Field label="Corner radius (e.g. 0px, 8px, 16px)">
          <input
            value={settings.layout.radius}
            onChange={(e) => setSettings((s) => ({ ...s, layout: { ...s.layout, radius: e.target.value } }))}
            className="input"
          />
        </Field>
      </section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="bg-ink text-paper font-mono text-xs uppercase tracking-widest px-6 py-3 disabled:opacity-50">
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-green-600 font-mono text-xs">Saved ✓</span>}
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
