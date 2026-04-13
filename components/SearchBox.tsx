"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { Search, X, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type Result = {
  slug: string;
  storeName?: string;
  categoryName?: string;
};

export default function SearchBox() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [fetchingList, setFetchingList] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = (fn: () => void, delay: number) => {
    setFetchingList(true);
    setSearchResults([]);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fn, delay);
  };

  const handleSearch = async (text: string) => {
    try {
      const res = await Promise.allSettled([
        axios.post(process.env.domain + "/stores/getAutoCompleteData", {
          searchText: text,
        }),
        axios.post(process.env.domain + "/categories/getAutoCompleteData", {
          searchText: text,
        }),
      ]);
      const storeData =
        res[0].status === "fulfilled" ? res[0].value.data : [];
      const catData = res[1].status === "fulfilled" ? res[1].value.data : [];
      setSearchResults([...catData, ...storeData]);
    } finally {
      setFetchingList(false);
    }
  };

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
              onInput={(e) => {
                const value = (e.target as HTMLInputElement).value;
                setSearchText(value);
                if (value) debounce(() => handleSearch(value), 500);
              }}
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
                    href={
                      result.storeName
                        ? `/stores/${result.slug}`
                        : `/categories/${result.slug}`
                    }
                    onClick={clearSearch}
                    className="flex items-center justify-between rounded-sm px-2 py-1.5 font-semibold text-foreground hover:bg-muted"
                  >
                    <span>{result.storeName || result.categoryName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {result.storeName ? "Store" : "Category"}
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
