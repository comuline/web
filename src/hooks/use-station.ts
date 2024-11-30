import { client } from "@/libs/client";
import { createKey } from "@/utils";
import { createQueryHook } from "swr-openapi";

/**
 * Hook to fetch station data based on station_id
 * @param id Station ID
 * @example
 * const { data } = useStation("YK");
 */
export const useStation = (id: string) =>
  createQueryHook(client, createKey(["station", id]))("/v1/station/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
