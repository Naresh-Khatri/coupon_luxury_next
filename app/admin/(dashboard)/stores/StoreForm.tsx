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
import ImageKitUpload from "../_components/ImageKitUpload";

const schema = z.object({
  storeName: z.string().min(1),
  slug: z.string().min(1),
  storeURL: z.string().url(),
  image: z.string().url(),
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

  function onSubmit(values: FormValues) {
    if (storeId) update.mutate({ id: storeId, data: values });
    else create.mutate(values);
  }

  const { register, handleSubmit, setValue, watch, formState } = form;
  const image = watch("image");
  const categoryId = watch("categoryId");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Store Name</Label>
          <Input {...register("storeName")} />
        </div>
        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input {...register("slug")} />
        </div>
        <div className="space-y-1.5">
          <Label>Store URL</Label>
          <Input {...register("storeURL")} />
        </div>
        <div className="space-y-1.5">
          <Label>Country</Label>
          <Input {...register("country")} />
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <select
            className="h-10 w-full rounded-md border px-3"
            {...register("categoryId", { valueAsNumber: true })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Sub-category</Label>
          <select
            className="h-10 w-full rounded-md border px-3"
            {...register("subCategoryId", { valueAsNumber: true })}
          >
            <option value="">Select sub-category</option>
            {subCategories
              .filter((s) => !categoryId || s.categoryId === categoryId)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subCategoryName}
                </option>
              ))}
          </select>
        </div>
      </div>

      <ImageKitUpload
        label="Logo"
        value={image || null}
        onChange={(url) => setValue("image", url ?? "")}
      />

      <div className="space-y-1.5">
        <Label>Page HTML</Label>
        <textarea
          className="min-h-[200px] w-full rounded-md border p-3 font-mono text-sm"
          {...register("pageHTML")}
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
        <Button type="submit" disabled={formState.isSubmitting}>
          {storeId ? "Update" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/stores")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
