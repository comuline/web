"use client";

import type { GroupedSchedule } from "@/commons/type";
import * as Accordion from "@/commons/ui/components/accordion";
import { cn } from "@/commons/utils/cn";
import {
  formatTime,
  getRelativeTimeString,
  removeSeconds,
} from "@/commons/utils/date";
import { api } from "@/trpc/react";
import { Loader, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

const scheduleKey = (id: string) => `jadwal-krl-schedule-${id}`;

const StationItem = ({
  station,
}: {
  station: { id: string; name: string };
}) => {
  const {
    data,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
    isError,
    isFetched,
  } = api.schedule.getByStationId.useQuery(station.id, {
    initialData:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(scheduleKey(station.id)) ?? "[]")
        : undefined,
  });

  const groupedSchedule: GroupedSchedule = data?.reduce(
    (acc: GroupedSchedule, obj) => {
      const lineKey = `${obj.line}-${obj.color}`;
      const destKey = obj.destination;

      const lineKeyRecord = acc[lineKey] ?? {};
      const destKeyArray = lineKeyRecord[destKey] ?? [];

      destKeyArray.push({
        ...obj,
        timeEstimated: removeSeconds(obj.timeEstimated),
        destinationTime: removeSeconds(obj.destinationTime),
      });

      lineKeyRecord[destKey] = destKeyArray;
      acc[lineKey] = lineKeyRecord;
      return acc;
    },
    {},
  );

  useEffect(() => {
    if (isLoading) return;
    if (data.length === 0) return;
    const local = localStorage.getItem(scheduleKey(station.id));
    if (JSON.stringify(local) !== JSON.stringify(data)) {
      localStorage.setItem(scheduleKey(station.id), JSON.stringify(data));
    }
  }, [data, isLoading, station.id]);

  return (
    <Accordion.Root
      type="multiple"
      className="w-full pr-1 pt-2"
      defaultValue={[station.id]}
    >
      <Accordion.Item value={station.id}>
        <Accordion.Trigger className="items-center hover:no-underline">
          <div className="flex w-full flex-col gap-1 text-left">
            <p className="text-xs opacity-50">Stasiun</p>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold capitalize">
                {station.name.toLocaleLowerCase()}
              </h1>
              {isFetching || isRefetching ? (
                <Loader size={16} className="animate-spin opacity-50" />
              ) : isError && isFetched ? (
                <RefreshCcw
                  size={16}
                  onClick={() => refetch()}
                  className="opacity-50"
                />
              ) : null}
            </div>
          </div>
        </Accordion.Trigger>

        <Accordion.Content>
          {(data.length === 0 && (isFetching || isRefetching)) || isLoading ? (
            <div className="flex animate-pulse flex-col gap-2">
              <div className="flex h-full w-full gap-3">
                <div
                  className={cn(
                    "h-[50px] w-[5px] rounded-full bg-foreground/10",
                  )}
                />
                <div className={cn("flex w-full flex-col gap-2")}>
                  <div className="flex flex-col gap-1 pb-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="h-[13px] w-[80px] rounded-md bg-foreground/10" />
                      <div className="h-[13px] w-[50px] rounded-md bg-foreground/10" />
                    </div>
                    <div className="flex items-start justify-between gap-2 ">
                      <div className="mt-1 h-[25px] w-[80px] rounded-md bg-foreground/10" />

                      <div className="mt-1 h-[25px] w-[70px] rounded-md bg-foreground/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : isFetched && data.length === 0 ? (
            <p className="text-sm opacity-50">
              Jadwal kereta api tidak tersedia. Cek lagi pada esok hari.
            </p>
          ) : (
            Object.keys(groupedSchedule).map((lineKey, id, arr) => (
              <div key={lineKey} className="flex flex-col gap-2">
                <div className="flex h-full w-full gap-3">
                  <div
                    className={cn("h-100% w-[5px]", {
                      "rounded-full": arr.length === 1,
                      "rounded-b-none rounded-t-full":
                        id === 0 && arr.length > 1,

                      "rounded-b-full rounded-t-none":
                        id === arr.length - 1 && arr.length > 1,
                    })}
                    style={{ backgroundColor: lineKey.split("-")[1] }}
                  />
                  <div
                    className={cn("flex w-full flex-col gap-2", {
                      "py-0": arr.length === 1,
                      "pb-2 pt-0": id === 0 && arr.length > 1,

                      "pb-0 pt-2": id === arr.length - 1 && arr.length > 1,
                    })}
                  >
                    {Object.keys(groupedSchedule[lineKey] ?? {}).map(
                      (destKey) => (
                        <div
                          key={destKey}
                          className="flex flex-col gap-1 pb-1 pt-0.5"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs opacity-50">
                            <p>Arah menuju</p>
                            <p>Berangkat pukul</p>
                          </div>
                          <div className="flex items-start justify-between gap-2 ">
                            <h3 className="font text-xl font-medium capitalize">
                              {destKey.toLocaleLowerCase()}
                            </h3>
                            {groupedSchedule[lineKey]?.[destKey]?.[0]
                              ?.timeEstimated ? (
                              <div className="flex flex-col gap-1 text-right">
                                <p className="font-mono text-lg font-medium tracking-tight">
                                  {formatTime(
                                    groupedSchedule[lineKey]?.[destKey]?.[0]
                                      ?.timeEstimated,
                                  )}
                                </p>

                                <p className="text-xs opacity-30">
                                  {getRelativeTimeString(
                                    groupedSchedule[lineKey]?.[destKey]?.[0]
                                      ?.timeEstimated ?? "",
                                  )}
                                </p>
                              </div>
                            ) : null}
                          </div>
                          {(groupedSchedule[lineKey]?.[destKey] ?? []).slice(
                            1,
                            5,
                          ).length > 0 ? (
                            <div className="flex flex-col gap-2.5">
                              <p className="text-xs opacity-50">
                                Jam berikutnya
                              </p>
                              <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-1">
                                {(groupedSchedule[lineKey]?.[destKey] ?? [])
                                  .slice(1, 5)
                                  .map((train) => (
                                    <div
                                      key={train.id}
                                      className="flex flex-col gap-0.5"
                                    >
                                      <p className="font-mono text-sm font-semibold">
                                        {formatTime(train.timeEstimated)}
                                      </p>
                                      <p className="text-xs opacity-30">
                                        {getRelativeTimeString(
                                          train.timeEstimated,
                                        )}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : null}
                          {(groupedSchedule[lineKey]?.[destKey] ?? []).slice(
                            5,
                            (groupedSchedule[lineKey]?.[destKey] ?? []).length -
                              5,
                          ).length > 0 ? (
                            <Accordion.Root
                              type="multiple"
                              className="mt-0 w-full"
                            >
                              <Accordion.Item
                                value="jam-keberangkatan"
                                className={cn("pb-2", {
                                  "border-b-none":
                                    id === arr.length - 1 && arr.length > 1,
                                })}
                              >
                                <Accordion.Trigger className="my-0 h-[10px] text-xs font-normal opacity-30">
                                  Lihat semua
                                </Accordion.Trigger>
                                <Accordion.Content className="grid grid-cols-4 gap-2 pt-1 md:grid-cols-5">
                                  {(groupedSchedule[lineKey]?.[destKey] ?? [])
                                    .slice(
                                      5,
                                      (
                                        groupedSchedule[lineKey]?.[destKey] ??
                                        []
                                      ).length - 5,
                                    )
                                    .map((train) => (
                                      <div
                                        key={train.id}
                                        className="flex rounded-md bg-foreground/10 px-2 py-1.5 text-sm"
                                      >
                                        <span className="mx-auto text-center font-mono font-semibold text-foreground/80">
                                          {formatTime(train.timeEstimated)}
                                        </span>
                                      </div>
                                    ))}
                                </Accordion.Content>
                              </Accordion.Item>
                            </Accordion.Root>
                          ) : id === arr.length - 1 && arr.length > 0 ? null : (
                            <span className="h-[1px] w-full border-b pb-2 pt-1" />
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default StationItem;
