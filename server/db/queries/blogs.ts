import { db, s } from "@/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getPublicBlogs = cached(
  async (limit: number = 50, categoryId?: number | null) => {
    const conds = [eq(s.blogs.active, true)];
    if (categoryId) conds.push(eq(s.blogs.categoryId, categoryId));
    return db.query.blogs.findMany({
      where: and(...conds),
      limit,
      orderBy: desc(s.blogs.updatedAt),
      with: {
        store: { columns: { id: true, storeName: true, slug: true } },
        category: { columns: { id: true, categoryName: true, slug: true } },
      },
    });
  },
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
          category: { columns: { id: true, categoryName: true, slug: true } },
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
