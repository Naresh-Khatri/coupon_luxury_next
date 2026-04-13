"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchBox() {
  const [searchText, setSearchText] = useState("");
  const query = trpc.public.searchStores.useQuery(
    { q: searchText },
    { enabled: searchText.length > 0, staleTime: 30_000 }
  );
  const fetchingList = query.isFetching;
  const searchResults = query.data ?? [];
  const clearSearch = () => setSearchText("");

  return (
    <div className="relative mx-3 hidden max-w-[350px] grow items-center sm:flex">
      <Popover open={searchText.length > 0}>
        <PopoverAnchor asChild>
          <div className="relative w-full">
            <Input
              type="search"
              aria-label="search"
              placeholder="Search"
              className="h-10 w-full rounded-[10px] bg-white pr-10 font-semibold text-black"
              value={searchText}
              onInput={(e) =>
                setSearchText((e.target as HTMLInputElement).value)
              }
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60">
              {searchText.length > 0 ? (
                fetchingList ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )
              ) : (
                <Search className="size-4" />
              )}
            </div>
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-2"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {fetchingList ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">No results</div>
          ) : (
            <ul className="space-y-1">
              {searchResults.map((result) => (
                <li key={result.slug}>
                  <Link
                    href={`/stores/${result.slug}`}
                    onClick={clearSearch}
                    className="flex items-center justify-between rounded-sm px-2 py-1.5 font-semibold text-foreground hover:bg-muted"
                  >
                    <span>{result.storeName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      Store
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
