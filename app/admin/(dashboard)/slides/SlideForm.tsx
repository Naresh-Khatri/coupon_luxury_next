"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

const schema = z.object({
  title: z.string().min(1),
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
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
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
      const payload = { ...values, imgURL: imgURL ?? "" };
      if (id) update.mutate({ id, data: payload });
      else create.mutate(payload);
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  }

  const imgURL = form.watch("imgURL");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        eyebrow={id ? "Edit slide" : "New slide"}
        title={id ? (initial?.title ?? "Slide") : "Create slide"}
        description="A hero carousel entry on the public homepage."
      />

      <SectionCard title="Identity" description="Title, order, destination.">
        <FieldGrid>
          <Field label="Title">
            <Input {...form.register("title")} />
          </Field>
          <Field label="Link">
            <Input {...form.register("link")} />
          </Field>
          <Field label="Image alt">
            <Input {...form.register("imgAlt")} />
          </Field>
        </FieldGrid>
        <Field label="Image">
          <ImageKitUpload
            value={imgURL || null}
            onChange={(v) =>
              form.setValue("imgURL", v ?? "", { shouldDirty: true })
            }
          />
        </Field>
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
