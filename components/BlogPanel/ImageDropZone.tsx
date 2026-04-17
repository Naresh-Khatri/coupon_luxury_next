"use client";

import { useDropzone } from "react-dropzone";
import { ImageIcon, ArrowDown } from "lucide-react";

export default function ImageDropZone({
  onFileDrop,
}: {
  onFileDrop: (files: File[]) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFileDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div
        className={`flex h-[635px] items-center justify-center rounded-xl border-2 border-dashed bg-white ${
          isDragActive ? "border-green-400" : "border-gray-300"
        }`}
      >
        {!isDragActive ? (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageIcon className="size-20 animate-bounce" />
            <p>Drop Cover photo here...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-green-500">
            <ArrowDown className="size-20 animate-bounce" />
            <p>Drop it like it&apos;s hot!</p>
          </div>
        )}
      </div>
    </div>
  );
}
