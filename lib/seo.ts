const SITE_URL = "https://www.couponluxury.com";

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export type OfferJsonLdInput = {
  name: string;
  description?: string | null;
  url: string;
  priceCurrency?: string;
  price?: string | number;
  priceSpecification?: {
    discount: string | number;
    discountType: "percentage" | "flat";
  };
  validFrom?: string | Date | null;
  validThrough?: string | Date | null;
  seller: { name: string; url?: string; logo?: string };
  category?: string | null;
};

export function offerJsonLd(o: OfferJsonLdInput) {
  const validThrough = o.validThrough
    ? new Date(o.validThrough).toISOString()
    : undefined;
  const validFrom = o.validFrom ? new Date(o.validFrom).toISOString() : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: o.name,
    description: o.description ?? undefined,
    url: o.url,
    priceCurrency: o.priceCurrency ?? "USD",
    ...(o.price != null ? { price: String(o.price) } : {}),
    ...(o.priceSpecification
      ? {
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(o.priceSpecification.discount),
            priceCurrency:
              o.priceSpecification.discountType === "percentage"
                ? undefined
                : o.priceCurrency ?? "USD",
            valueAddedTaxIncluded: false,
          },
        }
      : {}),
    validFrom,
    validThrough,
    availability: "https://schema.org/InStock",
    category: o.category ?? undefined,
    seller: {
      "@type": "Organization",
      name: o.seller.name,
      url: o.seller.url,
      logo: o.seller.logo,
    },
  };
}

export function renderJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export { SITE_URL };
