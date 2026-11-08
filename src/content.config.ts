import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/** Spec §5.1 — one Markdown file per project; the body is the case study. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        year: z.number().int(),
        role: z.string().optional(),
        timeline: z.string().optional(),
        type: z.enum(['capstone', 'school', 'personal', 'client']),
        stack: z.array(z.string()).min(1),
        liveUrl: z.string().url().optional(),
        repoUrl: z.string().url().optional(),
        featured: z.boolean().default(false),
        order: z.number(),
        draft: z.boolean().default(false),
      })
      .refine((d) => !d.cover || !!d.coverAlt, {
        message: 'coverAlt is required when cover is set',
        path: ['coverAlt'],
      }),
});

/** Spec §5.2 — education, orgs, freelance work and self-learning milestones on one timeline. */
const journey = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journey' }),
  schema: z.object({
    type: z.enum(['education', 'org', 'freelance', 'milestone']),
    title: z.string(),
    place: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

/** Spec §5.3 — a single entry with id "main". */
const achievements = defineCollection({
  loader: file('src/content/achievements.json'),
  schema: z.object({
    stats: z.array(z.object({ value: z.string(), label: z.string() })).max(4),
    certifications: z.array(
      z.object({ name: z.string(), issuer: z.string(), year: z.number().int(), url: z.string().url().optional() }),
    ),
    awards: z.array(z.object({ name: z.string(), context: z.string().optional(), year: z.number().int() })),
  }),
});

export const collections = { projects, journey, achievements };
