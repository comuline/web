import { createTRPCRouter, publicProcedure } from "../trpc";

export const stationRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const req = await fetch("https://api.jadwal-krl.com/v1/station/");

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
