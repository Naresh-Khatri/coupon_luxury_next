import { auth } from "@/lib/auth";
import type { Context } from "./trpc";

export async function createContext(opts: { headers: Headers }): Promise<Context> {
  const session = await auth.api.getSession({ headers: opts.headers });
  return { session, headers: opts.headers };
}
