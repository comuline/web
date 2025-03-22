import { Loading01 } from "@untitled-ui/icons-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Accordion } from ".//ui";
import { useSchedule } from "../hooks/use-schedule";
import { useStation } from "../hooks/use-station";
import { components } from "../schema";
import { cn, formatDateToTime, formatRelativeToNow } from "../utils";
import { Language } from "../libs/i18n/types";

export type GroupedSchedule = Record<
  string,
  Record<string, Array<components["schemas"]["Schedule"]>>
>;

const ScheduleLine = ({
  lineKey,
  destKey,
  groupedSchedule,
}: {
  lineKey: string;
  destKey: string;
  groupedSchedule: GroupedSchedule;
}) => {
  const hook = useStation(destKey);
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const station = hook.data?.data;

  return (
    <div key={destKey} className="flex flex-col gap-1 pb-1 pt-0.5">
      <p className="font-mono text-xs" style={{ color: lineKey.split("-")[1] }}>
        {t(groupedSchedule[lineKey]?.[destKey]?.[0]?.line)}
      </p>
      <div className="flex items-center justify-between gap-2 text-xs opacity-50">
        <p>{t("Arah menuju")}</p>
        <p>{t("Berangkat pukul")}</p>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center">
          {station ? (
            <div className="flex flex-col gap-1 text-left">
              <h3 className="font text-xl font-medium capitalize">
                {station.name.toLocaleLowerCase()}{" "}
              </h3>
              <p className="font-mono text-xs opacity-30">
                {groupedSchedule[lineKey]?.[destKey]?.[0]?.train_id}
              </p>
            </div>
          ) : (
            <div className="h-5 w-20 rounded-md bg-zinc-500/10" />
          )}
        </div>
        {groupedSchedule[lineKey]?.[destKey]?.[0]?.departs_at ? (
          <div className="flex flex-col gap-1 text-right">
            <p className="font-mono text-lg font-medium tracking-tight">
              {formatDateToTime(
                groupedSchedule[lineKey]?.[destKey]?.[0]?.departs_at,
                language as Language,
              )}
            </p>

            <p className="text-xs opacity-30">
              {formatRelativeToNow(
                groupedSchedule[lineKey]?.[destKey]?.[0]?.departs_at,
              )}
            </p>
          </div>
        ) : null}
      </div>
      {(() => {
        const moreSchedules = (groupedSchedule[lineKey]?.[destKey] ?? []).slice(
          1,
          5,
        );

        return moreSchedules.length > 0 ? (
          moreSchedules.length < 4 ? (
            <div className="flex w-full flex-col gap-2.5 text-left">
              <p className="text-xs opacity-50">{t("Jam berikutnya")}</p>

              <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-1">
                {moreSchedules.map((train) => (
                  <div key={train.id} className="flex flex-col gap-0.5">
                    <p className="font-mono text-sm font-semibold">
                      {formatDateToTime(train.departs_at, language as Language)}
                    </p>
                    <p className="text-xs opacity-30">
                      {formatRelativeToNow(train.departs_at)}
                    </p>
                  </div>
                ))}
              </div>
              <span className="size-4 h-0" />
            </div>
          ) : (
            <Accordion.Root
              type="multiple"
              className="w-full pr-1 pt-2"
              defaultValue={[]}
            >
              <Accordion.Item value={`${lineKey}-${destKey}`}>
                <Accordion.Trigger className="pb-1.5 md:pb-2">
                  <div className="flex w-full flex-col gap-2.5 text-left">
                    <p className="text-xs opacity-50">{t("Jam berikutnya")}</p>

                    <div className="grid w-full grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-1">
                      {moreSchedules.map((train) => (
                        <div key={train.id} className="flex flex-col gap-0.5">
                          <p className="font-mono text-sm font-semibold">
                            {formatDateToTime(
                              train.departs_at,
                              language as Language,
                            )}
                          </p>
                          <p className="text-xs opacity-30">
                            {formatRelativeToNow(train.departs_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Accordion.Trigger>
                <Accordion.Content className="flex gap-1 text-left">
                  <div className="grid w-full grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-2">
                    {(groupedSchedule[lineKey]?.[destKey] ?? [])
                      .slice(5)
                      .map((train) => (
                        <div key={train.id} className="flex flex-col gap-0.5">
                          <p className="font-mono text-sm font-semibold">
                            {formatDateToTime(
                              train.departs_at,
                              language as Language,
                            )}
                          </p>
                          <p className="text-xs opacity-30">
                            {formatRelativeToNow(train.departs_at)}
                          </p>
                        </div>
                      ))}
                  </div>
                  <span className="size-4 h-0" />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          )
        ) : null;
      })()}
    </div>
  );
};

export const StationItem = ({ stationId }: { stationId: string }) => {
  const { data: schedules, isLoading, isValidating } = useSchedule(stationId);
  const { t } = useTranslation();

  const groupedSchedule = React.useMemo(() => {
    const data = schedules?.data;
    return data
      ?.filter((x) => {
        const date = new Date(x.departs_at);
        const now = new Date();
        return (
          date.getHours() + date.getMinutes() / 60 >=
          now.getHours() + now.getMinutes() / 60
        );
      })
      .reduce((acc: GroupedSchedule, obj) => {
        const lineKey = `${obj.line}-${obj.metadata.origin?.color}`;
        const destKey = obj.station_destination_id;

        const lineKeyRecord = acc[lineKey] ?? {};
        const destKeyArray = lineKeyRecord[destKey] ?? [];

        destKeyArray.push({ ...obj });

        lineKeyRecord[destKey] = destKeyArray;
        acc[lineKey] = lineKeyRecord;
        return acc;
      }, {});
  }, [schedules, isValidating]);

  const { data: station } = useStation(stationId);

  const isEmpty = Object.keys(groupedSchedule ?? {}).length === 0;

  return (
    <Accordion.Root
      type="multiple"
      className="w-full pr-1 pt-2"
      defaultValue={[stationId]}
    >
      <Accordion.Item value={stationId}>
        <Accordion.Trigger className="items-center hover:no-underline">
          <div className="flex w-full flex-col gap-1 text-left">
            <p className="text-xs opacity-50">{t("Stasiun")}</p>
            <div className="flex items-center gap-3">
              {station ? (
                <h1 className="text-2xl font-semibold capitalize">
                  {station?.data.name.toLocaleLowerCase()}
                </h1>
              ) : (
                <div className="h-6 w-20 rounded-md bg-zinc-500/10" />
              )}
              {isLoading || isValidating ? (
                <Loading01 className="size-4 animate-spin opacity-50" />
              ) : null}
            </div>
          </div>
        </Accordion.Trigger>

        <Accordion.Content>
          {!schedules || isLoading ? (
            <div className="flex animate-pulse flex-col gap-2">
              <div className="flex h-full w-full gap-3">
                <div
                  className={cn("h-[50px] w-[5px] rounded-full bg-zinc-500/10")}
                />
                <div className={cn("flex w-full flex-col gap-2")}>
                  <div className="flex flex-col gap-1 pb-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="h-[13px] w-[80px] rounded-md bg-zinc-500/10" />
                      <div className="h-[13px] w-[50px] rounded-md bg-zinc-500/10" />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="mt-1 h-[25px] w-[80px] rounded-md bg-zinc-500/10" />

                      <div className="mt-1 h-[25px] w-[70px] rounded-md bg-zinc-500/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : isEmpty ? (
            <p className="text-sm opacity-50">
              {t("Jadwal kereta api tidak tersedia. Cek lagi pada esok hari")}.
            </p>
          ) : groupedSchedule ? (
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
                        <ScheduleLine
                          key={destKey}
                          lineKey={lineKey}
                          destKey={destKey}
                          groupedSchedule={groupedSchedule}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : null}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};
