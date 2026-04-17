"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
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
import type { PendingImage } from "./uploadImage";

export default function ImageKitUpload({
  value,
  onChange,
  label,
  accept = "image/*",
  aspectRatio,
}: {
  value?: PendingImage;
  onChange: (v: PendingImage) => void;
  label?: string;
  accept?: string;
  aspectRatio?: number;
}) {
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string>("image.jpg");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    if (typeof value === "string") {
      setPreviewUrl(value);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  function openCropper(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    const base = file.name.replace(/\.[^.]+$/, "");
    setPendingName(`${base || "image"}.jpg`);
    const reader = new FileReader();
    reader.onload = () => setCropSrc(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleCrop() {
    const canvas = cropperRef.current?.getCanvas();
    if (!canvas) return;
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("canvas empty"))),
        "image/jpeg",
        0.92,
      ),
    );
    const file = new File([blob], pendingName, { type: "image/jpeg" });
    onChange(file);
    setCropSrc(null);
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-semibold">{label}</p>}
      {previewUrl ? (
        <div className="relative w-40 overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt=""
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
          if (!o) setCropSrc(null);
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
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleCrop}>
              <Upload className="size-4" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
