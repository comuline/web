import { createTRPCRouter } from "@/server/api/trpc";
import { stationRouter } from "./routers/station";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  station: stationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
