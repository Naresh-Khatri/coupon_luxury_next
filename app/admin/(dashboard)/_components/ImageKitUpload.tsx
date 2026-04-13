"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { env } from "@/lib/env";
import { toast } from "sonner";

export default function ImageKitUpload({
  value,
  onChange,
  label = "Image",
  accept = "image/*",
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const auth = await utils.admin.imagekitAuth.fetch();
      const fd = new FormData();
      fd.append("file", file);
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
      onChange(json.url);
      toast.success("Uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {value ? (
        <div className="relative w-40 overflow-hidden rounded-md border">
          <Image
            src={value}
            alt=""
            width={160}
            height={160}
            className="h-40 w-40 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-1 top-1 rounded-full bg-white/90 p-1"
            aria-label="remove"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
      </Button>
    </div>
  );
}
