export type SiteSettings = {
  id: number;
  site_name: string;
  tagline: string;
  role_label: string;
  location: string;
  timezone: string;
  availability: string;
  instagram_url: string;
  contact_email: string;
  about_bio: string;
  colors: {
    ink: string;
    paper: string;
    cobalt: string;
    coral: string;
    line: string;
    muted: string;
  };
  fonts: {
    display: string;
    body: string;
    mono: string;
  };
  layout: {
    heroStyle: string;
    projectListStyle: string;
    radius: string;
  };
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  kind: "project" | "article";
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  cover_image_url: string;
  gallery: string[];
  category_id: string | null;
  tags: string[];
  year: number | null;
  client: string;
  role: string;
  link_url: string;
  featured: boolean;
  grid_size: "1x1" | "2x1" | "1x2" | "2x2";
  sort_order: number;
  status: "draft" | "published";
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category_id: string | null;
  tags: string[];
  sort_order: number;
  status: "draft" | "published";
  published_at: string | null;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_name: "Aswin T.",
  tagline: "Design systems. Automate everything.",
  role_label: "Graphic Designer & AI Systems Builder",
  location: "India",
  timezone: "Asia/Kolkata",
  availability: "Open for select projects",
  instagram_url: "https://www.instagram.com/officialaswints",
  contact_email: "",
  about_bio:
    "I'm Aswin T., a graphic designer by profession, and a builder of AI systems on the side — prompt engineering, automations, and advanced web experiences like this one.",
  colors: {
    ink: "#121214",
    paper: "#EAE7E0",
    cobalt: "#2454FF",
    coral: "#FF5A36",
    line: "#D8D4C9",
    muted: "#6B685F",
  },
  fonts: { display: "Fraunces", body: "Inter", mono: "JetBrains Mono" },
  layout: { heroStyle: "grid-distort", projectListStyle: "editorial-rows", radius: "0px" },
};
