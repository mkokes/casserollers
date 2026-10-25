import { getCollection, type CollectionEntry } from 'astro:content';
import terms from '../data/terms.json';

export const SITE_TITLE = 'Casserollers';
export const SITE_DESCRIPTION = 'Minneapolis, MN Moped Gang';
export const PAGE_SIZE = 5;

// Every link to the club's social accounts and text alerts comes from here.
export const SOCIAL = {
  instagram: { handle: '@thecasserollers', href: 'https://www.instagram.com/thecasserollers/' },
  facebook: { name: 'Minnesota Moped Riders', href: 'https://www.facebook.com/groups/mnmopedriders/' },
  // `?&body=` prefills the message on both iOS and Android.
  sms: { number: '+18335108834', display: '(833) 510-8834', keyword: 'JOIN', href: 'sms:+18335108834?&body=JOIN' },
};

export const WEEKLY_RIDE = {
  day: 'Thursdays',
  time: '6 PM',
  place: 'NE Yacht Club',
  address: '801 Marshall St NE',
  mapUrl: 'https://maps.app.goo.gl/CoAcXqLMgReeeAjq6',
};

export const NAV: { label: string; href: string; icon?: 'instagram' | 'facebook' }[] = [
  { label: 'About', href: '/about/' },
  { label: 'Rallies', href: '/rallies/' },
  { label: 'Instagram', href: SOCIAL.instagram.href, icon: 'instagram' },
  { label: 'Facebook', href: SOCIAL.facebook.href, icon: 'facebook' },
];

export type Post = CollectionEntry<'posts'>;
export type Page = CollectionEntry<'pages'>;
export type Rally = Page & { data: { rally: NonNullable<Page['data']['rally']> } };

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

// Rally dates are Minneapolis wall-clock dates/times ("2025-06-20", "14:00").
// Rallies run in summer, so Central Daylight Time is close enough for "is it over yet".
const CENTRAL = '-05:00';

export async function getRallies(): Promise<Rally[]> {
  const pages = await getCollection('pages');
  return (pages.filter((page) => page.data.rally) as Rally[]).sort((a, b) =>
    b.data.rally.start.localeCompare(a.data.rally.start),
  );
}

export const rallyStart = (rally: Rally) => new Date(`${rally.data.rally.start}T00:00:00${CENTRAL}`);
export const rallyEnd = (rally: Rally) => new Date(`${rally.data.rally.end}T23:59:59${CENTRAL}`);
export const rallyOver = (rally: Rally, now = new Date()) => rallyEnd(rally) < now;

// Soonest rally that hasn't finished, if any.
export const nextRally = (rallies: Rally[]) => rallies.filter((rally) => !rallyOver(rally)).at(-1);

export const rallySlug = (rally: Rally) => rally.data.path.replace(/^\/|\/$/g, '').replaceAll('/', '-');
export const rallyIcs = (rally: Rally) => `/rallies/${rallySlug(rally)}.ics`;

const day = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });

// "June 20–22, 2025", or "Aug 30 – Sep 1, 2025" across months.
export function formatDateRange(start: string, end: string) {
  const year = day(end, { year: 'numeric' });
  if (start === end) return day(start, { month: 'long', day: 'numeric', year: 'numeric' });
  if (start.slice(0, 7) === end.slice(0, 7)) {
    return `${day(start, { month: 'long', day: 'numeric' })}–${day(end, { day: 'numeric' })}, ${year}`;
  }
  return `${day(start, { month: 'short', day: 'numeric' })} – ${day(end, { month: 'short', day: 'numeric' })}, ${year}`;
}

export const formatWeekday = (date: string) => day(date, { weekday: 'long', month: 'long', day: 'numeric' });

// "14:00" -> "2 PM", "09:30" -> "9:30 AM"
export function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'AM' : 'PM'}`;
}
