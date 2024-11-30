import { client } from "@/libs/client";
import { createKey } from "@/utils";
import { createQueryHook } from "swr-openapi";

/**
 * Hook to fetch all stations
 * @example
 * const { data } = useStation();
 */
export const useStations = () =>
  createQueryHook(client, createKey(["stations"]))("/v1/station");
