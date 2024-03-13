import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { type Station } from "@/commons/type";

export const stationRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    try {
      const req = await fetch(`${env.API_URL}/station/`);

      const data = (await req.json()) as {
        status: string;
        data: Array<Station>;
      };

      return data.data;
    } catch (e) {
      throw e;
    }
  }),
});
