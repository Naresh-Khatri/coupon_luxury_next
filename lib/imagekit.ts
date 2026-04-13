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
