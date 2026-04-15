"use client";

import dynamic from "next/dynamic";
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

  const { register, handleSubmit, setValue, watch } = form;
  const cover = watch("coverImg");
  const thumb = watch("thumbnailImg");
  const fullDescription = watch("fullDescription");

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
          <Label>Image alt</Label>
          <Input {...register("imgAlt")} />
        </div>
        <div className="space-y-1.5">
          <Label>Store (optional)</Label>
          <select
            className="h-10 w-full rounded-md border px-3"
            {...register("storeId", {
              setValueAs: (v) => (v === "" ? null : Number(v)),
            })}
          >
            <option value="">No store</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.storeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ImageKitUpload
          label="Cover image"
          value={cover || null}
          onChange={(url) => setValue("coverImg", url ?? null)}
        />
        <ImageKitUpload
          label="Thumbnail"
          value={thumb || null}
          onChange={(url) => setValue("thumbnailImg", url ?? null)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Short description</Label>
        <textarea
          className="min-h-[80px] w-full rounded-md border p-3"
          {...register("smallDescription")}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Content</Label>
        <CustomEditor
          value={fullDescription ?? ""}
          onChange={(html) =>
            setValue("fullDescription", html, { shouldDirty: true })
          }
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
          onClick={() => router.push("/admin/blogs")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
