import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";
import { type Schedule } from "@/commons/type";

export const scheduleRouter = createTRPCRouter({
  getByStationId: publicProcedure
    .input(z.string().nullable())
    .query(async ({ input }) => {
      if (!input || input === null) {
        throw new Error("Stasiun tidak ditemukan");
      }

      try {
        const req = await fetch(
          `${env.API_URL}/schedule/${input.toLocaleUpperCase()}?is_from_now=true`,
        );

        const data = (await req.json()) as {
          status: number;
          data: Schedule[];
        };

        return data.data ?? [];
      } catch (e) {
        throw e;
      }
    }),
});
