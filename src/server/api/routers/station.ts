import pg from "@/libs/pg";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const stationRouter = createTRPCRouter({
  getAll: publicProcedure.mutation(async () => {
    return await pg<
      Array<{
        id: string;
        daop: string;
        name: string;
      }>
    >`SELECT id, daop, name FROM station`;
  }),
});
