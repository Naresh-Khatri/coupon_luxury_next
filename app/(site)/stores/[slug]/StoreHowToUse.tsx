import { CheckCircle2 } from "lucide-react";

export default function StoreHowToUse({
  steps,
  storeName,
}: {
  steps: string[];
  storeName: string;
}) {
  if (!steps.length) return null;
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-6 py-4 md:px-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
          How to use {storeName} coupons
        </h2>
      </div>
      <ol className="space-y-4 px-6 py-6 md:px-8 md:py-8">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[12px] font-bold text-navy">
              {i + 1}
            </span>
            <p className="pt-0.5 text-[14px] leading-relaxed text-gray-700">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
