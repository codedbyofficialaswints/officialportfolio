"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/types";

const SettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function useSiteSettings() {
  return useContext(SettingsContext);
}

function applyTheme(settings: SiteSettings) {
  const root = document.documentElement;
  root.style.setProperty("--color-ink", settings.colors.ink);
  root.style.setProperty("--color-paper", settings.colors.paper);
  root.style.setProperty("--color-cobalt", settings.colors.cobalt);
  root.style.setProperty("--color-coral", settings.colors.coral);
  root.style.setProperty("--color-line", settings.colors.line);
  root.style.setProperty("--color-muted", settings.colors.muted);
  root.style.setProperty("--font-display", `'${settings.fonts.display}', serif`);
  root.style.setProperty("--font-body", `'${settings.fonts.body}', sans-serif`);
  root.style.setProperty("--font-mono", `'${settings.fonts.mono}', monospace`);
  root.style.setProperty("--radius", settings.layout.radius);
}

export default function ThemeProvider({
  initialSettings,
  children,
}: {
  initialSettings: SiteSettings;
  children: React.ReactNode;
}) {
  const [settings] = useState<SiteSettings>(initialSettings);

  useEffect(() => {
    applyTheme(settings);
  }, [settings]);

  return (
    <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
  );
}
