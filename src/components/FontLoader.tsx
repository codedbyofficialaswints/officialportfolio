"use client";

import { useEffect } from "react";
import { SiteSettings } from "@/lib/types";

// Builds a Google Fonts stylesheet URL from the font family names stored in
// site_settings.fonts, so changing fonts in the admin panel changes the
// live site without a redeploy.
export default function FontLoader({ fonts }: { fonts: SiteSettings["fonts"] }) {
  useEffect(() => {
    const families = Array.from(new Set([fonts.display, fonts.body, fonts.mono]))
      .filter(Boolean)
      .map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800;900`)
      .join("&");

    const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;

    const id = "dynamic-google-fonts";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [fonts.display, fonts.body, fonts.mono]);

  return null;
}
