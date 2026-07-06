import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/types";

export const metadata = { title: "About — Aswin T." };

export default async function AboutPage() {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const settings = (data as SiteSettings) ?? DEFAULT_SETTINGS;

  return (
    <div className="px-6 md:px-10 pt-32 pb-24 max-w-3xl mx-auto">
      <h1 className="font-display text-5xl md:text-7xl mb-12">About</h1>
      <div className="space-y-6 text-lg leading-relaxed whitespace-pre-wrap">{settings.about_bio}</div>
      <p className="font-mono text-sm uppercase tracking-widest text-muted pt-12">
        Design · AI &amp; Prompt Engineering · Web Development · Automation
      </p>
    </div>
  );
}
