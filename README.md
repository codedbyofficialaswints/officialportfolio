# Aswin T. — Portfolio

A 3D interactive portfolio built with Next.js, React Three Fiber, Tailwind, and Supabase.
Everything in the admin panel (`/admin`) writes to Supabase, so you get 100% control over
projects, articles, categories, theme colors, fonts, and site copy — no redeploy needed for
content or design changes.

## What's inside

- **Public site**: hero with an interactive 3D tile grid, editorial project list, project/article
  detail pages, about, contact.
- **Admin panel** (`/admin`): protected by Supabase Auth. Full CRUD for projects and articles,
  category management, and a theme editor (colors, fonts, layout, bio, contact info, socials).
- **Storage**: image uploads for cover images and galleries go to Supabase Storage.

## 1. Create a Supabase project

1. Go to https://supabase.com → New project. Pick any name/region, save your database password.
2. Once it's ready, go to **Project Settings → API**. Copy the **Project URL** and the
   **anon public key**.
3. Go to **SQL Editor → New query**, paste the entire contents of `supabase/schema.sql`
   from this repo, and run it. This creates all tables and security rules.
4. Go to **Storage → New bucket**. Name it exactly `media`, and toggle **Public bucket: ON**.
5. Go to **Authentication → Users → Add user** and create yourself an account (your email +
   a password). This is the *only* login the admin panel accepts — there's no public signup.

## 2. Run it locally

```bash
npm install
cp .env.example .env.local
# paste your Supabase URL + anon key into .env.local
npm run dev
```

Visit `http://localhost:3000` for the site, `http://localhost:3000/admin/login` to sign in
with the Supabase user you created.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial portfolio"
gh repo create aswin-portfolio --private --source=. --push
# or create a repo on github.com and:
# git remote add origin https://github.com/<you>/aswin-portfolio.git
# git push -u origin main
```

## 4. Deploy to Vercel

1. Go to https://vercel.com → **Add New → Project** → import your GitHub repo.
2. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (same values as your `.env.local`)
3. Click **Deploy**. Every future `git push` redeploys automatically.
4. Add your custom domain under **Project → Settings → Domains** once you have one.

## 5. Using the admin panel

- Go to `yourdomain.com/admin/login` and sign in.
- **Projects / Articles**: create, edit, delete, set draft vs. published, set homepage sort
  order and grid tile size.
- **Categories**: tag projects/articles by discipline (e.g. "Brand Identity", "AI Automation").
- **Theme & Site**: change every color, the three font families (any Google Font name), your
  bio, availability status, location, timezone, Instagram URL, and contact email — all live,
  no code changes.

## Extending it

This is a strong, fully-working foundation, not a locked template — it's plain Next.js/React,
so you (or I, in a follow-up) can add things like: drag-and-drop reordering in the admin grid,
a rich text/markdown editor instead of plain textareas, password reset flow, multiple admin
users, or a more elaborate 3D scene per project. Everything is normal, readable code, so nothing
here is a black box.

## Tech stack

Next.js 14 (App Router) · React Three Fiber / Three.js · Tailwind CSS · Supabase
(Postgres + Auth + Storage) · deployed on Vercel.
