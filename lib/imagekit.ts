import ImageKit from "imagekit";
import { env } from "@/lib/env";

export const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

export function getImageFileId(url?: string | null) {
  if (!url) return null;
  const name = url.split("/").pop();
  return name ?? null;
}

export function extractImageKitUrls(html?: string | null): string[] {
  if (!html) return [];
  const host = new URL(env.IMAGEKIT_URL_ENDPOINT).host;
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  const urls = new Set<string>();
  for (const m of html.matchAll(re)) {
    const src = m[1];
    try {
      if (new URL(src).host === host) urls.add(src);
    } catch {}
  }
  return [...urls];
}

export async function deleteOrphanedImages(
  oldHtml?: string | null,
  newHtml?: string | null,
) {
  const oldUrls = extractImageKitUrls(oldHtml);
  if (!oldUrls.length) return;
  const kept = new Set(extractImageKitUrls(newHtml));
  const removed = oldUrls.filter((u) => !kept.has(u));
  await Promise.all(removed.map((u) => deleteImageByUrl(u)));
}

export async function deleteImageByUrl(url?: string | null) {
  if (!url) return;
  try {
    const name = getImageFileId(url);
    if (!name) return;
    const [file] = await imagekit.listFiles({ name, limit: 1 });
    if (file && "fileId" in file) await imagekit.deleteFile(file.fileId);
  } catch (err) {
    console.error("imagekit delete failed:", err);
  }
}
