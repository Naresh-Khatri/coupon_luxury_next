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
import { trpc } from "@/lib/trpc/client";
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
  categoryName: z.string().min(1),
  slug: z.string().min(1),
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

  async function onSubmit(values: FormValues) {
    if (id) update.mutate({ id, data: values });
    else create.mutate(values);
  }

  const { register, handleSubmit, setValue, watch, control, formState } = form;
  const pageHTML = watch("pageHTML");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PageHeader
        eyebrow={id ? "Edit category" : "New category"}
        title={id ? (initial?.categoryName ?? "Category") : "Create category"}
        description="Top-level grouping for stores and offers."
      />

      <SectionCard title="Identity" description="Name and slug.">
        <FieldGrid>
          <Field label="Category name">
            <Input {...register("categoryName")} />
          </Field>
          <Field label="Slug">
            <Input {...register("slug")} />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Content" description="Description and landing HTML.">
        <Field label="Short description">
          <Textarea className="min-h-[100px]" {...register("description")} />
        </Field>
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
          onClick={() => router.push("/admin/categories")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={formState.isSubmitting}>
          {id ? "Save changes" : "Create category"}
        </Button>
      </StickyFooter>
    </form>
  );
}
