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
  title: z.string().min(1),
  order: z.number().int(),
  link: z.string(),
  imgURL: z.string().url(),
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
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
      order: 0,
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

  function onSubmit(values: FormValues) {
    if (id) update.mutate({ id, data: values });
    else create.mutate(values);
  }

  const imgURL = form.watch("imgURL");
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input {...form.register("title")} />
        </div>
        <div className="space-y-1.5">
          <Label>Order</Label>
          <Input
            type="number"
            {...form.register("order", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Link</Label>
          <Input {...form.register("link")} />
        </div>
        <div className="space-y-1.5">
          <Label>Image alt</Label>
          <Input {...form.register("imgAlt")} />
        </div>
      </div>
      <ImageKitUpload
        value={imgURL || null}
        onChange={(url) => form.setValue("imgURL", url ?? "")}
      />
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("active")} /> Active
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("featured")} /> Featured
        </label>
      </div>
      <div className="flex gap-3">
        <Button type="submit">{id ? "Update" : "Create"}</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/slides")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
