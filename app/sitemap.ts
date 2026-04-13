import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/server/db/queries/sitemap";

const BASE = "https://www.couponluxury.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { stores, categories, offers, blogs } = await getSitemapEntries();
  const staticPaths = [
    "",
    "/stores",
    "/deals",
    "/categories",
    "/blogs",
    "/about",
    "/contact",
    "/privacy-policy",
    "/sitemap",
  ].map((p) => ({ url: `${BASE}${p}`, lastModified: new Date() }));

  return [
    ...staticPaths,
    ...stores.map((r) => ({
      url: `${BASE}/stores/${r.slug}`,
      lastModified: r.updatedAt,
    })),
    ...categories.map((r) => ({
      url: `${BASE}/categories/${r.slug}`,
      lastModified: r.updatedAt,
    })),
    ...offers.map((r) => ({
      url: `${BASE}/deals/${r.slug}`,
      lastModified: r.updatedAt,
    })),
    ...blogs.map((r) => ({
      url: `${BASE}/blogs/${r.slug}`,
      lastModified: r.updatedAt,
    })),
  ];
}
