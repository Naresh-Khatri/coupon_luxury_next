"use client";

import type { RefObject } from "react";
import { Trash2 } from "lucide-react";
import "react-advanced-cropper/dist/style.css";
import { Cropper, createAspectRatio, type CropperRef } from "react-advanced-cropper";
import ImageDropZone from "./ImageDropZone";

export default function ImageCropper({
  coverImg,
  setCoverImg,
  coverImgRef,
  thumbnailImgRef,
  onFileDrop,
}: {
  coverImg: string | null;
  setCoverImg: (v: string | null) => void;
  coverImgRef: RefObject<CropperRef>;
  thumbnailImgRef: RefObject<CropperRef>;
  onFileDrop: (files: File[]) => void;
}) {
  if (!coverImg) return <ImageDropZone onFileDrop={onFileDrop} />;

  return (
    <div className="relative space-y-2">
      <div>
        <p>Cover Image</p>
        <Cropper
          ref={coverImgRef}
          src={coverImg}
          className="cropper h-full w-full"
          aspectRatio={createAspectRatio(16 / 10)}
        />
      </div>
      <div>
        <p>Thumbnail Image</p>
        <Cropper
          ref={thumbnailImgRef}
          src={coverImg}
          className="cropper h-full w-full"
          aspectRatio={createAspectRatio(1 / 1)}
        />
      </div>
      <button
        type="button"
        aria-label="Delete"
        onClick={() => setCoverImg(null)}
        className="absolute -top-5 -right-5 z-10 inline-flex size-10 items-center justify-center rounded-md bg-destructive text-white shadow"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
