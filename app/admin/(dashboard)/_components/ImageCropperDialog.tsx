"use client";

import { useEffect, useRef, useState } from "react";
import { Crop as CropIcon } from "lucide-react";
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

type Source = File | string | null | undefined;

export type ImageCropperDialogProps = {
  open: boolean;
  source: Source;
  /** When set, locks the crop selection to this ratio (width / height). */
  aspectRatio?: number;
  /** File name applied to the cropped JPEG. */
  fileName?: string;
  jpegQuality?: number;
  title?: string;
  onCancel: () => void;
  onCrop: (file: File) => void;
};

export default function ImageCropperDialog({
  open,
  source,
  aspectRatio,
  fileName,
  jpegQuality = 0.92,
  title,
  onCancel,
  onCrop,
}: ImageCropperDialogProps) {
  const cropperRef = useRef<CropperRef>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !source) {
      setSrc(null);
      return;
    }
    if (typeof source === "string") {
      setSrc(source);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSrc(String(reader.result));
    reader.readAsDataURL(source);
  }, [open, source]);

  async function apply() {
    const canvas = cropperRef.current?.getCanvas();
    if (!canvas) return;
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("canvas empty"))),
        "image/jpeg",
        jpegQuality,
      ),
    );
    const name =
      fileName ||
      (source instanceof File
        ? source.name.replace(/\.[^.]+$/, "") + ".jpg"
        : "image.jpg");
    onCrop(new File([blob], name, { type: "image/jpeg" }));
  }

  const ratioLabel = aspectRatio ? formatRatio(aspectRatio) : null;
  const heading =
    title ?? (ratioLabel ? `Crop image (${ratioLabel})` : "Crop image");

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onCancel() : undefined)}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
        </DialogHeader>
        {src ? (
          <div className="h-[60vh] overflow-hidden rounded-md bg-muted">
            <Cropper
              ref={cropperRef}
              src={src}
              className="h-full w-full"
              aspectRatio={
                aspectRatio ? createAspectRatio(aspectRatio) : undefined
              }
            />
          </div>
        ) : (
          <div className="grid h-[60vh] place-items-center text-sm text-muted-foreground">
            Loading image…
          </div>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={apply}>
            <CropIcon className="size-4" />
            Apply crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatRatio(r: number): string {
  const presets: Array<[number, string]> = [
    [1, "1:1"],
    [2, "2:1"],
    [16 / 9, "16:9"],
    [4 / 3, "4:3"],
    [3 / 2, "3:2"],
    [3 / 4, "3:4"],
    [9 / 16, "9:16"],
  ];
  const match = presets.find(([v]) => Math.abs(v - r) < 0.005);
  if (match) return match[1];
  return r.toFixed(2);
}
