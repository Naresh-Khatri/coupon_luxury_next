"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { COUNTRY_COOKIE } from "@/lib/country";

export async function setCountryAction(country: string | null) {
  const c = await cookies();
  if (country) {
    c.set(COUNTRY_COOKIE, country, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  } else {
    c.delete(COUNTRY_COOKIE);
  }
  revalidatePath("/", "layout");
}
