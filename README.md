# Portfolio

Personal developer portfolio of John Rey B. Aranton, an Information Technology student building full-stack web apps
and AI automations. Built with **Astro 7** and **Tailwind CSS 4**, hosted on **Netlify** at
[johnreyaranton.netlify.app](https://johnreyaranton.netlify.app).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321
```

On Windows PowerShell, use `npm.cmd` instead of `npm` if scripts are blocked.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run check` | Type-check components and validate all content files |
| `npm run cv` | Regenerate `public/cv.pdf` from `cv/cv.html` |
| `npm test` | Unit tests, built-HTML tests and browser tests (Playwright) |

The first time you run the browser tests, install Chromium with `npx playwright install chromium`.

## Editing content

### Details: `src/site.ts`

Name, role, status badge, location, bio, email, social links, photo and tech stack.
Stack icons come from [simple-icons](https://simpleicons.org/): import e.g. `siVuedotjs` and use `.path`.
The hero photo is `src/assets/photo.jpg`, cropped to 4:5. Replace the file to change it.

### Projects: `src/content/projects/*.md`

One Markdown file per project. The filename becomes the URL (`my-app.md` → `/projects/my-app/`).

```yaml
---
title: Study Room Booking
summary: One sentence on what it is and who it's for.
cover: ./images/my-app.png     # optional; screenshots live in src/content/projects/images/
coverAlt: Booking dashboard showing today's rooms   # required when cover is set
year: 2026
role: Solo · full-stack          # optional
timeline: 8 weeks                # optional
type: school                     # capstone | school | personal | client | startup
stack: [Laravel, MySQL]
liveUrl: https://…               # optional
repoUrl: https://github.com/…    # optional
featured: true                   # the featured project gets the large card
order: 1                         # position on the home page
draft: false                     # true = only visible in `npm run dev`
---
```

Each `##` heading in the body becomes an entry in the case study's side outline, and a `>` quote under
"What I learned" is shown as a pull-quote. Use PNG or JPG covers: social sites ignore SVG link previews.

### Journey: `src/content/journey/*.md`

Education, student orgs, freelance work and milestones on one timeline, oldest first.

```yaml
---
type: org              # education | org | freelance | milestone
title: President
place: The Legion, BISU Balilihan   # optional
start: 2026-08
end: 2027-05           # optional; leave out for "Present" (milestones show a single date)
tags: [Leadership]
---
One or two sentences.
```

### Achievements: `src/content/achievements.json`

Up to 4 `stats`, plus `certifications` (with an optional verify `url`) and `awards`.
Empty lists are hidden automatically.

If a content file is invalid (a missing field, or a cover without `coverAlt`), `npm run check` and
`npm run build` name the file that is wrong.

### CV: `cv/cv.html`

Edit it, then run `npm run cv` to regenerate `public/cv.pdf`. It must stay one A4 page with real text so
applicant tracking systems can read it; `npm run test:build` checks both.

### Social preview: `public/og.png`

The 1200×630 image shown when the home page link is shared. Case-study pages use their project cover instead.

## Deploy to Netlify

1. Push this repository to GitHub.
2. In Netlify: **Add new project → Import an existing project**, then pick the repo. Build settings come from
   `netlify.toml`.
3. Rename the project to `johnreyaranton` so the address matches `site` in `astro.config.mjs` and
   `public/robots.txt`. If you use a different address, update both.
4. **Contact form:** turn on **Forms → Enable form detection**, then **Deploys → Trigger deploy** so Netlify
   registers the `contact` form.
5. **Email notifications:** **Forms → Form notifications → Add notification → Email notification**.
6. **Test it:** send a message from the live site and check it appears under **Forms** in Netlify.

Every push to `main` redeploys the site.

## Security

`netlify.toml` sets a Content-Security-Policy, HSTS, a Permissions-Policy and the usual hardening headers.
`tests/e2e/security-headers.spec.ts` applies that policy in the browser tests, so anything it would block
fails a test before it reaches production.
