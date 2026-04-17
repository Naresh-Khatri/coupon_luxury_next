import Link from "next/link";

type Category = {
  id: string | number;
  slug: string;
  categoryName: string;
};

export default function PopularCategoriesList({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories.length) return null;
  const sorted = [...categories].sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName)
  );

  return (
    <section className="bg-muted px-4 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3 md:grid-cols-4">
          {sorted.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="text-[14px] text-foreground/80 transition-colors hover:text-gold"
            >
              {c.categoryName} Coupons
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
