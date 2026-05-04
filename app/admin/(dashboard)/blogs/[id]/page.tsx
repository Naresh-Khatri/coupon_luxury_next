"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import BlogForm from "../BlogForm";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const blogId = Number(id);
  const { data, isLoading } = trpc.admin.blogs.byId.useQuery(blogId);

  if (isLoading) return <div>Loading…</div>;
  if (!data) return <div>Not found</div>;

  return <BlogForm id={blogId} initial={data as any} />;
}
