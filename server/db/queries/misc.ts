import { db, s } from "@/db";
import { asc, desc, eq } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getActiveSlides = cached(
  async () =>
    db.query.slides.findMany({
      where: eq(s.slides.active, true),
      orderBy: asc(s.slides.order),
      columns: {
        id: true,
        title: true,
        description: true,
        ctaLabel: true,
        ctaLink: true,
        imgURL: true,
        imgAlt: true,
        link: true,
        order: true,
      },
    }),
  ["slides:public"],
  [CACHE_TAGS.slides]
);

export async function getAllSlides() {
  return db.query.slides.findMany({ orderBy: asc(s.slides.order) });
}

export async function getAllSubscribers() {
  return db.query.subscribers.findMany({
    orderBy: desc(s.subscribers.createdAt),
  });
}

export async function addSubscriber(email: string) {
  const [existing] = await db
    .select()
    .from(s.subscribers)
    .where(eq(s.subscribers.email, email));
  if (existing) throw new Error("already-subscribed");
  const [row] = await db
    .insert(s.subscribers)
    .values({ email })
    .returning();
  return row;
}
