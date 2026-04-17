import { env } from "@/lib/env";

export type ImagekitAuth = {
  signature: string;
  token: string;
  expire: number;
};

export type PendingImage = string | File | null | undefined;

export async function uploadImage(
  file: File,
  auth: ImagekitAuth,
): Promise<string> {
  const fd = new FormData();
  fd.append("file", file, file.name);
  fd.append("fileName", file.name);
  fd.append("publicKey", env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
  fd.append("signature", auth.signature);
  fd.append("token", auth.token);
  fd.append("expire", String(auth.expire));
  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error(await res.text());
  const json = (await res.json()) as { url: string };
  return json.url;
}

export function hasPendingFile(...values: PendingImage[]): boolean {
  return values.some((v) => v instanceof File);
}

export async function resolveImage(
  value: PendingImage,
  auth: ImagekitAuth,
): Promise<string | null> {
  if (!value) return null;
  if (typeof value === "string") return value;
  return uploadImage(value, auth);
}
