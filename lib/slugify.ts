export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\$/g, " dollar ")
    .replace(/€/g, " euro ")
    .replace(/£/g, " pound ")
    .replace(/₹/g, " rupee ")
    .replace(/%/g, " percent ")
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .replace(/@/g, " at ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function isSlug(value: string): boolean {
  return value.length > 0 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
