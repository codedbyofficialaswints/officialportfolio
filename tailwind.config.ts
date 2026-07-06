import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        cobalt: "var(--color-cobalt)",
        coral: "var(--color-coral)",
        line: "var(--color-line)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
    },
  },
  plugins: [],
};
export default config;
