import { db, s } from "@/db";
import { desc, eq, sql } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getPublicBlogs = cached(
  async (limit: number = 50) =>
    db.query.blogs.findMany({
      where: eq(s.blogs.active, true),
      limit,
      orderBy: desc(s.blogs.updatedAt),
      with: {
        store: { columns: { id: true, storeName: true, slug: true } },
      },
    }),
  ["blogs:public"],
  [CACHE_TAGS.blogs]
);

export const getBlogBySlug = (slug: string) =>
  cached(
    async () =>
      db.query.blogs.findFirst({
        where: eq(s.blogs.slug, slug),
        with: {
          store: { columns: { id: true, storeName: true, slug: true } },
        },
      }),
    ["blog:slug", slug],
    [CACHE_TAGS.blogs, CACHE_TAGS.blog(slug)]
  )();

export async function getAllBlogs() {
  return db.query.blogs.findMany({
    orderBy: desc(s.blogs.updatedAt),
    with: {
      store: { columns: { id: true, storeName: true, slug: true } },
    },
  });
}

export async function getBlogCount() {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(s.blogs);
  return row?.count ?? 0;
}
