import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BlogPreviewSmall from "@/components/BlogPreviewSmall";
import ReadingProgress from "./ReadingProgress";
import { getBlogBySlug, getPublicBlogs } from "@/server/db/queries/blogs";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatDate = (date: string | number | Date) => {
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

async function getData(slug: string) {
  const blogData = await getBlogBySlug(slug);
  if (!blogData) return null;
  const all = await getPublicBlogs(10);
  const allBlogs = all.filter(
    (b) => b.slug.toLowerCase() !== slug.toLowerCase()
  );
  return { blogData, allBlogs };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getData(params.slug);
  if (!data) return {};
  const { blogData } = data;
  const url = `https://www.couponluxury.com/blogs/${blogData.slug}`;
  return {
    title: `${blogData.metaTitle ?? blogData.title} - Coupons Luxury`,
    description: blogData.metaDescription ?? undefined,
    keywords: blogData.metaKeywords ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: blogData.metaTitle ?? blogData.title,
      description: blogData.metaDescription ?? undefined,
      images: blogData.coverImg ? [blogData.coverImg] : [],
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getData(params.slug);
  if (!data) notFound();
  const { blogData, allBlogs } = data;
  const { title, coverImg, fullDescription, imgAlt, createdAt } = blogData;

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto mb-16 max-w-[1200px] px-4 md:px-6">
        <div className="mt-6 grid w-full gap-8 md:mt-10 lg:grid-cols-[1fr_340px] lg:gap-10">
          <article className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={coverImg ?? "/placeholder.svg"}
                alt={imgAlt ?? title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            <div className="p-5 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-[2px] w-6 rounded-full bg-gold" />
                <span className="text-xs font-semibold uppercase tracking-[1.5px] text-gold">
                  {formatDate(createdAt)}
                </span>
              </div>

              <h1 className="mb-6 font-[var(--font-display)] text-3xl font-bold leading-[1.1] text-gray-900 md:text-4xl lg:text-5xl">
                {title}
              </h1>

              <hr className="mb-6 border-gray-100" />

              <div
                className="page-html"
                dangerouslySetInnerHTML={{ __html: fullDescription }}
              />
            </div>
          </article>

          <aside className="lg:sticky lg:top-[88px]">
            <div className="mb-5 flex items-center gap-3 px-1">
              <span className="h-6 w-[3px] rounded-full bg-gold" />
              <h3 className="text-lg font-bold tracking-[0.3px] text-gray-900">
                More Articles
              </h3>
            </div>
            <div>
              {allBlogs.slice(0, 8).map((blog) => (
                <BlogPreviewSmall key={blog.id} blog={blog} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
