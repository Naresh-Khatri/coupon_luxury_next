"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import "react-advanced-cropper/dist/style.css";
import {
  Cropper,
  createAspectRatio,
  type CropperRef,
} from "react-advanced-cropper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";
import { env } from "@/lib/env";
import { toast } from "sonner";

export default function ImageKitUpload({
  value,
  onChange,
  label,
  accept = "image/*",
  aspectRatio,
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  accept?: string;
  aspectRatio?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>("image");
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);
  const utils = trpc.useUtils();

  function openCropper(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    setOriginalName(file.name);
    const reader = new FileReader();
    reader.onload = () => setCropSrc(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    const canvas = cropperRef.current?.getCanvas();
    if (!canvas) return;
    setUploading(true);
    try {
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("canvas empty"))),
          "image/jpeg",
          0.92,
        ),
      );
      const auth = await utils.admin.imagekitAuth.fetch();
      const fd = new FormData();
      fd.append("file", blob, originalName);
      fd.append("fileName", originalName);
      fd.append("publicKey", env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
      fd.append("signature", auth.signature);
      fd.append("token", auth.token);
      fd.append("expire", String(auth.expire));
      const res = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        { method: "POST", body: fd },
      );
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { url: string };
      onChange(json.url);
      setCropSrc(null);
      toast.success("Uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-semibold">{label}</p>}
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
            className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground"
            aria-label="remove"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={openCropper}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-4" />
            Upload
          </Button>
        </>
      )}

      <Dialog
        open={!!cropSrc}
        onOpenChange={(o) => {
          if (!o && !uploading) setCropSrc(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
          </DialogHeader>
          {cropSrc ? (
            <div className="h-[60vh] overflow-hidden rounded-md bg-muted">
              <Cropper
                ref={cropperRef}
                src={cropSrc}
                className="h-full w-full"
                aspectRatio={
                  aspectRatio ? createAspectRatio(aspectRatio) : undefined
                }
              />
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCropSrc(null)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {uploading ? "Uploading…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
