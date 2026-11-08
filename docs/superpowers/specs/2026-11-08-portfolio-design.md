# Developer Portfolio: Design Spec

**Date:** 2026-11-08
**Status:** Awaiting review
**Owner:** the site owner (Information Technology student, full-stack)

## 1. Goal

A personal portfolio website that helps an **Information Technology student** land an **internship / OJT or a junior full-stack role**.

**Audience:** recruiters, hiring managers and internship coordinators. They skim quickly and often on a phone.

**Success criteria**

- Within ~10 seconds a visitor knows who the owner is, what they build, what they're looking for, and how to reach them.
- Projects read as clear, honest stories of learning and building. They don't need to be technically complex.
- The site is fast and accessible: Lighthouse ≥ 95 in Performance, Accessibility, Best Practices and SEO on desktop and mobile.
- The owner can add or edit a project, journey entry or achievement by editing one content file, without touching components.

**Honesty principle.** The owner is a student with no formal work experience and no large or complex projects yet. All copy, stats and sections must stay accurate at that level. Nothing on the site may imply seniority or work experience the owner doesn't have. Growth, curiosity and clear thinking are what the site sells.

## 2. Decisions

| Topic | Decision |
|---|---|
| Framework | Astro 5, static output, TypeScript |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) plus a small set of CSS custom properties for tokens |
| Hosting | Netlify (static deploy from GitHub) |
| Contact form | Netlify Forms |
| Content | Astro content collections, one file per item, validated by Zod schemas |
| Visual direction | Dark "soft glow", **monochrome**: white light on near-black. **No purple or other coloured gradients.** Colour comes from project screenshots. |
| Theme | Dark only, no light-mode toggle |
| Language | English only, no blog |
| Motion | Polished but purposeful. Small vanilla scripts with no animation library. Fully disabled under `prefers-reduced-motion`. |

## 3. Visual system

**Colour tokens** (defined once in `src/styles/global.css` as CSS variables and exposed to Tailwind via `@theme`):

| Token | Value | Use |
|---|---|---|
| `--bg` | `#09090b` | page background |
| `--surface-1` | `#111113` | cards, form panel |
| `--line` | `#27272a` | borders, dividers |
| `--text-1` | `#f4f4f5` | headings, primary text, primary button fill |
| `--text-2` | `#a1a1aa` | body copy |
| `--text-3` | `#71717a` | labels, metadata (must still pass 4.5:1 on `--bg`; adjust if it fails) |
| `--glow` | `rgb(255 255 255 / 0.11)` | radial top glow |

**Type**

- **Inter** (variable) for UI and headings. Headings are heavy (800) with tight tracking (≈ −0.035em).
- **JetBrains Mono** for labels, section numbers ("01 / Selected work"), tags and code.
- Both are self-hosted via `@fontsource-variable/*`, so there are no third-party font requests.

**Signature details**

- A soft white radial glow sits at the top of the hero and the bottom of the contact section.
- A faint dot grid in the hero fades out downward (CSS mask).
- Section labels are monospaced and numbered: `01 / Selected work`, `02 / Track record`, `03 / Journey`, `04 / Contact`.
- Buttons: primary is solid `--text-1` on `--bg`; secondary is outlined `--line`.
- Focus rings: a visible 2px `--text-1` outline with offset on every interactive element.

## 4. Information architecture

### 4.1 Home page (`/`): sections in order

1. **Nav** (sticky, with a translucent blurred background after scrolling): name/wordmark · Projects · Achievements · Journey · Contact · `CV ↓`. On mobile it collapses into a menu button that opens a full-width sheet.
2. **Me** (hero + about + stack):
   - Status pill: e.g. "Open to internships & junior roles · Graduating 20XX" (from config).
   - `H1`: name, then a dimmed second line: "Full-stack developer · IT student" (from config).
   - A 2–3 sentence bio in honest student voice.
   - Buttons: View projects (scrolls) · Download CV · GitHub.
   - Photo (4:5, rounded) with a location tag. If there's no photo, the hero becomes single-column.
   - Stack row: labelled list of technologies with small monochrome icons.
3. **Projects** (`01 / Selected work`): the first `featured` project is a large two-column card; the rest sit in a 2-column grid (1 column on mobile). Each card shows the cover, title, one-line summary, stack tags and "Read case study →", and links to `/projects/[slug]`.
4. **Achievements** (`02 / Track record`):
   - Stats row (up to 4). The row is hidden when `stats` is empty.
   - Two panels: **Certifications** (name, issuer, year, "Verify ↗") and **Awards & hackathons** (name, short context, year). An empty panel is hidden. If both are empty and there are no stats, the whole section and its nav link are hidden.
5. **Journey** (`03 / Journey`): a vertical timeline of mixed entries, newest first. Each entry shows a type label (🎓 Education · 👥 Org & leadership · 💼 Freelance · 🚀 Milestone), date range ("Present" when there's no end), title, place, short text and optional tags. The newest entry's dot is highlighted.
6. **Contact** (`04 / Contact`): heading, a one-line invitation, and link rows (email with a "Copy" button, LinkedIn, GitHub, Résumé PDF) on the left; the form on the right. On mobile the form sits below the links.
7. **Footer:** © year + name · "Built with Astro · Hosted on Netlify" · back-to-top link.

### 4.2 Case study page (`/projects/[slug]`)

- Back link "← All projects" (returns to `/#projects`).
- Header: label "Case study · {year}", `H1` title, lead summary, and a meta row: **Role · Timeline · Type · Stack**. A meta cell is omitted when its field is empty.
- Buttons: Live demo ↗ and Source code ↗, each shown only if its URL exists.
- Large cover image, sharing a View Transition name with the home page card cover.
- Body: two columns on desktop. A sticky **outline generated from the Markdown's `##` headings** sits on the left (current section highlighted as you scroll); the prose is on the right. On mobile there's no outline, just a single column.
- Prose styles: `##`/`###` headings, paragraphs, lists, images (inside rounded bordered frames), syntax-highlighted code blocks (Shiki, a monochrome-friendly theme such as `github-dark-dimmed` or `min-dark`), and blockquotes styled as the "What I learned" pull-quote.
- Footer: previous / next project links, following the same order as the home page.

**Recommended case-study template** (a starting point, not enforced):
`## Overview` → `## What I built` → `## How it works` → `## What I'd improve` → `## What I learned`.
Writers may add or remove headings freely, for example `## Hardest challenge` or `## Results`.

### 4.3 Other pages

- `/thanks`: the form success page, used only when JavaScript is off. It links back home.
- `/404`: styled not-found page with a link home.

## 5. Content model

All content lives in `src/content/` (collections) and `src/site.ts` (config). The scaffold ships with **clearly marked placeholder content** (`TODO:` markers and "Project One / Two / Three") for the owner to replace.

### 5.1 `projects` collection (`src/content/projects/*.md`)

```ts
{
  title: string,
  summary: string,                     // one sentence, used on cards and as the case-study lead
  cover: image().optional(),           // relative image path; neutral placeholder if missing
  coverAlt: string.optional(),         // required if cover is set (enforced via refine)
  year: number,
  role: string.optional(),             // e.g. "Solo · full-stack", "Team of 4 · back end"
  timeline: string.optional(),         // e.g. "6 weeks"
  type: 'capstone' | 'school' | 'personal' | 'client',
  stack: string[],                     // min 1
  liveUrl: url.optional(),
  repoUrl: url.optional(),
  featured: boolean.default(false),
  order: number,                       // ascending sort on home page and prev/next
  draft: boolean.default(false),       // drafts excluded from the production build
}
```

### 5.2 `journey` collection (`src/content/journey/*.md`)

```ts
{
  type: 'education' | 'org' | 'freelance' | 'milestone',
  title: string,                       // e.g. "BS Information Technology", "Web Lead"
  place: string.optional(),            // school, org, client
  start: date,                          // stored as YYYY-MM; shown as "Mon YYYY"
  end: date.optional(),                 // missing means "Present"
  tags: string[].default([]),
}
// body: 1–3 sentences of description
```
Sorted by `start`, newest first.

### 5.3 `achievements` data (`src/content/achievements.json`, a `file()` collection or a typed import)

```ts
{
  stats: { value: string, label: string }[],          // max 4; value like "8" or "2"
  certifications: { name, issuer, year, url? }[],
  awards: { name, context?, year }[],
}
```
Stat values that are numbers count up; non-numeric values render as-is.

### 5.4 Site config (`src/site.ts`)

`name`, `role` ("Full-stack developer"), `studentLine` ("Information Technology student"), `status` (badge text), `graduationYear`, `location`, `bio`, `email`, `socials` (`github`, `linkedin`, optional others), `cvPath` (`/cv.pdf` in `public/`), `photo` (optional), `stack` (ordered list of `{ name, icon }`), `seo` (title, description, OG image).

## 6. File structure

```
Portfolio/
├─ astro.config.mjs
├─ netlify.toml               # build cmd, publish dir, security + cache headers
├─ package.json
├─ tsconfig.json
├─ public/
│  ├─ cv.pdf                  # placeholder until replaced
│  ├─ favicon.svg
│  └─ og.png
├─ src/
│  ├─ site.ts
│  ├─ content.config.ts       # collection schemas
│  ├─ content/
│  │  ├─ projects/            # *.md + images
│  │  ├─ journey/
│  │  └─ achievements.json
│  ├─ assets/                 # photo, icons
│  ├─ styles/global.css       # tokens, @theme, base, prose styles
│  ├─ layouts/BaseLayout.astro    # <head>, SEO/OG, fonts, ClientRouter, Nav, Footer
│  ├─ components/
│  │  ├─ Nav.astro  Footer.astro  SectionHeading.astro
│  │  ├─ Hero.astro  StackRow.astro
│  │  ├─ ProjectCard.astro  ProjectsSection.astro
│  │  ├─ AchievementsSection.astro  StatCounter.astro
│  │  ├─ JourneySection.astro  JourneyItem.astro
│  │  ├─ ContactSection.astro  ContactForm.astro
│  │  └─ CaseStudyToc.astro
│  ├─ scripts/
│  │  ├─ reveal.ts            # IntersectionObserver scroll reveals
│  │  ├─ glow.ts              # pointer-follow card glow
│  │  ├─ counter.ts           # stat count-up
│  │  ├─ timeline.ts          # journey line draw
│  │  ├─ toc.ts               # active heading in case-study outline
│  │  └─ contact.ts           # AJAX submit for Netlify Forms
│  └─ pages/
│     ├─ index.astro
│     ├─ projects/[slug].astro
│     ├─ thanks.astro
│     └─ 404.astro
└─ docs/superpowers/specs/
```

Each component owns one section and takes typed props or reads one collection. Scripts are standalone modules that progressively enhance plain HTML.

## 7. Motion & interaction

All motion is decoration on top of content that already works without it. Under `prefers-reduced-motion: reduce`, every effect below is skipped and content shows immediately in its final state.

| Effect | Implementation |
|---|---|
| Scroll reveal | Elements with `data-reveal` start at `opacity:0; translateY(12px)` **only when the `js` class is on `<html>`**, and animate in once (≈500ms, ease-out, light stagger) when they intersect the viewport. Without JS, content is simply visible. |
| Card glow | `pointermove` sets `--x`/`--y` on the card; a `::before` radial-gradient (`rgb(255 255 255 / .08)`) follows the pointer. The border brightens slightly on hover. Pointer devices only (`(hover: hover)`). |
| Stat count-up | Numeric stats count from 0 to their value over ≈1.2s when first visible. The final value is in the HTML for no-JS visitors and screen readers (`aria-label`). |
| Journey line | The timeline line's `scaleY` follows scroll progress through the section; dots fade in as the line reaches them. |
| Page transitions | Astro `<ClientRouter />`. The project cover uses `transition:name="cover-{slug}"`, so it morphs from card to case-study header. Default crossfade elsewhere. Scripts re-initialise on `astro:page-load`. |
| Hover details | Arrow nudges on links, subtle button lift. 150–200ms transitions. |

## 8. Contact form

- Markup: `<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks">` with a hidden `form-name` input, a visually hidden honeypot field, and fields **name**, **email**, **message**, all required.
- **With JS** (`contact.ts`): intercept submit, check validity with native constraint validation plus inline messages, then `fetch('/', { method:'POST', body: URLSearchParams })`. While sending, the button is disabled and reads "Sending…". On success, the form is replaced by an inline success message (focus moves to it, `aria-live="polite"`). On failure, an inline error appears with the email address as a fallback, and the form data is kept.
- **Without JS:** the native post goes to `/thanks`.
- The email "Copy" button uses the Clipboard API, shows a "Copied" confirmation, and stays a `mailto:` link where the clipboard isn't available.

## 9. SEO, accessibility & performance

- **SEO:** a per-page `<title>` and meta description, Open Graph and Twitter cards (default `og.png`, with each project's cover on its case study), canonical URL, `sitemap` via `@astrojs/sitemap`, `robots.txt`.
- **Accessibility:** semantic landmarks, one `h1` per page, logical heading order, skip-to-content link, visible focus rings, alt text required for covers (schema), labelled form fields with error text linked via `aria-describedby`, contrast ≥ 4.5:1 for body text, tap targets ≥ 44px, a mobile menu that traps focus and closes on Esc.
- **Performance:** static HTML with tiny scripts, `astro:assets` responsive images (AVIF/WebP, lazy below the fold, eager plus `fetchpriority="high"` for the hero photo), self-hosted subset fonts with `font-display: swap`, and no client framework.
- **Netlify headers:** long-cache immutable for `/_astro/*`, plus basic security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`).

## 10. Edge cases

| Situation | Behaviour |
|---|---|
| No featured project | The first project by `order` gets the large card. |
| Only 1 project | Shown as the large card; the grid is omitted. |
| Project without cover | Neutral gradient placeholder showing the project title in mono. |
| Project without live/repo URL | That button is omitted. |
| Empty achievements | The section and its nav link are hidden. |
| No photo | The hero falls back to a single column with centred alignment. |
| `draft: true` | Excluded from production builds, routes and prev/next. |
| Very long titles or tags | Wrap gracefully. Tags wrap onto multiple lines with no horizontal overflow. |
| Narrow screens (≥ 320px) | No horizontal scroll; 16–20px side gutters. |

## 11. Verification

1. `npm run astro check` passes: no type or schema errors.
2. `npm run build` passes and the output contains `/`, every project page, `/thanks` and `/404`.
3. Visual review in a browser at 375px, 768px and 1280px+ widths: all sections, nav menu, case study, hover states, reduced-motion mode.
4. Lighthouse (desktop + mobile) ≥ 95 in all four categories on `/` and one case study.
5. Accessibility pass: keyboard-only navigation through the whole site, contrast check, screen-reader labels on the form and counters.
6. After the first Netlify deploy, submit the live form and confirm the submission appears in the Netlify dashboard.

## 12. Out of scope (for now)

Blog · light-mode toggle · CMS / admin UI · multiple languages · analytics · 3D/WebGL effects · GSAP. Any of these can be added later without restructuring.

## 13. Owner content checklist (to replace placeholders)

- Name, graduation year, location, 2–3 sentence bio, status line
- Photo (portrait, ideally ≥ 800×1000)
- Email, GitHub, LinkedIn URLs
- CV as PDF
- Stack list
- For each project: title, one-line summary, screenshots, role, timeline, type, stack, links, case-study text
- Journey entries: education, orgs/leadership, freelance work, self-learning milestones
- Achievements: certifications (with verify links), awards/hackathons, up to 4 honest stats
