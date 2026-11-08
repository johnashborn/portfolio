# Portfolio

My personal developer portfolio: an Information Technology student building full-stack web apps.
Built with **Astro 5** and **Tailwind CSS 4**, hosted on **Netlify**.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run check` | Type-check components and validate all content files |
| `npm test` | Unit tests, built-HTML tests and browser tests (Playwright) |

The first time you run the browser tests, install Chromium with `npx playwright install chromium`.

## Replace the placeholder content

Every placeholder is marked `TODO`. Search the project for `TODO` to find them all.

### Your details: `src/site.ts`
Name, status badge, graduation year, location, bio, email, GitHub and LinkedIn links, and your tech stack.
Stack icons come from [simple-icons](https://simpleicons.org/): import e.g. `siVuedotjs` and use `.path`.

**Photo (optional):** put a portrait (about 800×1000) in `src/assets/photo.jpg`, then uncomment the two
`photo` lines in `src/site.ts`. With a photo, the hero switches to a two-column layout.

**CV:** replace `public/cv.pdf` with your real CV (same filename).

**Social preview image:** replace `public/og.png` (1200×630). This is the image shown when your link is shared.

### Projects: `src/content/projects/*.md`
One Markdown file per project. The filename becomes the URL (`my-app.md` → `/projects/my-app/`).

```yaml
---
title: Study Room Booking
summary: One sentence on what it is and who it's for.
cover: ./images/my-app.png     # optional; put screenshots in src/content/projects/images/
coverAlt: Booking dashboard showing today's rooms   # required when cover is set
year: 2026
role: Solo · full-stack          # optional
timeline: 8 weeks                # optional
type: capstone                   # capstone | school | personal | client
stack: [Laravel, React, MySQL]
liveUrl: https://…               # optional
repoUrl: https://github.com/…    # optional
featured: true                   # the featured project gets the large card
order: 1                         # position on the home page
draft: false                     # true = only visible in `npm run dev`
---

## Overview
## What I built
## How it works
## What I'd improve
## What I learned
> A one-line takeaway, shown as a pull-quote.
```

Each `##` heading becomes an entry in the case study's side outline. Use whatever headings suit the project.

### Journey: `src/content/journey/*.md`
Education, student orgs, freelance work and self-learning milestones, all on one timeline (newest first).

```yaml
---
type: education        # education | org | freelance | milestone
title: BS Information Technology
place: Your University # optional
start: 2023-08
end: 2027-06           # optional; leave out for "Present" (milestones show a single date)
tags: [Web Development]
---
One or two sentences.
```

### Achievements: `src/content/achievements.json`
Up to 4 `stats`, plus `certifications` (with optional verify `url`) and `awards`.
Keep the stats honest. Empty lists are hidden automatically, and if everything is empty, the whole section and its nav link disappear.

If you enter something invalid (a missing field, or a cover without `coverAlt`), `npm run check` and `npm run build` will tell you exactly which file is wrong.

## Deploy to Netlify

1. Push this repository to GitHub.
2. In Netlify: **Add new site → Import an existing project**, then pick the repo. The build settings are read from `netlify.toml`.
3. After the first deploy, put your real URL in `site` in `astro.config.mjs` and in `public/robots.txt`, then push again.
4. **Contact form:** Netlify detects the `contact` form automatically. To get emails for new messages, go to
   **Site configuration → Forms → Form notifications → Add notification → Email notification**.
   Send yourself a test message from the live site to confirm it works.

## Design

Dark, monochrome "soft glow" style. The full design spec is in
`docs/superpowers/specs/2026-11-08-portfolio-design.md`, and its §13 has a checklist of everything to gather.
