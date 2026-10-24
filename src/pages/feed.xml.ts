import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, SITE_DESCRIPTION, SITE_TITLE } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.slice(0, 20).map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: post.data.path,
      description: post.data.excerpt,
    })),
  });
}
