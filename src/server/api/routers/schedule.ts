import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";

export const scheduleRouter = createTRPCRouter({
  getByStationId: publicProcedure
    .input(z.string().nullable())
    .query(async ({ input }) => {
      if (!input || input === null) {
        throw new Error("Stasiun tidak ditemukan");
      }

      const req = await fetch(
        `${env.API_URL}/schedule/${input.toLocaleUpperCase()}?from_now=true`,
      );

      const data = (await req.json()) as {
        status: number;
        data: {
          id: string;
          stationId: string;
          trainId: string;
          line: string;
          route: string;
          color: string;
          destination: string;
          timeEstimated: string;
          destinationTime: string;
          updatedAt: string;
        }[];
      };

      return data.data;
    }),
});
