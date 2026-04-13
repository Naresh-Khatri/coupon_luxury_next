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
  categoryName: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().url(),
  imgAlt: z.string().default(""),
  description: z.string().nullish(),
  pageHTML: z.string().nullish(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  metaKeywords: z.string().nullish(),
  metaSchema: z.string().nullish(),
});
type FormValues = z.infer<typeof schema>;

export default function CategoryForm({
  initial,
  id,
}: {
  initial?: Partial<FormValues>;
  id?: number;
}) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      categoryName: "",
      slug: "",
      image: "",
      imgAlt: "",
      active: false,
      featured: false,
      ...initial,
    } as FormValues,
  });

  const create = trpc.admin.categories.create.useMutation({
    onSuccess: () => {
      toast.success("Created");
      utils.admin.categories.list.invalidate();
      router.push("/admin/categories");
    },
    onError: (e) => toast.error(e.message),
  });
  const update = trpc.admin.categories.update.useMutation({
    onSuccess: () => {
      toast.success("Updated");
      utils.admin.categories.list.invalidate();
      router.push("/admin/categories");
    },
    onError: (e) => toast.error(e.message),
  });

  function onSubmit(values: FormValues) {
    if (id) update.mutate({ id, data: values });
    else create.mutate(values);
  }

  const { register, handleSubmit, setValue, watch } = form;
  const image = watch("image");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Category name</Label>
          <Input {...register("categoryName")} />
        </div>
        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input {...register("slug")} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label>Image alt</Label>
          <Input {...register("imgAlt")} />
        </div>
      </div>

      <ImageKitUpload
        value={image || null}
        onChange={(url) => setValue("image", url ?? "")}
      />

      <div className="space-y-1.5">
        <Label>Description</Label>
        <textarea
          className="min-h-[100px] w-full rounded-md border p-3"
          {...register("description")}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Page HTML</Label>
        <textarea
          className="min-h-[150px] w-full rounded-md border p-3 font-mono text-sm"
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
        <Button type="submit">{id ? "Update" : "Create"}</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
