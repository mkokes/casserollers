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

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    order: z.number().default(0),
    excerpt: z.string().optional(),
  }),
});

export const collections = { posts, pages };
