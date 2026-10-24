import { getCollection, type CollectionEntry } from 'astro:content';
import terms from '../data/terms.json';

export const SITE_TITLE = 'Casserollers';
export const SITE_DESCRIPTION = 'Minneapolis, MN Moped Gang';
export const PAGE_SIZE = 5;

export const NAV = [
  { label: 'About', href: '/about/' },
  { label: 'Facebook Group', href: 'https://www.facebook.com/groups/mnmopedriders/' },
];

export type Post = CollectionEntry<'posts'>;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const categoryName = (slug: string) => terms.categories.find((c) => c.slug === slug)?.name ?? slug;
export const tagName = (slug: string) => terms.tags.find((t) => t.slug === slug)?.name ?? slug;

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

// Paths for a WordPress-style paginated archive: /base/, /base/page/2/, ...
export function paginate<T>(items: T[], base: string) {
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const href = (n: number) => (n === 1 ? base : `${base}page/${n}/`);
  return Array.from({ length: pageCount }, (_, i) => ({
    page: i + 1,
    items: items.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE),
    prev: i > 0 ? href(i) : undefined,
    next: i + 1 < pageCount ? href(i + 2) : undefined,
  }));
}
