import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const visitorRoute = createTRPCRouter({
  set: publicProcedure
    .input(z.enum(["add", "sub"]))
    .mutation(async ({ input, ctx }) => {
      if (input === "add") return await ctx.cache.incr("visitor");

      const count = await ctx.cache.get("visitor");

      if (!count || Number(count) <= 0) return;

      return await ctx.cache.decr("visitor");
    }),
  get: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.cache.get("visitor");

    if (!count) {
      return 0;
    }

    return Number(count);
  }),
});
