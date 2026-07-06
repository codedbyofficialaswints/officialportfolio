import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/types";

export const metadata = { title: "Contact — Aswin T." };

export default async function ContactPage() {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const settings = (data as SiteSettings) ?? DEFAULT_SETTINGS;

  return (
    <div className="px-6 md:px-10 pt-32 pb-24 max-w-3xl mx-auto">
      <h1 className="font-display text-5xl md:text-7xl mb-6 leading-[0.95]">
        Tell me about
        <br />
        the project.
      </h1>
      <p className="text-lg text-muted mb-12 max-w-xl">
        Whether it&apos;s a brand identity, a product build, or an automation that saves you ten
        hours a week — reach out directly.
      </p>
      <div className="space-y-4 font-mono text-sm uppercase tracking-widest">
        {settings.contact_email && (
          <a
            href={`mailto:${settings.contact_email}`}
            className="block border-b hairline pb-4 hover:text-cobalt transition-colors"
          >
            {settings.contact_email}
          </a>
        )}
        <a
          href={settings.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block border-b hairline pb-4 hover:text-coral transition-colors"
        >
          Instagram — @officialaswints
        </a>
      </div>
    </div>
  );
}
