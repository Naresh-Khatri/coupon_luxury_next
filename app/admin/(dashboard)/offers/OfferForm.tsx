"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().default(""),
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

  function onSubmit(v: FormValues) {
    if (id) update.mutate({ id, data: v });
    else create.mutate(v);
  }

  const { register, handleSubmit, watch } = form;
  const categoryId = watch("categoryId");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input {...register("title")} />
        </div>
        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input {...register("slug")} />
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <select
            {...register("offerType")}
            className="h-10 w-full rounded-md border px-3"
          >
            <option value="deal">Deal</option>
            <option value="coupon">Coupon</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Coupon code (if coupon)</Label>
          <Input {...register("couponCode")} />
        </div>
        <div className="space-y-1.5">
          <Label>URL</Label>
          <Input {...register("URL")} />
        </div>
        <div className="space-y-1.5">
          <Label>Affiliate URL</Label>
          <Input {...register("affURL")} />
        </div>
        <div className="space-y-1.5">
          <Label>Discount type</Label>
          <Input {...register("discountType")} />
        </div>
        <div className="space-y-1.5">
          <Label>Discount value</Label>
          <Input
            type="number"
            {...register("discountValue", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Start date</Label>
          <Input type="date" {...register("startDate")} />
        </div>
        <div className="space-y-1.5">
          <Label>End date</Label>
          <Input type="date" {...register("endDate")} />
        </div>
        <div className="space-y-1.5">
          <Label>Country</Label>
          <Input {...register("country")} />
        </div>
        <div className="space-y-1.5">
          <Label>Store</Label>
          <select
            {...register("storeId", { valueAsNumber: true })}
            className="h-10 w-full rounded-md border px-3"
          >
            <option value="">Select</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.storeName}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <select
            {...register("categoryId", { valueAsNumber: true })}
            className="h-10 w-full rounded-md border px-3"
          >
            <option value="">Select</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Sub-category</Label>
          <select
            {...register("subCategoryId", { valueAsNumber: true })}
            className="h-10 w-full rounded-md border px-3"
          >
            <option value="">Select</option>
            {subs
              .filter((s) => !categoryId || s.categoryId === categoryId)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subCategoryName}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <textarea
          className="min-h-[120px] w-full rounded-md border p-3"
          {...register("description")}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Terms &amp; Conditions</Label>
        <textarea
          className="min-h-[80px] w-full rounded-md border p-3"
          {...register("TnC")}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Meta title</Label>
          <Input {...register("metaTitle")} />
        </div>
        <div className="space-y-1.5">
          <Label>Meta keywords</Label>
          <Input {...register("metaKeywords")} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label>Meta description</Label>
          <textarea
            className="min-h-[80px] w-full rounded-md border p-3"
            {...register("metaDescription")}
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("active")} /> Active
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("featured")} /> Featured
        </label>
      </div>
      <div className="flex gap-3">
        <Button type="submit">{id ? "Update" : "Create"}</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/offers")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
