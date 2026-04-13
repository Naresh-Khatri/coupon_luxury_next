import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  searchStoresByName,
  getPublicStores,
} from "@/server/db/queries/stores";
import { searchOffersByTitle } from "@/server/db/queries/offers";
import { addSubscriber } from "@/server/db/queries/misc";
import { revalidate, CACHE_TAGS } from "@/server/db/cache";

export const publicRouter = router({
  searchStores: publicProcedure
    .input(z.object({ q: z.string().min(1) }))
    .query(({ input }) => searchStoresByName(input.q)),

  searchOffers: publicProcedure
    .input(z.object({ q: z.string().min(1) }))
    .query(({ input }) => searchOffersByTitle(input.q)),

  stores: publicProcedure
    .input(
      z
        .object({
          featured: z.boolean().optional(),
          limit: z.number().optional(),
        })
        .optional()
    )
    .query(({ input }) => getPublicStores(input ?? {})),

  subscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      try {
        const row = await addSubscriber(input.email);
        revalidate(CACHE_TAGS.subscribers);
        return { ok: true, id: row.id };
      } catch (err) {
        if ((err as Error).message === "already-subscribed") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You are already subscribed",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
