import { ChevronDown } from "lucide-react";

export type Faq = { q: string; a: string };

export default function StoreFaqs({
  faqs,
  storeName,
}: {
  faqs: Faq[];
  storeName: string;
}) {
  if (!faqs.length) return null;
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-6 py-4 md:px-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
          {storeName} FAQs
        </h2>
      </div>
      <div className="divide-y divide-gray-100 px-6 md:px-8">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold text-navy">
              <span>{faq.q}</span>
              <ChevronDown className="size-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-gray-700">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
