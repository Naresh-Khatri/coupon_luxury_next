"use client";

import { useEffect, useRef, useState } from "react";
import { Crop as CropIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageCropperDialog from "./ImageCropperDialog";
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
  const [cropSource, setCropSource] = useState<File | string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    setCropSource(file);
  }

  function openRecrop() {
    if (!value) return;
    setCropSource(value as File | string);
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-semibold">{label}</p>}
      {previewUrl ? (
        <div className="space-y-2">
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
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-4" />
              Replace
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openRecrop}
            >
              <CropIcon className="size-4" />
              Recrop
            </Button>
            {aspectRatio && (
              <span className="text-[11px] text-muted-foreground">
                Cropped to {ratioLabel(aspectRatio)}
              </span>
            )}
          </div>
        </div>
      ) : (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-4" />
            Upload
          </Button>
          {aspectRatio && (
            <p className="text-[11px] text-muted-foreground">
              Cropped to {ratioLabel(aspectRatio)}
            </p>
          )}
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onPickFile}
      />

      <ImageCropperDialog
        open={!!cropSource}
        source={cropSource}
        aspectRatio={aspectRatio}
        onCancel={() => setCropSource(null)}
        onCrop={(file) => {
          onChange(file);
          setCropSource(null);
        }}
      />
    </div>
  );
}

function ratioLabel(r: number): string {
  const presets: Array<[number, string]> = [
    [1, "1:1"],
    [2, "2:1"],
    [16 / 9, "16:9"],
    [4 / 3, "4:3"],
    [3 / 2, "3:2"],
    [3 / 4, "3:4"],
    [9 / 16, "9:16"],
  ];
  const m = presets.find(([v]) => Math.abs(v - r) < 0.005);
  return m ? m[1] : r.toFixed(2);
}
