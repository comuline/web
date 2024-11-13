import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";
import type { Station, Schedule } from "@/commons/type";

export const routeRouter = createTRPCRouter({
  getByTrainId: publicProcedure
    .input(z.string().nullable())
    .query(async ({ input }) => {
      if (!input || input === null) {
        throw new Error("Rute tidak ditemukan");
      }

      try {
        const req = await fetch(`${env.API_URL}/route/${input}`);

        const data = (await req.json()) as {
          status: number;
          data: (Schedule & { stationName: Station["name"] })[];
        };

        return data.data ?? [];
      } catch (e) {
        throw e;
      }
    }),
});
