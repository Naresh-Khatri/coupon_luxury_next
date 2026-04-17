import type { Metadata } from "next";
import BlogPreview from "@/components/BlogPreview";
import { getPublicBlogs } from "@/server/db/queries/blogs";

export const metadata: Metadata = {
  title: "CouponLuxury Blog: Money Saving Tips & Updates",
  description:
    "Couponluxury Blog section gives every valued user a different understanding of online shopping, money saving, coupon redemption, product reviews & many more.",
  alternates: { canonical: "https://www.couponluxury.com/blogs" },
};

export default async function BlogsIndex() {
  const blogsData = await getPublicBlogs();

  return (
    <>
      <h1 hidden>
        Unlock the Secrets of Shopping: Expert Tips, Tricks, Trends, and Deals on Our Blog
      </h1>
      <div className="banner-bg relative overflow-hidden px-4 py-12 text-center md:py-16">
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-60"
          style={{
            background:
              "linear-gradient(to right, transparent, #C49A3C, transparent)",
          }}
        />
        <p className="mb-3 text-xs font-semibold uppercase tracking-[3px] text-gold">
          Insights &amp; Savings
        </p>
        <h2 className="mb-3 text-4xl font-bold leading-[1.1] text-white md:text-6xl">
          The Coupon Luxury Blog
        </h2>
        <p className="text-sm text-white/60 md:text-base">
          {blogsData?.length} articles on deals, tips &amp; smart shopping
        </p>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {blogsData?.map((blog) => (
            <BlogPreview key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </>
  );
}
