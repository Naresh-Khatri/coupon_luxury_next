import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import transformPath from "@/utils/transformImagePath";

type Item = {
  id: string | number;
  slug: string;
  name: string;
  image?: string | null;
  count: number;
};

export default function PopularList({
  title,
  items,
  hrefBase,
  defaultOpen = true,
  className,
}: {
  title: string;
  items: Item[];
  hrefBase: string;
  defaultOpen?: boolean;
  className?: string;
}) {
  if (!items.length) return null;
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <details
      open={defaultOpen}
      className={`group border-t border-border last:border-b ${className ?? ""}`}
    >
      <summary className="mx-auto flex max-w-[1200px] cursor-pointer list-none items-center justify-between px-4 py-5 md:py-6 [&::-webkit-details-marker]:hidden">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
          {title}
        </h2>
        <Plus className="h-5 w-5 text-foreground/60 group-open:hidden" />
        <Minus className="hidden h-5 w-5 text-foreground/60 group-open:block" />
      </summary>
      <div className="mx-auto max-w-[1200px] px-4 pb-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sorted.map((item) => (
            <Link
              key={item.id}
              href={`${hrefBase}/${item.slug}`}
              className="group/item flex items-center gap-2.5 rounded-md py-1.5 text-[14px] text-foreground/80 transition-colors hover:text-gold"
            >
              {item.image && (
                <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-white/95 ring-1 ring-black/5 transition-all group-hover/item:border-gold/40 group-hover/item:ring-gold/10">
                  <Image
                    src={transformPath(item.image, 80)}
                    alt=""
                    width={32}
                    height={32}
                    className="h-7 w-7 object-contain"
                  />
                </span>
              )}
              <span className="line-clamp-1 font-medium">{item.name}</span>
              <span className="text-foreground/40 tabular-nums">
                ({item.count})
              </span>
            </Link>
          ))}
        </div>
      </div>
    </details>
  );
}
