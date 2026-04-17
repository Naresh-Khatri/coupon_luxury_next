import { cookies } from "next/headers";

export const COUNTRY_COOKIE = "country";

export async function getSelectedCountry(): Promise<string | null> {
  const c = await cookies();
  const v = c.get(COUNTRY_COOKIE)?.value;
  return v && v.trim() ? v : null;
}
