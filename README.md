# Aiyebola Taye — Portfolio + Admin Studio

A custom portfolio site with a private admin area for managing projects, media,
experience, profile content, contact messages, and traffic metrics.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Supabase (Postgres, Storage, Auth) · Recharts**.

---

## What it does

**Public site (`/`)**
- Hero with name, headline, availability, and contact actions
- Selected work grid fed from the database
- Project detail pages with long description, tech stack, live/source links, and an image/video gallery
- Experience timeline
- About section with photo, bio, and skills grouped by category
- Contact form that writes to your inbox table
- Light/dark theme toggle
- Anonymous page-view tracking (one per path per browser session)

**Admin studio (`/admin`, protected)**
- Overview: total views, 7-day views, unread messages, published projects, 14-day chart, top pages, inbox preview
- Projects: create, edit, publish/unpublish, feature, reorder, delete
- Media: upload images/videos to Supabase Storage or paste a URL, captions, ordering
- Experience: create/edit/delete roles with month ranges and "current" flag
- Profile: name, headline, bio, contact links, photo, résumé PDF, skills
- Messages: read/unread toggle, reply by email, delete

**Demo mode**
- With no Supabase keys the site runs immediately with realistic sample content.
- Nothing is saved. `/admin` is open in demo mode, so do not deploy without keys.

---

## 1. Run locally (demo mode, no accounts needed)

```bash
npm install
npm run dev
```

Open http://localhost:3000. You will see the sample content from
`lib/demo-data.ts`. Admin lives at http://localhost:3000/admin.

---

## 2. Connect Supabase (5–10 minutes)

1. Create a project at https://supabase.com (free tier is enough).
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it.
   This creates all tables, row-level security policies, and the public `media`
   storage bucket.
3. Optional: run `supabase/seed.sql` to load starter content you can edit.
4. Create your admin user: **Authentication → Users → Add user**. Enter your
   email and a strong password, and confirm the user (or use "Send invite").
   Sign-ups are disabled by default, which is what you want — this is a
   single-owner admin.
5. Go to **Project Settings → API** and copy the Project URL and the `anon`
   public key.
6. Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

7. Restart `npm run dev`, then sign in at http://localhost:3000/login.

### Storage
The schema creates a public bucket named `media` with:
- public read
- authenticated insert/update/delete

Uploads happen from the browser using your signed-in session. Default Supabase
file size limit is 50 MB; raise it in **Storage → Settings** if you upload long
videos (or use YouTube links instead).

---

## 3. Deploy to Vercel

1. Push this folder to a GitHub repository.
2. At https://vercel.com/new, import the repository.
3. Framework preset: **Next.js** (auto-detected). Build command `npm run build`.
4. Add environment variables (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = your production URL (e.g. `https://taye.vercel.app`)
5. Deploy. Then in Supabase **Authentication → URL Configuration**:
   - Site URL: your production URL
   - Redirect URLs: add your production URL and `http://localhost:3000`
6. Optional: add a custom domain in Vercel → Settings → Domains, then update
   `NEXT_PUBLIC_SITE_URL`.

### CLI alternative

```bash
npm i -g vercel
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_SITE_URL
vercel --prod
```

---

## 4. Day-to-day admin workflow

- **Projects → New project**: title, tagline, description (blank line = new
  paragraph), comma-separated tech stack, live/repo URLs, cover image, status,
  sort order, published toggle.
- **Edit project → Gallery**: upload screenshots or attach YouTube links, add
  captions and order.
- **Profile**: photo, résumé PDF, links, bio. The résumé appears as "Download CV"
  in the hero when set.
- **Experience**: add each role; lower sort order appears first.
- **Messages**: contact form submissions. Mark read, reply via your email client,
  or delete.
- **Overview**: traffic chart and top pages. Views are anonymous and contain no
  personal data.

---

## 5. Project structure

```
app/
  (site)/                 public site (shared header + footer)
    page.tsx              home: hero, work, experience, about, contact
    projects/[slug]/      project detail + gallery
  admin/                  protected studio
    page.tsx              overview + metrics
    projects/             list, new, edit + media manager
    experience/           list, new, edit
    profile/              profile form + skills
    messages/             inbox
  login/                  admin sign in
  api/track/              anonymous page-view endpoint
components/               public + admin components
lib/
  actions.ts              server actions (auth, CRUD, contact)
  data.ts                 typed queries with demo fallback
  demo-data.ts            sample content
  supabase/               browser + server clients
  types.ts                shared types
supabase/
  schema.sql              tables, RLS, storage bucket
  seed.sql                optional starter content
proxy.ts                  session refresh + /admin protection
```

---

## 6. Security model

- RLS is enabled on every table.
- Public can read published projects, project media for published projects,
  experience, skills, and the profile.
- Only authenticated users can write content or read messages and analytics.
- The contact form can insert messages but cannot read them.
- `proxy.ts` refreshes the Supabase session and redirects unauthenticated users
  away from `/admin`.
- Never expose the `service_role` key to the browser. It is not used here.

To add a second admin, create another user in Supabase Auth. All authenticated
users currently share full admin access.

---

## 7. Customising

- Colours and fonts: `app/globals.css` (`:root` / `.dark` tokens).
- Site metadata: `app/layout.tsx`.
- Sample content: `lib/demo-data.ts` (only used when Supabase is not configured).
- Section copy and layout: `app/(site)/page.tsx`.

---

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build
npm start        # run the production build
npm run lint     # eslint
```
