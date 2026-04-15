"use client";

import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc/client";
import ImageKitUpload from "../_components/ImageKitUpload";
import {
  PageHeader,
  SectionCard,
  Field,
  FieldGrid,
  StickyFooter,
} from "../_components/FormKit";

const CustomEditor = dynamic(() => import("@/components/CustomEditor"), {
  ssr: false,
});

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  smallDescription: z.string(),
  fullDescription: z.string(),
  storeId: z.number().int().nullish(),
  coverImg: z.string().url().nullish(),
  thumbnailImg: z.string().url().nullish(),
  imgAlt: z.string().nullish(),
  blogType: z.string().default("normal"),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  metaKeywords: z.string().nullish(),
  metaSchema: z.string().nullish(),
});
type FormValues = z.infer<typeof schema>;

export default function BlogForm({
  initial,
  id,
}: {
  initial?: Partial<FormValues>;
  id?: number;
}) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: stores = [] } = trpc.admin.stores.list.useQuery();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
      slug: "",
      smallDescription: "",
      fullDescription: "",
      blogType: "normal",
      active: false,
      featured: false,
      ...initial,
    } as FormValues,
  });

  const create = trpc.admin.blogs.create.useMutation({
    onSuccess: () => {
      toast.success("Created");
      utils.admin.blogs.list.invalidate();
      router.push("/admin/blogs");
    },
    onError: (e) => toast.error(e.message),
  });
  const update = trpc.admin.blogs.update.useMutation({
    onSuccess: () => {
      toast.success("Updated");
      utils.admin.blogs.list.invalidate();
      router.push("/admin/blogs");
    },
    onError: (e) => toast.error(e.message),
  });

  function onSubmit(v: FormValues) {
    const payload = {
      ...v,
      storeId:
        v.storeId == null || Number.isNaN(v.storeId) || v.storeId === 0
          ? null
          : v.storeId,
      coverImg: v.coverImg ? v.coverImg : null,
      thumbnailImg: v.thumbnailImg ? v.thumbnailImg : null,
    };
    if (id) update.mutate({ id, data: payload });
    else create.mutate(payload);
  }

  const { register, handleSubmit, setValue, watch, control, formState } = form;
  const cover = watch("coverImg");
  const thumb = watch("thumbnailImg");
  const fullDescription = watch("fullDescription");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        eyebrow={id ? "Edit blog" : "New blog"}
        title={id ? (initial?.title ?? "Blog") : "Create blog post"}
        description="Editorial content surfaced across the public site."
      />

      <SectionCard title="Identity" description="Title, slug, linked store.">
        <FieldGrid>
          <Field label="Title">
            <Input {...register("title")} />
          </Field>
          <Field label="Slug">
            <Input {...register("slug")} />
          </Field>
          <Field label="Image alt text">
            <Input {...register("imgAlt")} />
          </Field>
          <Field label="Store (optional)">
            <Controller
              control={control}
              name="storeId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : "none"}
                  onValueChange={(v) =>
                    field.onChange(v === "none" ? null : Number(v))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No store</SelectItem>
                    {stores.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.storeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Imagery" description="Cover and thumbnail.">
        <FieldGrid>
          <Field label="Cover image">
            <ImageKitUpload
              value={cover || null}
              onChange={(url) => setValue("coverImg", url ?? null)}
            />
          </Field>
          <Field label="Thumbnail">
            <ImageKitUpload
              value={thumb || null}
              onChange={(url) => setValue("thumbnailImg", url ?? null)}
            />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Content" description="The post itself.">
        <Field label="Short description">
          <Textarea
            className="min-h-[80px]"
            {...register("smallDescription")}
          />
        </Field>
        <Field label="Body">
          <CustomEditor
            value={fullDescription ?? ""}
            onChange={(html) =>
              setValue("fullDescription", html, { shouldDirty: true })
            }
          />
        </Field>
      </SectionCard>

      <SectionCard title="SEO" description="Search engine metadata.">
        <FieldGrid>
          <Field label="Meta title">
            <Input {...register("metaTitle")} />
          </Field>
          <Field label="Meta keywords">
            <Input {...register("metaKeywords")} />
          </Field>
        </FieldGrid>
        <Field label="Meta description">
          <Textarea className="min-h-[80px]" {...register("metaDescription")} />
        </Field>
      </SectionCard>

      <SectionCard title="Visibility" description="Publish and promotion.">
        <div className="flex flex-wrap gap-6">
          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                Published
              </label>
            )}
          />
          <Controller
            control={control}
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

      <StickyFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/blogs")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={formState.isSubmitting}>
          {id ? "Save changes" : "Create post"}
        </Button>
      </StickyFooter>
    </form>
  );
}
