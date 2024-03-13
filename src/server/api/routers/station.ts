import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "../trpc";

export type Station = {
  id: string;
  daop: number;
  name: string;
  fgEnable: number;
  haveSchedule: boolean;
  updatedAt: string;
};

export const stationRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const req = await fetch(`${env.API_URL}/station/`);

    const data = (await req.json()) as {
      status: string;
      data: Array<{
        id: string;
        daop: number;
        name: string;
        fgEnable: number;
        haveSchedule: boolean;
        updatedAt: string;
      }>;
    };

    return data.data;
  }),
});
