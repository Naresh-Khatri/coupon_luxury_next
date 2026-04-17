import { ShieldCheck } from "lucide-react";

type SummaryOffer = {
  title: string;
  offerType: string;
  discountType?: string | null;
  discountValue?: number | null;
};

function discountLabel(o: SummaryOffer): string {
  if (!o.discountValue || o.discountValue <= 0) {
    return o.offerType === "coupon" ? "Promo code" : "Special deal";
  }
  return o.discountType === "percentage"
    ? `Up to ${o.discountValue}% Off`
    : `Flat ₹${o.discountValue.toLocaleString("en-IN")} Off`;
}

export default function StoreCodesSummary({
  offers,
  storeName,
}: {
  offers: SummaryOffer[];
  storeName: string;
}) {
  if (!offers.length) return null;
  const rows = offers.slice(0, 8);
  const monthYear = (() => {
    const d = new Date();
    return `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
  })();

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4 md:px-8">
        <h2 className="text-[14px] font-bold text-navy">
          Verified {storeName} coupon codes &amp; promo codes for {monthYear}
        </h2>
        <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-emerald-600">
          <ShieldCheck className="size-3.5" /> Hand-checked daily
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[13px]">
          <thead className="bg-gray-50 text-[10.5px] font-bold uppercase tracking-[0.14em] text-gray-500">
            <tr>
              <th className="px-6 py-3 md:px-8">Category</th>
              <th className="px-6 py-3 md:px-8">
                {storeName} discount code &amp; offer
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((o, i) => (
              <tr key={i} className="transition-colors hover:bg-gold/5">
                <td className="px-6 py-3 font-medium text-navy md:px-8">
                  {discountLabel(o)}
                </td>
                <td className="px-6 py-3 text-gray-700 md:px-8">{o.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
