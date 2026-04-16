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
    .input(
      z.object({
        q: z.string().min(1),
        country: z.string().nullish(),
      })
    )
    .query(({ input }) =>
      searchStoresByName(input.q, 20, input.country ?? null)
    ),

  searchOffers: publicProcedure
    .input(
      z.object({
        q: z.string().min(1),
        country: z.string().nullish(),
      })
    )
    .query(({ input }) =>
      searchOffersByTitle(input.q, 20, input.country ?? null)
    ),

  search: publicProcedure
    .input(
      z.object({
        q: z.string().min(1),
        country: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const country = input.country ?? null;
      const [stores, offers] = await Promise.all([
        searchStoresByName(input.q, 5, country),
        searchOffersByTitle(input.q, 8, country),
      ]);
      const coupons = offers.filter((o) => o.offerType === "coupon");
      const deals = offers.filter((o) => o.offerType === "deal");
      return { stores, coupons, deals };
    }),

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
