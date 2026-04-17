import { unstable_cache, revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  stores: "stores",
  store: (slug: string) => `store:${slug}`,
  offers: "offers",
  offer: (slug: string) => `offer:${slug}`,
  categories: "categories",
  category: (slug: string) => `category:${slug}`,
  subCategories: "subcategories",
  blogs: "blogs",
  blog: (slug: string) => `blog:${slug}`,
  slides: "slides",
  subscribers: "subscribers",
  countries: "countries",
  main: "main",
  sitemap: "sitemap",
} as const;

export function cached<A extends unknown[], T>(
  fn: (...args: A) => Promise<T>,
  keyParts: string[],
  tags: string[]
) {
  return unstable_cache(fn, keyParts, { tags, revalidate: 3600 });
}

export function revalidate(...tags: string[]) {
  for (const t of tags) revalidateTag(t, "max");
}
