import { z } from "zod";
import type { AnyColumn, SQL } from "drizzle-orm";
import {
  and,
  or,
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  ilike,
  not,
  isNull,
  isNotNull,
  inArray,
  notInArray,
  between,
  asc,
  desc,
  sql,
} from "drizzle-orm";

export const filterVariantEnum = z.enum([
  "text",
  "number",
  "range",
  "date",
  "dateRange",
  "boolean",
  "select",
  "multiSelect",
]);

export const filterOperatorEnum = z.enum([
  "iLike",
  "notILike",
  "eq",
  "ne",
  "inArray",
  "notInArray",
  "isEmpty",
  "isNotEmpty",
  "lt",
  "lte",
  "gt",
  "gte",
  "isBetween",
  "isRelativeToToday",
]);

export const tableFilterItem = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: filterVariantEnum,
  operator: filterOperatorEnum,
  filterId: z.string().optional(),
});

export const tableSortItem = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const tableListInput = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(200).default(10),
  sort: z.array(tableSortItem).default([]),
  filters: z.array(tableFilterItem).default([]),
  joinOperator: z.enum(["and", "or"]).default("and"),
  q: z.string().trim().max(200).default(""),
});

export type TableListInput = z.infer<typeof tableListInput>;

export type ColumnKind = "text" | "number" | "boolean" | "date";

export interface ColumnMapEntry {
  column: AnyColumn;
  kind: ColumnKind;
}
export type ColumnMap = Record<string, ColumnMapEntry>;

function toArray(v: string | string[]): string[] {
  return Array.isArray(v) ? v : [v];
}

function coerce(kind: ColumnKind, raw: string): unknown {
  if (raw === "" || raw == null) return null;
  switch (kind) {
    case "number":
      return Number(raw);
    case "boolean":
      return raw === "true";
    case "date": {
      // Accept epoch ms or ISO string
      const n = Number(raw);
      return Number.isFinite(n) && /^\d+$/.test(raw) ? new Date(n) : new Date(raw);
    }
    default:
      return raw;
  }
}

function filterToSql(
  entry: ColumnMapEntry,
  operator: z.infer<typeof filterOperatorEnum>,
  value: string | string[],
): SQL | undefined {
  const { column, kind } = entry;
  const arr = toArray(value);
  const first = arr[0];

  switch (operator) {
    case "iLike":
      if (!first) return undefined;
      return ilike(column, `%${first}%`);
    case "notILike":
      if (!first) return undefined;
      return not(ilike(column, `%${first}%`));
    case "eq": {
      if (first == null || first === "") return undefined;
      return eq(column, coerce(kind, first) as never);
    }
    case "ne": {
      if (first == null || first === "") return undefined;
      return ne(column, coerce(kind, first) as never);
    }
    case "lt":
      if (!first) return undefined;
      return lt(column, coerce(kind, first) as never);
    case "lte":
      if (!first) return undefined;
      return lte(column, coerce(kind, first) as never);
    case "gt":
      if (!first) return undefined;
      return gt(column, coerce(kind, first) as never);
    case "gte":
      if (!first) return undefined;
      return gte(column, coerce(kind, first) as never);
    case "inArray": {
      const vals = arr.map((v) => coerce(kind, v)).filter((v) => v != null);
      if (vals.length === 0) return undefined;
      return inArray(column, vals as never[]);
    }
    case "notInArray": {
      const vals = arr.map((v) => coerce(kind, v)).filter((v) => v != null);
      if (vals.length === 0) return undefined;
      return notInArray(column, vals as never[]);
    }
    case "isEmpty":
      return kind === "text" ? or(isNull(column), eq(column, "" as never)) : isNull(column);
    case "isNotEmpty":
      return kind === "text"
        ? and(isNotNull(column), ne(column, "" as never))
        : isNotNull(column);
    case "isBetween": {
      const [a, b] = arr;
      if (!a || !b) return undefined;
      return between(
        column,
        coerce(kind, a) as never,
        coerce(kind, b) as never,
      );
    }
    case "isRelativeToToday": {
      if (!first) return undefined;
      const days = Number(first);
      if (!Number.isFinite(days)) return undefined;
      const d = new Date();
      d.setDate(d.getDate() + days);
      return eq(column, d as never);
    }
    default:
      return undefined;
  }
}

export function buildWhere(
  input: TableListInput,
  map: ColumnMap,
  searchColumns: string[] = [],
): SQL | undefined {
  const parts: SQL[] = [];
  for (const f of input.filters) {
    const entry = map[f.id];
    if (!entry) continue;
    const sqlPart = filterToSql(entry, f.operator, f.value);
    if (sqlPart) parts.push(sqlPart);
  }
  const filterWhere =
    parts.length === 0
      ? undefined
      : input.joinOperator === "or"
        ? or(...parts)
        : and(...parts);
  const searchWhere = buildSearch(input.q, searchColumns, map);
  if (filterWhere && searchWhere) return and(filterWhere, searchWhere);
  return filterWhere ?? searchWhere;
}

function escapeLike(s: string) {
  return s.replace(/[\\%_]/g, (c) => `\\${c}`);
}

// Tokenize on whitespace. Each token must match at least one searchable
// column via ilike (AND across tokens, OR across columns) so multi-word
// queries narrow down instead of exploding.
export function buildSearch(
  q: string,
  searchColumns: string[],
  map: ColumnMap,
): SQL | undefined {
  if (!q || searchColumns.length === 0) return undefined;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return undefined;
  const cols = searchColumns
    .map((id) => map[id]?.column)
    .filter((c): c is AnyColumn => Boolean(c));
  if (cols.length === 0) return undefined;
  const tokenParts: SQL[] = [];
  for (const t of tokens) {
    const pattern = `%${escapeLike(t)}%`;
    const perCol = cols.map((c) => ilike(c, pattern));
    const combined = perCol.length === 1 ? perCol[0] : or(...perCol);
    if (combined) tokenParts.push(combined);
  }
  if (tokenParts.length === 0) return undefined;
  return tokenParts.length === 1 ? tokenParts[0] : and(...tokenParts);
}

export function buildOrderBy(input: TableListInput, map: ColumnMap) {
  const out: SQL[] = [];
  for (const s of input.sort) {
    const entry = map[s.id];
    if (!entry) continue;
    out.push(s.desc ? desc(entry.column) : asc(entry.column));
  }
  return out;
}

export const countSql = sql<number>`count(*)::int`;
