import type { ImageLoaderProps } from "next/image";

export const imageKitLoader = ({ src, width, quality }: ImageLoaderProps) => {
  if (src[0] === "/") src = src.slice(1);
  const params = [`w-${width}`];
  if (quality) params.push(`q-${quality}`);
  return `${src}?tr=${params.join(",")}`;
};
