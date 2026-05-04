import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  code?: string | null;
  name?: string | null;
  flagEmoji?: string | null;
  variant?: "inline" | "chip";
  /** Pixel size of the flag thumbnail. */
  size?: number;
  /** Hide the country name and show only the flag. */
  iconOnly?: boolean;
  className?: string;
};

export default function CountryBadge({
  code,
  name,
  flagEmoji,
  variant = "inline",
  size = 18,
  iconOnly = false,
  className,
}: Props) {
  if (!code && !name && !flagEmoji) return null;

  const label = name ?? code?.toUpperCase() ?? "";
  const Flag = <CountryFlag code={code} flagEmoji={flagEmoji} size={size} />;

  if (variant === "chip") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground",
          className,
        )}
        title={label}
      >
        {Flag}
        {!iconOnly && <span className="truncate">{label}</span>}
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      title={label}
    >
      {Flag}
      {!iconOnly && <span className="truncate">{label}</span>}
    </span>
  );
}

function CountryFlag({
  code,
  flagEmoji,
  size,
}: {
  code?: string | null;
  flagEmoji?: string | null;
  size: number;
}) {
  const isoCode = code?.toLowerCase().trim();
  const looksIso = !!isoCode && /^[a-z]{2}$/.test(isoCode);

  if (looksIso) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://flagcdn.com/${isoCode}.svg`}
        alt=""
        width={size}
        height={Math.round(size * 0.75)}
        loading="lazy"
        decoding="async"
        className="inline-block shrink-0 rounded-[2px] object-cover ring-1 ring-black/5"
        style={{ width: size, height: Math.round(size * 0.75) }}
      />
    );
  }

  if (flagEmoji) {
    return (
      <span
        className="leading-none"
        style={{ fontSize: size }}
        aria-hidden
      >
        {flagEmoji}
      </span>
    );
  }

  return (
    <Globe
      className="text-muted-foreground"
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}
