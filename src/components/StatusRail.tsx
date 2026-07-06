"use client";

import { useEffect, useState } from "react";
import { useSiteSettings } from "./ThemeProvider";

export default function StatusRail() {
  const settings = useSiteSettings();
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-GB", {
            timeZone: settings.timezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(new Date())
        );
      } catch {
        setTime(new Date().toLocaleTimeString());
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [settings.timezone]);

  const rows: [string, string][] = [
    ["Role", settings.role_label],
    ["Based in", settings.location],
    ["Local time", time],
    ["Status", settings.availability],
  ];

  return (
    <aside className="font-mono text-xs uppercase tracking-widest text-muted space-y-6 border-r hairline pr-6 h-fit sticky top-28">
      {rows.map(([label, value]) => (
        <div key={label} className="space-y-1">
          <div className="opacity-50">{label}</div>
          <div className="text-ink normal-case tracking-normal text-sm">{value}</div>
        </div>
      ))}
      <div className="w-2 h-2 rounded-full bg-coral animate-pulse" aria-hidden />
    </aside>
  );
}
