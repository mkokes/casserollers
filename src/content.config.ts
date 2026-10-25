import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// WordPress dates are site-local wall-clock times with no offset. Pin them to
// UTC so the displayed date never shifts with the build machine's timezone.
const wpDate = z.string().transform((s) => new Date(s.endsWith('Z') ? s : `${s}Z`));

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: wpDate,
    path: z.string(),
    author: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

// Rally dates and times are Minneapolis wall-clock values, kept as strings so
// they never shift with the build machine's timezone.
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD');
const clockTime = z.string().regex(/^\d{2}:\d{2}$/, 'expected 24-hour HH:MM');

const rally = z.object({
  start: isoDate,
  end: isoDate,
  poster: z.string().optional(),
  // Leave out until registration opens; the page then says "Registration opens soon".
  registerUrl: z.url().optional(),
  facebookEvent: z.url().optional(),
  stops: z
    .array(
      z.object({
        name: z.string(),
        address: z.string(),
        lat: z.number(),
        lng: z.number(),
        mapUrl: z.url(),
      }),
    )
    .default([]),
  schedule: z
    .array(
      z.object({
        date: isoDate,
        time: clockTime,
        until: clockTime.optional(),
        title: z.string(),
        // Must match a stop's name.
        stop: z.string().optional(),
      }),
    )
    .default([]),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    order: z.number().default(0),
    excerpt: z.string().optional(),
    rally: rally.optional(),
  }),
});

export const collections = { posts, pages };
