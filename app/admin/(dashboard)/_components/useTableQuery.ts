"use client";

import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";
import {
  getFiltersStateParser,
  getSortingStateParser,
} from "@/lib/parsers";

export function useTableQuery(columnIds: string[]) {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const [sort] = useQueryState(
    "sort",
    getSortingStateParser(columnIds).withDefault([]),
  );
  const [filters] = useQueryState(
    "filters",
    getFiltersStateParser(columnIds).withDefault([]),
  );
  const [joinOperator] = useQueryState(
    "joinOperator",
    parseAsStringEnum(["and", "or"] as const).withDefault("and"),
  );
  return {
    page,
    perPage,
    sort: sort.map((s) => ({ id: String(s.id), desc: s.desc })),
    filters: filters.map((f) => ({
      id: f.id,
      value: f.value,
      variant: f.variant,
      operator: f.operator,
      filterId: f.filterId,
    })),
    joinOperator,
  };
}
