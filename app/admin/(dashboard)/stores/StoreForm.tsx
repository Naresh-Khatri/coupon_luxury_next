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
import { resolveImage } from "../_components/uploadImage";
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
  storeName: z.string().min(1),
  slug: z.string().min(1),
  storeURL: z.string().url(),
  image: z.union([z.string().url(), z.instanceof(File)]),
  pageHTML: z.string().default(""),
  country: z.string().default("global"),
  categoryId: z.number().int(),
  subCategoryId: z.number().int(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  metaKeywords: z.string().nullish(),
  metaSchema: z.string().nullish(),
});
type FormValues = z.infer<typeof schema>;

export default function StoreForm({
  initial,
  storeId,
}: {
  initial?: Partial<FormValues>;
  storeId?: number;
}) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: categories = [] } = trpc.admin.categories.list.useQuery();
  const { data: subCategories = [] } =
    trpc.admin.subCategories.list.useQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      storeName: "",
      slug: "",
      storeURL: "",
      image: "",
      pageHTML: "",
      country: "global",
      active: false,
      featured: false,
      ...initial,
    } as FormValues,
  });

  const create = trpc.admin.stores.create.useMutation({
    onSuccess: () => {
      toast.success("Created");
      utils.admin.stores.list.invalidate();
      router.push("/admin/stores");
    },
    onError: (e) => toast.error(e.message),
  });
  const update = trpc.admin.stores.update.useMutation({
    onSuccess: () => {
      toast.success("Updated");
      utils.admin.stores.list.invalidate();
      router.push("/admin/stores");
    },
    onError: (e) => toast.error(e.message),
  });

  async function onSubmit(values: FormValues) {
    try {
      const auth =
        values.image instanceof File
          ? await utils.admin.imagekitAuth.fetch()
          : null;
      const image = auth
        ? await resolveImage(values.image, auth)
        : (values.image as string);
      const payload = { ...values, image: image ?? "" };
      if (storeId) update.mutate({ id: storeId, data: payload });
      else create.mutate(payload);
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  }

  const { register, handleSubmit, setValue, watch, formState, control } = form;
  const image = watch("image");
  const categoryId = watch("categoryId");
  const pageHTML = watch("pageHTML");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        eyebrow={storeId ? "Edit store" : "New store"}
        title={storeId ? (initial?.storeName ?? "Store") : "Create store"}
        description="Identity, taxonomy, content, and SEO for a retail partner."
      />

      <SectionCard
        title="Identity"
        description="Primary attributes customers see."
      >
        <FieldGrid>
          <Field label="Store name">
            <Input {...register("storeName")} />
          </Field>
          <Field label="Slug">
            <Input {...register("slug")} />
          </Field>
          <Field label="Store URL">
            <Input {...register("storeURL")} placeholder="https://..." />
          </Field>
          <Field label="Country">
            <Input {...register("country")} />
          </Field>
        </FieldGrid>
        <Field label="Logo">
          <ImageKitUpload
            value={image || null}
            onChange={(v) => setValue("image", v ?? "", { shouldDirty: true })}
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Taxonomy"
        description="Where this store lives in the catalog."
      >
        <FieldGrid>
          <Field label="Category">
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Sub-category">
            <Controller
              control={control}
              name="subCategoryId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories
                      .filter(
                        (s) => !categoryId || s.categoryId === categoryId
                      )
                      .map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.subCategoryName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard
        title="Content"
        description="Full page HTML shown on the store detail view."
      >
        <Field label="Page HTML">
          <CustomEditor
            value={pageHTML ?? ""}
            onChange={(html) =>
              setValue("pageHTML", html, { shouldDirty: true })
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
                Active
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
          onClick={() => router.push("/admin/stores")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={formState.isSubmitting}>
          {storeId ? "Save changes" : "Create store"}
        </Button>
      </StickyFooter>
    </form>
  );
}
