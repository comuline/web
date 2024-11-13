import { createTRPCRouter } from "@/server/api/trpc";
import { stationRouter } from "./routers/station";
import { scheduleRouter } from "./routers/schedule";
import { visitorRoute } from "./routers/visitor";
import { routeRouter } from "@/server/api/routers/route";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  station: stationRouter,
  schedule: scheduleRouter,
  visitor: visitorRoute,
  route: routeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
