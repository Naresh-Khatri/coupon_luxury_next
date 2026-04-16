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
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().default(""),
  coverImg: z.union([z.string().url(), z.instanceof(File)]).nullish(),
  TnC: z.string().default(""),
  URL: z.string().default(""),
  affURL: z.string().default(""),
  offerType: z.enum(["deal", "coupon"]),
  discountType: z.string().default("percentage"),
  discountValue: z.number().int().default(0),
  couponCode: z.string().nullish(),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  country: z.string().default("global"),
  storeId: z.number().int(),
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

export default function OfferForm({
  initial,
  id,
}: {
  initial?: Partial<FormValues>;
  id?: number;
}) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: stores = [] } = trpc.admin.stores.list.useQuery();
  const { data: cats = [] } = trpc.admin.categories.list.useQuery();
  const { data: subs = [] } = trpc.admin.subCategories.list.useQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      TnC: "",
      URL: "",
      affURL: "",
      offerType: "deal",
      discountType: "percentage",
      discountValue: 0,
      startDate: "",
      endDate: "",
      country: "global",
      active: false,
      featured: false,
      ...initial,
    } as FormValues,
  });

  const create = trpc.admin.offers.create.useMutation({
    onSuccess: () => {
      toast.success("Created");
      utils.admin.offers.list.invalidate();
      router.push("/admin/offers");
    },
    onError: (e) => toast.error(e.message),
  });
  const update = trpc.admin.offers.update.useMutation({
    onSuccess: () => {
      toast.success("Updated");
      utils.admin.offers.list.invalidate();
      router.push("/admin/offers");
    },
    onError: (e) => toast.error(e.message),
  });

  async function onSubmit(v: FormValues) {
    try {
      const auth =
        v.coverImg instanceof File
          ? await utils.admin.imagekitAuth.fetch()
          : null;
      const coverImg = auth
        ? await resolveImage(v.coverImg, auth)
        : ((v.coverImg as string | null | undefined) ?? null);
      const payload = { ...v, coverImg: coverImg || null };
      if (id) update.mutate({ id, data: payload });
      else create.mutate(payload);
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  }

  const { register, handleSubmit, setValue, watch, control, formState } = form;
  const categoryId = watch("categoryId");
  const offerType = watch("offerType");
  const description = watch("description");
  const TnC = watch("TnC");
  const cover = watch("coverImg");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        eyebrow={id ? "Edit offer" : "New offer"}
        title={id ? (initial?.title ?? "Offer") : "Create offer"}
        description="A deal or coupon attached to a store and category."
      />

      <SectionCard title="Identity" description="Naming and URLs.">
        <FieldGrid>
          <Field label="Title">
            <Input {...register("title")} />
          </Field>
          <Field label="Slug">
            <Input {...register("slug")} />
          </Field>
          <Field label="Type">
            <Controller
              control={control}
              name="offerType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deal">Deal</SelectItem>
                    <SelectItem value="coupon">Coupon</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field
            label="Coupon code"
            hint={offerType === "coupon" ? "Required for coupons" : "Not used"}
          >
            <Input
              disabled={offerType !== "coupon"}
              {...register("couponCode")}
            />
          </Field>
          <Field label="Destination URL">
            <Input {...register("URL")} />
          </Field>
          <Field label="Affiliate URL">
            <Input {...register("affURL")} />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Discount" description="How much, for how long.">
        <FieldGrid>
          <Field label="Discount type">
            <Input {...register("discountType")} />
          </Field>
          <Field label="Discount value">
            <Input
              type="number"
              {...register("discountValue", { valueAsNumber: true })}
            />
          </Field>
          <Field label="Start date">
            <Input type="date" {...register("startDate")} />
          </Field>
          <Field label="End date">
            <Input type="date" {...register("endDate")} />
          </Field>
          <Field label="Country">
            <Input {...register("country")} />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Taxonomy" description="Where this offer lives.">
        <FieldGrid>
          <Field label="Store">
            <Controller
              control={control}
              name="storeId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
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
                    {cats.map((c) => (
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
                    {subs
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

      <SectionCard title="Copy" description="Shown on the offer detail page.">
        <Field label="Cover image" hint="Optional">
          <ImageKitUpload
            value={cover || null}
            onChange={(v) =>
              setValue("coverImg", v ?? null, { shouldDirty: true })
            }
          />
        </Field>
        <Field label="Description">
          <CustomEditor
            variant="minimal"
            value={description ?? ""}
            onChange={(html) =>
              setValue("description", html, { shouldDirty: true })
            }
          />
        </Field>
        <Field label="Terms & Conditions">
          <CustomEditor
            variant="minimal"
            value={TnC ?? ""}
            onChange={(html) => setValue("TnC", html, { shouldDirty: true })}
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
          onClick={() => router.push("/admin/offers")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={formState.isSubmitting}>
          {id ? "Save changes" : "Create offer"}
        </Button>
      </StickyFooter>
    </form>
  );
}
