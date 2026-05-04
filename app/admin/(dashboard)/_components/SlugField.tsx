"use client";

import { useEffect, useRef, useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Sparkles, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/slugify";
import { Field } from "./FormKit";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  slugName: Path<T>;
  sourceName: Path<T>;
  editing?: boolean;
  label?: string;
  hint?: string;
};

export function SlugField<T extends FieldValues>({
  form,
  slugName,
  sourceName,
  editing = false,
  label = "Slug",
  hint = "Auto-generated from name. Type to override.",
}: Props<T>) {
  const { register, setValue, getValues, watch } = form;

  const initialSlug = ((getValues(slugName) as unknown as string) ?? "").trim();
  const lastAuto = useRef<string>(editing ? initialSlug : "");
  const [pulse, setPulse] = useState(false);

  const source = watch(sourceName) as unknown as string | undefined;
  const slug = (watch(slugName) as unknown as string) ?? "";

  useEffect(() => {
    const current = ((getValues(slugName) as unknown as string) ?? "").trim();
    if (current && current !== lastAuto.current) return;
    const next = slugify(source ?? "");
    if (next !== current) {
      lastAuto.current = next;
      setValue(slugName, next as never, {
        shouldDirty: true,
        shouldValidate: false,
      });
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
    lastAuto.current = next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const trimmed = slug.trim();
  const isEdited = !!trimmed && trimmed !== lastAuto.current;

  const reg = register(slugName, {
    onBlur: (e) => {
      const v = (e.target as HTMLInputElement).value;
      const next = slugify(v);
      if (next !== v) {
        setValue(slugName, next as never, { shouldDirty: true });
      }
    },
  });

  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <Input {...reg} className="pr-9 font-mono text-sm" />
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          {isEdited ? (
            <Pencil
              className="size-3.5 text-amber-500"
              aria-label="Manually edited"
            />
          ) : (
            <Sparkles
              className={
                "size-3.5 text-emerald-500 transition-transform " +
                (pulse ? "scale-125" : "scale-100")
              }
              aria-label="Auto-synced from name"
            />
          )}
        </div>
      </div>
    </Field>
  );
}
