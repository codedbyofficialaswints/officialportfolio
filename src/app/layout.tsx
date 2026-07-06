import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import FontLoader from "@/components/FontLoader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/types";

export const metadata: Metadata = {
  title: "Aswin T. — Graphic Design & AI Systems",
  description:
    "Portfolio of Aswin T. — graphic design, AI, prompt engineering, web development and automation.",
};

async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    return (data as SiteSettings) ?? DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className="font-body">
        <ThemeProvider initialSettings={settings}>
          <FontLoader fonts={settings.fonts} />
          <Nav />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
