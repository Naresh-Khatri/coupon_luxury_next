"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X, Crop as CropIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc/client";
import { resolveImage } from "../_components/uploadImage";
import ImageCropperDialog from "../_components/ImageCropperDialog";
import { imageKitLoader } from "@/utils/imageKitLoader";
import {
  PageHeader,
  SectionCard,
  Field,
  FieldGrid,
  StickyFooter,
} from "../_components/FormKit";

const SLIDE_ASPECT = 16 / 9;

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaLink: z.string().optional(),
  link: z.string(),
  imgURL: z.union([z.string().url(), z.instanceof(File)]),
  imgAlt: z.string().default(""),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
});
type FormValues = z.infer<typeof schema>;

export default function SlideForm({
  initial,
  id,
}: {
  initial?: Partial<FormValues>;
  id?: number;
}) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropSource, setCropSource] = useState<File | string | null>(null);
  const [showAlt, setShowAlt] = useState(
    !!(initial?.imgAlt && initial.imgAlt !== initial.title),
  );
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
      description: "",
      ctaLabel: "",
      ctaLink: "",
      link: "",
      imgURL: "",
      imgAlt: "",
      active: false,
      featured: false,
      ...initial,
    } as FormValues,
  });

  const create = trpc.admin.slides.create.useMutation({
    onSuccess: () => {
      toast.success("Created");
      utils.admin.slides.list.invalidate();
      router.push("/admin/slides");
    },
    onError: (e) => toast.error(e.message),
  });
  const update = trpc.admin.slides.update.useMutation({
    onSuccess: () => {
      toast.success("Updated");
      utils.admin.slides.list.invalidate();
      router.push("/admin/slides");
    },
    onError: (e) => toast.error(e.message),
  });

  async function onSubmit(values: FormValues) {
    try {
      const auth =
        values.imgURL instanceof File
          ? await utils.admin.imagekitAuth.fetch()
          : null;
      const imgURL = auth
        ? await resolveImage(values.imgURL, auth)
        : (values.imgURL as string);
      const payload = {
        ...values,
        imgURL: imgURL ?? "",
        imgAlt: values.imgAlt?.trim() || values.title,
        description: values.description?.trim() || null,
        ctaLabel: values.ctaLabel?.trim() || null,
        ctaLink: values.ctaLink?.trim() || null,
      };
      if (id) update.mutate({ id, data: payload });
      else create.mutate(payload);
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  }

  const imgURL = form.watch("imgURL");
  const title = form.watch("title");
  const description = form.watch("description");
  const ctaLabel = form.watch("ctaLabel");
  const imgAlt = form.watch("imgAlt");

  const previewSrc =
    typeof imgURL === "string" && imgURL
      ? imageKitLoader({ src: imgURL, width: 1200, quality: 80 })
      : imgURL instanceof File
      ? URL.createObjectURL(imgURL)
      : null;

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;
    setCropSource(file);
  }

  function openRecrop() {
    if (!imgURL) return;
    setCropSource(imgURL as File | string);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        eyebrow={id ? "Edit slide" : "New slide"}
        title={id ? (initial?.title ?? "Slide") : "Create slide"}
        description="A hero carousel entry on the public homepage."
      />

      <SectionCard
        title="Slide"
        description="Image, copy and links shown on the homepage carousel."
      >
        <div className="space-y-6">
          <Field label="Title" hint="Used as the slide headline.">
            <Input {...form.register("title")} />
          </Field>

          <Field
            label="Description"
            hint="Optional subtext shown under the title."
          >
            <Textarea rows={2} {...form.register("description")} />
          </Field>

          <Field
            label="Slide URL"
            hint="Where the whole slide links to when clicked."
          >
            <Input {...form.register("link")} />
          </Field>

          <FieldGrid>
            <Field
              label="CTA label"
              hint="Optional. Shows a button when set."
            >
              <Input
                placeholder="e.g. Shop now"
                {...form.register("ctaLabel")}
              />
            </Field>
            <Field
              label="CTA URL"
              hint="Optional. Falls back to slide URL."
            >
              <Input {...form.register("ctaLink")} />
            </Field>
          </FieldGrid>

          <div>
            {!showAlt ? (
              <button
                type="button"
                onClick={() => setShowAlt(true)}
                className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Customize image alt text (defaults to title)
              </button>
            ) : (
              <Field
                label="Image alt"
                hint="Defaults to title if left blank."
              >
                <Input {...form.register("imgAlt")} />
              </Field>
            )}
          </div>

          <div className="space-y-3 border-t border-border/60 pt-5">
            <p className="text-xs font-semibold">Live preview</p>
            <div className="relative aspect-[16/9] w-full max-w-xl overflow-hidden rounded-xl border bg-muted">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt={imgAlt || "Slide preview"}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 grid place-items-center gap-2 text-xs text-muted-foreground transition hover:bg-muted/70"
                >
                  <Upload className="size-5" />
                  Click to upload an image
                </button>
              )}
              {previewSrc && (title || description || ctaLabel) && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              )}
              {previewSrc && (
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-2 p-4 text-white md:p-5">
                  {title && (
                    <h3 className="font-display text-lg font-semibold leading-tight drop-shadow md:text-xl">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="line-clamp-2 text-xs/relaxed text-white/90 drop-shadow md:text-sm/relaxed">
                      {description}
                    </p>
                  )}
                  {ctaLabel && (
                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-black shadow">
                      {ctaLabel}
                    </span>
                  )}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickFile}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" />
                {previewSrc ? "Replace image" : "Upload image"}
              </Button>
              {previewSrc && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openRecrop}
                >
                  <CropIcon className="size-4" />
                  Recrop
                </Button>
              )}
              {previewSrc && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    form.setValue("imgURL", "", { shouldDirty: true })
                  }
                >
                  <X className="size-4" />
                  Remove
                </Button>
              )}
              <span className="ml-auto text-[11px] text-muted-foreground">
                Cropped to 16:9
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Visibility" description="Publish and promotion.">
        <div className="flex flex-wrap gap-6">
          <Controller
            control={form.control}
            name="active"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                Active
              </label>
            )}
          />
          <Controller
            control={form.control}
            name="featured"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                Featured
              </label>
            )}
          />
        </div>
      </SectionCard>

      <ImageCropperDialog
        open={!!cropSource}
        source={cropSource}
        aspectRatio={SLIDE_ASPECT}
        onCancel={() => setCropSource(null)}
        onCrop={(file) => {
          form.setValue("imgURL", file as any, { shouldDirty: true });
          setCropSource(null);
        }}
      />

      <StickyFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/slides")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {id ? "Save changes" : "Create slide"}
        </Button>
      </StickyFooter>
    </form>
  );
}
