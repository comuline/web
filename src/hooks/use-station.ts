import { client } from "@/libs/client";
import { createQueryHook } from "swr-openapi";

/**
 * Hook to fetch station data based on station_id
 * @param id Station ID
 * @example
 * const { data } = useStation("YK");
 * @returns
 */
export const useStation = (id: string) =>
  createQueryHook(client, `station-${id}`)("/v1/station/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
