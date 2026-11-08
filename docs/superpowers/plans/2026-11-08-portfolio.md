# Developer Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, monochrome soft-glow portfolio site for an Information Technology student (Me → Projects → Achievements → Journey → Contact, plus case-study pages), ready to deploy on Netlify.

**Architecture:** Astro 5 static site. Content comes from typed content collections in `src/content/`, rendered by one `.astro` component per section. Pure helpers in `src/lib/` hold all ordering, formatting and visibility logic, so they can be unit-tested. Interaction is progressive enhancement: small vanilla TS modules in `src/scripts/` that run on `astro:page-load`.

**Tech Stack:** Astro `^5.18` (do **not** use Astro 6/7: the spec and these APIs target 5), Tailwind CSS `^4.3` via `@tailwindcss/vite`, TypeScript strict, `@astrojs/sitemap`, `@astrojs/check`, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`. Tests: Vitest `^3` (unit + built-HTML tests with `cheerio`), Playwright (Chromium) for browser behaviour. Node 24 is installed.

**Spec:** `docs/superpowers/specs/2026-11-08-portfolio-design.md`. Read it before starting any task. Section numbers below (§n) refer to it.

## Global Constraints

- Audience copy: "Information Technology student". Never "Computer Science", and nothing that implies work experience or seniority (§1 honesty principle).
- Colours are only the tokens in §3: `--bg #09090b`, `--surface-1 #111113`, `--line #27272a`, `--text-1 #f4f4f5`, `--text-2 #a1a1aa`, `--text-3 #71717a`, `--glow rgb(255 255 255 / 0.11)`. **No purple or any other hued gradients or accents.**
- Dark only. English only (`<html lang="en">`).
- No client framework (React/Vue etc.) and no animation library (no GSAP, no Motion).
- Every motion effect is skipped under `prefers-reduced-motion: reduce`, and every piece of content is visible with JS disabled.
- Fonts are self-hosted via `@fontsource-variable/*`. No Google Fonts or other third-party requests.
- Placeholder content is clearly marked with `TODO:` so the owner can find it with search.
- Section labels: `01 / Selected work`, `02 / Track record`, `03 / Journey`, `04 / Contact`.
- Status badge default: `Open to internships & junior roles · Graduating 20XX`.
- Commit after every task with a conventional message, ending with the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **The owner fills content partially** (a project with no cover or no links, no photo, empty achievements). The layout must stay intact, with no empty boxes or dead buttons. Tests are in Tasks 2, 4, 5, 6 and 8.
2. **JS disabled or a script throws.** Everything stays visible, and the form still posts to `/thanks`. The test is in Task 9 (`no-JS` Playwright project).
3. **Client-side navigation** (home → case study → back home via `<ClientRouter />`). Scripts must re-initialise, so revealed sections stay visible and the glow, counters and outline keep working. The test is in Task 9.
4. **Narrow phones (320px) with long titles and tags.** There must be no horizontal page scroll. The test is in Task 9.
5. **Netlify Forms detection and AJAX body.** The form must be in static HTML with `name="contact"`, `data-netlify="true"` and a hidden `form-name`, and the AJAX POST body must include `form-name=contact`. Otherwise submissions silently vanish. Tests are in Task 7.

---

### Task 1: Project scaffold, tokens and test harness

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `netlify.toml`, `vitest.config.ts`, `playwright.config.ts`, `src/styles/global.css`, `src/layouts/BaseLayout.astro` (minimal), `src/pages/index.astro` (stub), `public/favicon.svg`, `public/robots.txt`, `tests/build/helpers.ts`, `tests/build/smoke.test.ts`

**Interfaces:**
- Produces: `BaseLayout` props `{ title: string; description: string; image?: string }` (extended in Task 3). `tests/build/helpers.ts` exports `loadPage(route: string): cheerio.CheerioAPI`, which reads `dist/<route>/index.html` (or `dist/index.html` for `/`, `dist/404.html` for `/404`). npm scripts: `dev`, `build`, `preview`, `check` (`astro check`), `test:unit` (`vitest run tests/unit`), `test:build` (`astro build && vitest run tests/build`), `test:e2e` (`playwright test`), `test` (all three in sequence).

- [ ] **Step 1:** `git init`, keeping the existing `.gitignore`. Create `package.json` (`"type": "module"`, private) and install: `astro@^5.18 @astrojs/sitemap @astrojs/check typescript tailwindcss@^4.3 @tailwindcss/vite @fontsource-variable/inter @fontsource-variable/jetbrains-mono` and dev: `vitest@^3 cheerio @playwright/test`. Then run `npx playwright install chromium`.
- [ ] **Step 2:** `astro.config.mjs`: `site: 'https://yourname.netlify.app'` (with a `// TODO:` comment), `output: 'static'`, `integrations: [sitemap()]`, `vite.plugins: [tailwindcss()]`, `markdown.shikiConfig.theme: 'github-dark-dimmed'`. `tsconfig.json` extends `astro/tsconfigs/strict`.
- [ ] **Step 3:** `src/styles/global.css`: `@import "tailwindcss";`, the Fontsource imports, then `@theme` mapping the §3 tokens to `--color-bg`, `--color-surface-1`, `--color-line`, `--color-text-1/2/3`, `--font-sans: "Inter Variable"`, `--font-mono: "JetBrains Mono Variable"`. Base styles: `body` on `bg-bg text-text-2 font-sans antialiased`, headings `text-text-1`, global `:focus-visible` outline 2px `--text-1` with 3px offset, `html { scroll-behavior: smooth }` inside `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Step 4:** `netlify.toml`: build `npm run build`, publish `dist`. Headers: `/_astro/*` gets `Cache-Control: public, max-age=31536000, immutable`; `/*` gets `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`. `public/robots.txt` allows all and points to `/sitemap-index.xml`.
- [ ] **Step 5:** Write `tests/build/smoke.test.ts`: `loadPage('/')` has `html[lang="en"]`, a non-empty `<title>`, and a stylesheet link. Run `npm run test:build`. Expect FAIL (no BaseLayout or index yet).
- [ ] **Step 6:** Create minimal `BaseLayout.astro` (doctype, `lang="en"`, charset, viewport, title, description, imports `global.css`, `<slot />`) and `index.astro` using it. Run `npm run test:build`. Expect PASS. Also run `npm run check`. Expect 0 errors.
- [ ] **Step 7:** `playwright.config.ts`: `webServer: { command: 'npm run build && npm run preview -- --port 4321', port: 4321, reuseExistingServer: true }`, `testDir: 'tests/e2e'`, projects `chromium` (desktop) and `no-js` (`javaScriptEnabled: false`, used only by tests tagged `@nojs` via `grep`). The default project uses `grepInvert: /@nojs/`.
- [ ] **Step 8:** Commit: `chore: scaffold Astro + Tailwind project with test harness`.

---

### Task 2: Content schemas, placeholder content and pure helpers

**Files:**
- Create: `src/content.config.ts`, `src/site.ts`, `src/lib/projects.ts`, `src/lib/journey.ts`, `src/lib/achievements.ts`, `src/lib/toc.ts`, `src/content/projects/project-one.md`, `project-two.md`, `project-three.md`, `src/content/projects/images/project-one.svg`, `project-two.svg`, `src/content/journey/*.md` (4 entries), `src/content/achievements.json`, `public/cv.pdf` (a 1-page placeholder PDF reading "TODO: replace with your CV"), `tests/unit/*.test.ts`

**Interfaces:**
- Produces (collections): `projects` (glob loader, `src/content/projects/*.md`) with the schema in §5.1, plus `.refine(d => !d.cover || !!d.coverAlt, 'coverAlt is required when cover is set')`. `journey` (glob, `src/content/journey/*.md`) per §5.2, with `start`/`end` as `z.coerce.date()`. `achievements` (file loader on `achievements.json`, a single entry with id `main`) per §5.3, with `stats` `.max(4)`.
- Produces (`src/site.ts`): `export const site: SiteConfig` with the fields in §5.4. `photo?: ImageMetadata` stays **undefined** in the placeholder, and `stack: { name: string; icon: string }[]` where `icon` is an inline SVG path string or a simple-icons slug rendered as an inline SVG.
- Produces (`src/lib`, all pure and generic over `{ id: string; data: … }`):
  - `orderProjects<T>(items: T[], opts: { includeDrafts: boolean }): T[]`: removes drafts unless `includeDrafts`, then sorts ascending by `data.order`.
  - `splitFeatured<T>(ordered: T[]): { featured: T | undefined; rest: T[] }`: the first item with `data.featured`, otherwise the first item. `rest` excludes it.
  - `getPrevNext<T>(ordered: T[], id: string): { prev?: T; next?: T }`: wraps around. With fewer than 2 items, both are undefined.
  - `sortJourney<T>(items: T[]): T[]`: newest `data.start` first.
  - `formatRange(start: Date, end?: Date): string`: en-US short month and UTC year joined by an em dash with spaces, e.g. `"Jun 2024 — Present"` or `"Aug 2022 — May 2026"`.
  - `hasAchievements(a: { stats: unknown[]; certifications: unknown[]; awards: unknown[] }): boolean`
  - `parseStat(value: string): { num: number; prefix: string; suffix: string } | null`: `"8"` → `{8,'',''}`, `"3+"` → `{3,'','+'}`, `"100%"` → `{100,'','%'}`, `"A+"` → `null`.
  - `tocFromHeadings(h: { depth: number; slug: string; text: string }[]): { slug: string; text: string }[]`: keeps only depth 2.

- [ ] **Step 1:** Write `tests/unit/projects.test.ts`, `journey.test.ts`, `achievements.test.ts` and `toc.test.ts`, asserting every example above. Also cover these cases: a draft excluded and then included with `includeDrafts: true`; `splitFeatured` with no featured item returns the first item; `splitFeatured([])` returns `{ featured: undefined, rest: [] }`; `getPrevNext` on 3 items for the first id gives prev = last and next = second; `getPrevNext` on 1 item gives `{}`; `hasAchievements` is false only when all three arrays are empty.
- [ ] **Step 2:** Run `npm run test:unit`. Expect FAIL (modules missing).
- [ ] **Step 3:** Implement the four `src/lib` modules with the signatures above.
- [ ] **Step 4:** Run `npm run test:unit`. Expect PASS.
- [ ] **Step 5:** Write `src/content.config.ts` and the placeholder content:
  - **Projects.** Project One is `featured`, order 1, `type: capstone`, has an SVG cover and both URLs. Project Two is order 2, `type: personal`, has an SVG cover and only `repoUrl`. Project Three is order 3, `type: school`, with **no cover, no URLs, no `role` and no `timeline`**, plus a deliberately long title and 7 stack tags. Each body uses the §4.2 template headings, with `TODO:` text written in an honest student voice.
  - **Journey.** One entry each for `education` (BS Information Technology, no `end`), `org`, `freelance` and `milestone`.
  - **Achievements.** 3 honest stats (`"8"` projects built, `"2"` certifications, `"1"` hackathon), 2 certifications and 1 award, all marked `TODO`.
  - **`site.ts`.** `studentLine: 'Information Technology student'`, `status: 'Open to internships & junior roles · Graduating 20XX'`, and `TODO:` values elsewhere.
- [ ] **Step 6:** Run `npm run check` and `npm run build`. Expect 0 errors (the schemas accept the placeholder content).
- [ ] **Step 7:** Commit: `feat: content collections, placeholder content and helpers`.

---

### Task 3: Base layout, SEO, nav and footer

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`, `src/components/SectionHeading.astro`, `src/scripts/nav.ts`, `public/og.png` (1200×630, monochrome, name and role), `tests/build/layout.test.ts`, `tests/e2e/nav.spec.ts`

**Interfaces:**
- Consumes: `site` (Task 2).
- Produces:
  - `BaseLayout` props `{ title: string; description: string; image?: string; showAchievementsLink?: boolean }`. `title` is formatted as `"{title} · {site.name}"`, except on the home page, which passes `site.seo.title`.
  - `SectionHeading` props `{ index: string; label: string; title: string; id: string }`, rendering the mono label `"{index} / {label}"` and an `h2` with that `id`.
  - Section anchor ids used by later tasks: `#me`, `#projects`, `#achievements`, `#journey`, `#contact`. The main element id is `#main`.

- [ ] **Step 1:** Write `tests/build/layout.test.ts` for `/`, asserting:
  - a skip link `a[href="#main"]` is the first focusable element;
  - `meta[name=description]`, `link[rel=canonical]`, `meta[property="og:image"]` and `meta[name="twitter:card"]` are present;
  - nav links point to `#projects`, `#achievements`, `#journey` and `#contact`;
  - the nav has a CV link to `/cv.pdf` with a `download` attribute;
  - the footer contains `Built with Astro`.
  
  Write `tests/e2e/nav.spec.ts`. At a 375px viewport, the menu button has `aria-expanded="false"`; clicking it opens the sheet (`aria-expanded="true"`, focus moves into the sheet); Tab cycles inside it; Esc closes it and returns focus to the button. At 1280px the inline links are visible and the menu button is hidden.
- [ ] **Step 2:** Run `npm run test:build` and `npx playwright test nav`. Expect FAIL.
- [ ] **Step 3:** Implement the layout and components. In `<head>`, an inline script adds class `js` to `<html>`. `<ClientRouter />` comes from `astro:transitions`. Nav: sticky, and gains a `bg-bg/70 backdrop-blur border-b border-line` look once `scrollY > 8` (toggled by `nav.ts` via a `data-scrolled` attribute). `nav.ts` handles the mobile sheet (focus trap, Esc, closes on link click) and initialises on `astro:page-load`. The achievements link renders only when `showAchievementsLink` is true. Footer per §4.1 item 7.
- [ ] **Step 4:** Run both test commands. Expect PASS.
- [ ] **Step 5:** Commit: `feat: base layout with SEO, sticky nav and footer`.

---

### Task 4: "Me" section (hero, bio, stack)

**Files:**
- Create: `src/components/Hero.astro`, `src/components/StackRow.astro`, `tests/build/hero.test.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `site`, `BaseLayout`.
- Produces: `<Hero />` (no props, reads `site`), rendered as `section#me`. `<StackRow items={site.stack} />`.

- [ ] **Step 1:** Write `tests/build/hero.test.ts` for `/`, asserting:
  - exactly one `h1`, which contains `site.name`;
  - the text `Information Technology student` appears;
  - the status pill text equals `site.status`;
  - the buttons link to `#projects`, `/cv.pdf` (with `download`) and the GitHub URL (`target="_blank"`, `rel` includes `noopener`);
  - `#me` has `data-layout="single"`, because the placeholder `photo` is undefined;
  - the stack row lists each `site.stack` name;
  - the page text contains neither `Computer Science` nor `years of experience`.
- [ ] **Step 2:** Run `npm run test:build`. Expect FAIL.
- [ ] **Step 3:** Implement per §4.1 item 2 and §3 signature details:
  - top radial glow as a `::before` using `--glow`;
  - dot grid as a masked `::after`;
  - `data-layout="split"` with the photo (`<Image>` with `loading="eager"` and `fetchpriority="high"`, 4:5 ratio, location tag) when `site.photo` is set, otherwise `"single"` and centred;
  - `h1` with the name, then a dimmed line showing `site.role · IT student`, at 46px desktop / 36px mobile, weight 800, tracking −0.035em.
- [ ] **Step 4:** Run `npm run test:build`. Expect PASS. Look at `/` in `npm run dev` at 375 and 1280px against the approved mockup (`.superpowers/brainstorm/*/content/home-layout.html`).
- [ ] **Step 5:** Commit: `feat: hero section with bio and stack row`.

---

### Task 5: Projects section and card glow

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/ProjectsSection.astro`, `src/components/CoverPlaceholder.astro`, `src/scripts/glow.ts`, `tests/build/projects.test.ts`, `tests/e2e/glow.spec.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `orderProjects`, `splitFeatured` (Task 2), `SectionHeading` (Task 3).
- Produces:
  - `ProjectCard` props `{ project: CollectionEntry<'projects'>; size: 'large' | 'normal' }`. The cover element gets `transition:name={\`cover-${project.id}\`}` (Task 8 reuses this exact name).
  - `CoverPlaceholder` props `{ title: string }`, a neutral gradient with the title in mono.
  - `glow.ts` exports `initGlow(): void`. It targets elements with `[data-glow]` and sets `--x`/`--y` in px on `pointermove`, only when `matchMedia('(hover: hover)')` matches.
- Drafts are included in `npm run dev` only: `includeDrafts: import.meta.env.DEV`.

- [ ] **Step 1:** Write `tests/build/projects.test.ts` for `/#projects`, asserting:
  - the heading label is `01 / Selected work`;
  - exactly one `[data-size="large"]` card, and it is Project One;
  - cards appear in `order` sequence;
  - each card links to `/projects/<id>/`;
  - Project Three's card renders `CoverPlaceholder` (`[data-cover-placeholder]`) and no `<img>`;
  - every `<img>` in the section has non-empty `alt`;
  - Project Three shows all 7 tags.
  
  Write `tests/e2e/glow.spec.ts`: hovering a card at a known offset sets its `--x` style property to approximately that offset.
- [ ] **Step 2:** Run the tests. Expect FAIL.
- [ ] **Step 3:** Implement per §4.1 item 3:
  - the large card is 2-column inside (cover 1.3fr), and the grid is `md:grid-cols-2`;
  - if only one project exists, render the large card alone;
  - the card's `::before` glow is `radial-gradient(260px circle at var(--x) var(--y), rgb(255 255 255 / .08), transparent 65%)`, visible on hover;
  - the border goes from `--line` to `zinc-600` on hover;
  - "Read case study →" has its arrow nudge 3px on hover.
- [ ] **Step 4:** Run the tests. Expect PASS.
- [ ] **Step 5:** Commit: `feat: projects section with featured card and pointer glow`.

---

### Task 6: Achievements and Journey sections

**Files:**
- Create: `src/components/AchievementsSection.astro`, `src/components/StatCounter.astro`, `src/components/JourneySection.astro`, `src/components/JourneyItem.astro`, `src/scripts/counter.ts`, `src/scripts/timeline.ts`, `tests/build/achievements-journey.test.ts`, `tests/e2e/counter.spec.ts`
- Modify: `src/pages/index.astro` (also pass `showAchievementsLink={hasAchievements(data)}` to `BaseLayout`)

**Interfaces:**
- Consumes: `hasAchievements`, `parseStat`, `sortJourney`, `formatRange` (Task 2); `SectionHeading`.
- Produces:
  - `StatCounter` props `{ value: string; label: string }`. It renders the final value as text with `aria-label="{value} {label}"`. When `parseStat` is non-null it adds `data-count={num}`, `data-prefix` and `data-suffix`.
  - `counter.ts` exports `initCounters()`: on first intersection it animates from 0 to `data-count` over 1200ms (ease-out) and writes `prefix + n + suffix`.
  - `timeline.ts` exports `initTimeline()`: it sets `--progress` (0–1) on `[data-timeline]` from scroll position, which drives the line's `scaleY`.
  - `AchievementsSection` renders nothing at all when `hasAchievements` is false, and omits any empty sub-panel.

- [ ] **Step 1:** Write `tests/build/achievements-journey.test.ts`, asserting:
  - `#achievements` exists with label `02 / Track record`;
  - 3 stat items appear, each with its final number in the text and an `aria-label`;
  - certification rows have a `Verify ↗` link with `target="_blank"`;
  - `#journey` has label `03 / Journey`;
  - entries appear newest first;
  - the education entry with no `end` shows `— Present`;
  - each entry shows its type label (`Education`, `Org & leadership`, `Freelance`, `Milestone`).
  
  Write `tests/e2e/counter.spec.ts`: after scrolling `#achievements` into view and waiting 1.5s, the stat text equals the final value. With `reducedMotion: 'reduce'`, the final value is shown immediately and never `0`.
- [ ] **Step 2:** Run the tests. Expect FAIL.
- [ ] **Step 3:** Implement per §4.1 items 4–5 and the motion table in §7. The newest journey dot is filled white with a soft white shadow; the others are hollow `zinc-500`. Under reduced motion, `--progress` is fixed at 1 and the counters don't run.
- [ ] **Step 4:** Run the tests. Expect PASS.
- [ ] **Step 5:** Commit: `feat: achievements with count-up stats and journey timeline`.

---

### Task 7: Contact section, form and thanks page

**Files:**
- Create: `src/components/ContactSection.astro`, `src/components/ContactForm.astro`, `src/scripts/contact.ts`, `src/scripts/copy-email.ts`, `src/pages/thanks.astro`, `tests/build/contact.test.ts`, `tests/e2e/contact.spec.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `site`, `SectionHeading`.
- Produces:
  - `contact.ts` exports `initContactForm()` for `form[name="contact"]`. States are carried on the form's `data-state`: `idle | sending | success | error`.
  - `copy-email.ts` exports `initCopyEmail()` for `[data-copy-email]`.

- [ ] **Step 1:** Write `tests/build/contact.test.ts` for `/`, asserting the form has:
  - `name="contact"`, `method="POST"`, `data-netlify="true"`, `netlify-honeypot="bot-field"` and `action="/thanks"`;
  - a hidden `input[name="form-name"][value="contact"]`;
  - a `bot-field` input inside a container hidden with an `sr-only`-style class;
  - `name`, `email` (`type="email"`) and `message` fields, all `required`, each with a `<label for>`.
  
  Also assert that `/thanks` exists, contains a link to `/`, and has `meta name="robots" content="noindex"`.
  
  Write `tests/e2e/contact.spec.ts`:
  - **(a) Success.** Route-intercept `POST /`, fulfil with 200, and capture the body. After filling the form and submitting: the body contains `form-name=contact` and the entered email (URL-encoded); the button showed `Sending…`; the success message is visible and focused; the URL is unchanged.
  - **(b) Failure.** Fulfil with 500. An inline error is visible, it contains `site.email`, and the field values are still filled.
  - **(c) Invalid email.** Submitting `not-an-email` sends no request and shows an inline error linked by `aria-describedby`.
  - **(d) `@nojs`.** Submitting navigates to `/thanks`. Intercept the POST to `/thanks` with a 200 HTML response, because `astro preview` won't accept a POST.
- [ ] **Step 2:** Run the tests. Expect FAIL.
- [ ] **Step 3:** Implement per spec §8 and §4.1 item 6. The bottom glow sits on `#contact::before`. The email "Copy" button falls back to a `mailto:` href.
- [ ] **Step 4:** Run the tests. Expect PASS.
- [ ] **Step 5:** Commit: `feat: contact section with Netlify form and thanks page`.

---

### Task 8: Case study pages, outline and 404

**Files:**
- Create: `src/pages/projects/[slug].astro`, `src/components/CaseStudyToc.astro`, `src/scripts/toc.ts`, `src/pages/404.astro`, `tests/build/case-study.test.ts`, `tests/e2e/case-study.spec.ts`
- Modify: `src/styles/global.css` (add `.prose-case` styles)

**Interfaces:**
- Consumes: `orderProjects`, `getPrevNext`, `tocFromHeadings` (Task 2); `CoverPlaceholder` and the `cover-${id}` transition name (Task 5); `BaseLayout` with `image` set to the cover's URL.
- Produces: `toc.ts` exports `initToc()`. It marks the outline link of the heading currently in view with `aria-current="true"`.

- [ ] **Step 1:** Write `tests/build/case-study.test.ts`, asserting:
  - routes exist for all 3 projects (draft filtering is already covered by unit tests);
  - on `/projects/project-one/`: `h1` equals the title; the meta row shows Role, Timeline, Type and Stack; Live and Source buttons are present; the outline lists exactly the `##` headings in order, linking to their slugs; the prev link points to project-three and next to project-two (wrap-around); the back link goes to `/#projects`; `og:image` points to the cover;
  - on `/projects/project-three/`: no Live or Source buttons; no Role or Timeline cells; `[data-cover-placeholder]` is present;
  - on `/404`: there is a link to `/`.
  
  Write `tests/e2e/case-study.spec.ts`:
  - at 1280px, scrolling to the third `##` heading sets `aria-current` on its outline link;
  - at 375px the outline is hidden;
  - clicking Project One's card on `/` lands on its case study with the cover visible.
- [ ] **Step 2:** Run the tests. Expect FAIL.
- [ ] **Step 3:** Implement per §4.2. Prose styles: `h2` 22px/700, paragraphs at `--text-2` 15px with 1.7 line height and a 65ch max-width, images rounded with a `--line` border, `pre` on `--surface-1` with a rounded border, and `blockquote` as a 2px `--text-1` left border with `--text-1` text (the "What I learned" pull-quote). The outline is sticky at `top-24`, hidden below `lg`.
- [ ] **Step 4:** Run the tests. Expect PASS.
- [ ] **Step 5:** Commit: `feat: case study pages with heading outline and 404`.

---

### Task 9: Scroll reveal, reduced motion and robustness

**Files:**
- Create: `src/scripts/reveal.ts`, `src/scripts/index.ts` (imports and calls every `init*` on `astro:page-load`), `tests/e2e/robustness.spec.ts`
- Modify: `src/layouts/BaseLayout.astro` (single `<script>` importing `src/scripts/index.ts`), section components (add `data-reveal` to headings, cards, stat row, journey items and the contact columns)

**Interfaces:**
- Consumes: `initGlow`, `initCounters`, `initTimeline`, `initContactForm`, `initCopyEmail`, `initToc`, and the nav init from earlier tasks.
- Produces: `reveal.ts` exports `initReveal()`. CSS hides `[data-reveal]` **only** under `html.js` with `prefers-reduced-motion: no-preference` (`opacity:0; translate: 0 12px`). The observer adds `data-revealed` (500ms ease-out, with a 60ms stagger via `--i` across siblings) and unobserves each element after it reveals.

- [ ] **Step 1:** Write `tests/e2e/robustness.spec.ts`:
  - **(a) `@nojs`.** Every `[data-reveal]` element on `/` and on `/projects/project-one/` is visible.
  - **(b) Reduced motion.** With `reducedMotion: 'reduce'`, all `[data-reveal]` elements are visible on load without scrolling, measured by computed opacity of 1.
  - **(c) Client-side navigation.** Go `/` → click Project One → click "← All projects". Then scroll through the page: all `[data-reveal]` elements end at opacity 1, and the stat text equals its final values.
  - **(d) Narrow screens.** At 320px width, for `/`, `/projects/project-three/` and `/thanks`: `document.documentElement.scrollWidth <= 320`.
  - **(e) No unexpected errors.** No console errors on `/` and on a case study.
- [ ] **Step 2:** Run `npx playwright test robustness` and the `no-js` project. Expect FAIL on (b) or (c), at least until reveal exists. Record any that already pass.
- [ ] **Step 3:** Implement `reveal.ts` and `index.ts`, and add the `data-reveal` attributes. Make sure each `init*` is idempotent: before re-binding on `astro:page-load`, clean up the previous listeners and observers, for example with an `AbortController` per page.
- [ ] **Step 4:** Run the whole suite: `npm test`. Expect all PASS.
- [ ] **Step 5:** Commit: `feat: scroll reveal with reduced-motion and no-JS fallbacks`.

---

### Task 10: Final verification and owner hand-off

**Files:**
- Create: `README.md` (how to run, how to add a project/journey entry/achievement, how to deploy to Netlify and enable form notifications, and a pointer to the spec §13 content checklist)

- [ ] **Step 1:** Run `npm run check` (expect 0 errors and 0 warnings) and `npm test` (expect all pass).
- [ ] **Step 2:** Run Lighthouse against `npm run preview`:
  - `npx lighthouse http://localhost:4321/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless"`
  - the same command without `--preset=desktop` (mobile);
  - both again for `/projects/project-one/`.
  
  Expect ≥ 95 in every category. Fix any regressions before continuing. The most likely issue is `--text-3` contrast; if so, lighten it to `#8b8b94`.
- [ ] **Step 3:** Run the `design:accessibility-review` skill over the built pages, plus a manual keyboard-only pass: Tab from the top through nav, hero buttons, cards, verify links, form, and footer. Make sure focus is visible everywhere. Fix any findings.
- [ ] **Step 4:** Visually review `/`, a case study, `/thanks` and `/404` at 375, 768 and 1280px against the approved mockups. Confirm there are no purple or other hued colours anywhere (`grep -riE "purple|violet|indigo|#7c5cff" src` returns nothing).
- [ ] **Step 5:** Write `README.md`. Commit: `docs: README with content and deploy guide`.
- [ ] **Step 6:** Report to the owner: what was built, test and Lighthouse results, and the §13 checklist of content still to replace. Deploying to Netlify happens only when the owner asks, because it needs their GitHub and Netlify accounts.
