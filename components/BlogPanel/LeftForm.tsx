"use client";

import { useEffect, useState } from "react";
import RuledInput from "../RuledInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  imageAlt: string;
  setImageAlt: (v: string) => void;
  metaTitle: string;
  setMetaTitle: (v: string) => void;
  metaDescription: string;
  setMetaDescription: (v: string) => void;
};

export default function LeftForm({
  title,
  setTitle,
  slug,
  setSlug,
  imageAlt,
  setImageAlt,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
}: Props) {
  const [slugError, setSlugError] = useState("");

  const updateSlug = (value: string) => {
    const regex = /[^a-z0-9-]+/gi;
    if (regex.test(value)) {
      setSlugError("Slug can only contain alphanumeric and hyphen");
      return;
    }
    setSlugError("");
    setSlug(value);
  };

  useEffect(() => {
    if (title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9-]+/gi, "-")
        .replace(/^-|-$/g, "");
      setSlug(newSlug);
    }
  }, [title, setSlug]);

  return (
    <div className="space-y-10 p-5">
      <div className="space-y-3 rounded-xl bg-white p-5 shadow-md">
        <p>Basic Info</p>
        <RuledInput
          value={title}
          setValue={setTitle}
          rule={{ min: 10, max: 70 }}
          hintText="Should be in the range 10 to 70"
          placeholder="Enter title"
          title="Blog Title"
          earlyShowError
        />
        <div className="space-y-1.5">
          <Label>
            Blog Slug <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="Enter Slug"
            value={slug}
            onChange={(e) => updateSlug(e.target.value)}
            aria-invalid={!!slugError}
          />
          {slugError ? (
            <p className="text-[12.5px] text-destructive">{slugError}</p>
          ) : (
            <p className="text-[12.5px] text-muted-foreground">
              /blogs/{slug}
            </p>
          )}
        </div>
        <RuledInput
          value={imageAlt}
          setValue={setImageAlt}
          rule={{ min: 5, max: 40 }}
          hintText="Should be in the range 5 to 40"
          placeholder="Enter Image Alt"
          title="Image Alt"
          earlyShowError
        />
      </div>
      <div className="space-y-5 rounded-xl bg-white p-5 shadow-md">
        <p>For SEO</p>
        <RuledInput
          value={metaTitle}
          setValue={setMetaTitle}
          rule={{ min: 30, max: 70 }}
          hintText="Should be in the range 30 to 70"
          placeholder="Enter Meta Title"
          title="Meta Title"
          earlyShowError
        />
        <RuledInput
          value={metaDescription}
          setValue={setMetaDescription}
          rule={{ min: 50, max: 160 }}
          hintText="Should be in the range 50 to 160"
          placeholder="Enter Meta Description"
          title="Meta Description"
          earlyShowError
        />
      </div>
    </div>
  );
}
