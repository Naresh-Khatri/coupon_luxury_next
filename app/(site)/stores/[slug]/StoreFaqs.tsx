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
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4 md:px-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {storeName} FAQs
        </h2>
      </div>
      <div className="divide-y divide-border px-6 md:px-8">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold text-foreground">
              <span>{faq.q}</span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-foreground/80">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
