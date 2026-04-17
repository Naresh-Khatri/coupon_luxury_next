"use client";

import { useTransition } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { setCountryAction } from "@/app/actions/country";

type CountryOption = {
  code: string;
  name: string;
  flagEmoji: string | null;
};

export default function CountrySelector({
  countries,
  selected,
}: {
  countries: CountryOption[];
  selected: string | null;
}) {
  const [pending, start] = useTransition();

  const pick = (country: string | null) => {
    start(() => {
      setCountryAction(country);
    });
  };

  if (countries.length === 0) return null;

  const current = countries.find((c) => c.code === selected) ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-white/85 transition-all outline-none hover:bg-white/10 hover:text-white",
          pending && "opacity-60"
        )}
      >
        {current?.flagEmoji ? (
          <span className="text-base leading-none">{current.flagEmoji}</span>
        ) : (
          <Globe className="size-4 text-white/70" />
        )}
        <span className="max-w-[80px] truncate">{current?.name ?? "All"}</span>
        <ChevronDown className="size-3.5 text-white/60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[320px] overflow-auto"
      >
        <DropdownMenuItem
          className="flex items-center justify-between gap-6 text-sm"
          onSelect={() => pick(null)}
        >
          <span className="flex items-center gap-2">
            <Globe className="size-4 text-muted-foreground" />
            All countries
          </span>
          {selected === null && <Check className="size-4 text-teal" />}
        </DropdownMenuItem>
        {countries.map((c) => (
          <DropdownMenuItem
            key={c.code}
            className="flex items-center justify-between gap-6 text-sm"
            onSelect={() => pick(c.code)}
          >
            <span className="flex items-center gap-2">
              {c.flagEmoji ? (
                <span className="text-base leading-none">{c.flagEmoji}</span>
              ) : (
                <span className="inline-block size-4" />
              )}
              {c.name}
            </span>
            {selected === c.code && <Check className="size-4 text-teal" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
