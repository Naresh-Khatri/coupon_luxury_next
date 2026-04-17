"use client";

import dynamic from "next/dynamic";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
  howToUse: z
    .array(z.object({ value: z.string() }))
    .default([]),
  faqs: z
    .array(z.object({ q: z.string(), a: z.string() }))
    .default([]),
  country: z.string().default("global"),
  categoryId: z.number().int(),
  subCategoryId: z.number().int(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  storeOfTheMonth: z.boolean().default(false),
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
  const { data: countries = [] } = trpc.admin.countries.list.useQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      storeName: "",
      slug: "",
      storeURL: "",
      image: "",
      pageHTML: "",
      howToUse: [],
      faqs: [],
      country: "global",
      active: false,
      featured: false,
      storeOfTheMonth: false,
      ...initial,
    } as FormValues,
  });

  const stepsField = useFieldArray({ control: form.control, name: "howToUse" });
  const faqsField = useFieldArray({ control: form.control, name: "faqs" });

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
      const howToUse = (values.howToUse ?? [])
        .map((s) => s.value.trim())
        .filter(Boolean);
      const faqs = (values.faqs ?? [])
        .map((f) => ({ q: f.q.trim(), a: f.a.trim() }))
        .filter((f) => f.q && f.a);
      const payload = {
        ...values,
        image: image ?? "",
        howToUse: howToUse.length ? howToUse : null,
        faqs: faqs.length ? faqs : null,
      };
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
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.flagEmoji ? `${c.flagEmoji} ` : ""}
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
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

      <SectionCard
        title="How to use"
        description="Step-by-step instructions shown on the store page."
      >
        <div className="space-y-3">
          {stepsField.fields.map((f, i) => (
            <div key={f.id} className="flex items-start gap-2">
              <span className="mt-2 w-6 shrink-0 text-center text-sm font-semibold text-muted-foreground">
                {i + 1}.
              </span>
              <Input
                placeholder="Describe one step…"
                {...register(`howToUse.${i}.value` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => stepsField.remove(i)}
                title="Remove step"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => stepsField.append({ value: "" })}
          >
            <Plus className="size-4" /> Add step
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="FAQs"
        description="Question/answer pairs rendered as an accordion plus JSON-LD."
      >
        <div className="space-y-4">
          {faqsField.fields.map((f, i) => (
            <div
              key={f.id}
              className="space-y-2 rounded-md border border-border p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  FAQ {i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => faqsField.remove(i)}
                  title="Remove FAQ"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <Input
                placeholder="Question"
                {...register(`faqs.${i}.q` as const)}
              />
              <Textarea
                className="min-h-[80px]"
                placeholder="Answer"
                {...register(`faqs.${i}.a` as const)}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => faqsField.append({ q: "", a: "" })}
          >
            <Plus className="size-4" /> Add FAQ
          </Button>
        </div>
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
          <Controller
            control={control}
            name="storeOfTheMonth"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                Store of the month
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
