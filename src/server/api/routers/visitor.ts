import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const visitorRoute = createTRPCRouter({
  set: publicProcedure
    .input(z.enum(["add", "sub"]))
    .mutation(async ({ input, ctx }) => {
      if (input === "add") {
        await ctx.cache.incr("visitor");
        await ctx.cache.incr("total-visitor");
        return;
      }

      const count = await ctx.cache.get("visitor");

      if (!count || Number(count) <= 0) return;

      return await ctx.cache.decr("visitor");
    }),
  get: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.cache.get("visitor");

    if (!count || Number(count) <= 0) return 0;

    return Number(count);
  }),
  getTotal: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.cache.get("total-visitor");

    if (!count || Number(count) <= 0) return 0;

    return Number(count);
  }),
});
