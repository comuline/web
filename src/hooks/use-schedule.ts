import { client } from "@/libs/client";
import { createQueryHook } from "swr-openapi";

/**
 * Hook to fetch schedule data based on station_id
 * @param station_id
 * @example
 * const { data } = useSchedule("YK");
 * @returns
 */
export const useSchedule = (station_id: string) =>
  createQueryHook(client, `schedule-${station_id}`)(
    "/v1/schedule/{station_id}",
    {
      params: {
        path: {
          station_id,
        },
      },
    },
    {
      keepPreviousData: true,
    },
  );
