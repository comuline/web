"use client";

import * as Accordion from "@/commons/ui/components/accordion";
import { cn } from "@/commons/utils/cn";
import { getRelativeTimeString, removeSeconds } from "@/commons/utils/date";
import { api } from "@/trpc/react";
import { useState } from "react";

interface TrainData {
  id: string;
  stationId: string;
  trainId: string;
  line: string;
  route: string;
  color: string;
  destination: string;
  timeEstimated: string;
  destinationTime: string;
  updatedAt: string;
}

type GroupedData = Record<string, Record<string, TrainData[]>>;

const StationItem = ({
  station,
}: {
  station: { id: string; name: string };
}) => {
  const { data, isLoading } = api.schedule.getByStationId.useQuery(station.id);

  const [isOpen, setOpen] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedData: GroupedData = data?.reduce((acc: any, obj) => {
    const lineKey = `${obj.line}-${obj.color}`;
    const destKey = obj.destination;

    if (!acc[lineKey]) {
      acc[lineKey] = {};
    }

    if (!acc[lineKey][destKey]) {
      acc[lineKey][destKey] = [];
    }

    acc[lineKey][destKey].push({
      ...obj,
      timeEstimated: removeSeconds(obj.timeEstimated),
      destinationTime: removeSeconds(obj.destinationTime),
    });
    return acc;
  }, {});

  return (
    <Accordion.Root
      type="multiple"
      className="w-full pt-2"
      defaultValue={[station.id]}
      onValueChange={(v) => setOpen(v.length > 0)}
    >
      <Accordion.Item value={station.id}>
        <Accordion.Trigger
          className="items-center hover:no-underline"
          disabled={isLoading || !data}
        >
          <div className="flex w-full flex-col gap-2 text-left">
            <p className="text-xs opacity-50">Stasiun</p>
            <h1 className="text-2xl font-semibold capitalize">
              {station.name.toLocaleLowerCase()}
            </h1>
          </div>
        </Accordion.Trigger>
        {isLoading || !data ? null : (
          <Accordion.Content>
            {Object.keys(groupedData).map((lineKey, id, arr) => (
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
                    {Object.keys(groupedData[lineKey] ?? {}).map((destKey) => (
                      <div
                        key={destKey}
                        className="flex flex-col gap-1 pb-1 pt-0.5"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs opacity-50">
                          <p>Arah menuju</p>
                          <p>Tiba pukul</p>
                        </div>
                        <div className="flex items-start justify-between gap-2 ">
                          <h3 className="font text-xl font-medium capitalize">
                            {destKey.toLocaleLowerCase()}
                          </h3>
                          {groupedData[lineKey]?.[destKey]?.[0]
                            ?.timeEstimated ? (
                            <div className="flex flex-col gap-1 text-right">
                              <p className="font-mono text-lg font-medium tracking-tight">
                                {
                                  groupedData[lineKey]?.[destKey]?.[0]
                                    ?.timeEstimated
                                }
                              </p>
                              <p className="text-xs opacity-30">
                                {getRelativeTimeString(
                                  groupedData[lineKey]?.[destKey]?.[0]
                                    ?.timeEstimated ?? "",
                                )}
                              </p>
                            </div>
                          ) : null}
                        </div>
                        {(groupedData[lineKey]?.[destKey] ?? []).slice(1, 5)
                          .length > 0 ? (
                          <div className="flex flex-col gap-2.5">
                            <p className="text-xs opacity-30">Jam berikutnya</p>
                            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-1">
                              {(groupedData[lineKey]?.[destKey] ?? [])
                                .slice(1, 5)
                                .map((train) => (
                                  <div
                                    key={train.id}
                                    className="flex flex-col gap-0.5"
                                  >
                                    <p className="font-mono text-sm font-medium">
                                      {train.timeEstimated}
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
                        <div className="flex items-start justify-between gap-2 "></div>
                        {(groupedData[lineKey]?.[destKey] ?? []).slice(
                          5,
                          (groupedData[lineKey]?.[destKey] ?? []).length - 5,
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
                                {(groupedData[lineKey]?.[destKey] ?? [])
                                  .slice(
                                    5,
                                    (groupedData[lineKey]?.[destKey] ?? [])
                                      .length - 5,
                                  )
                                  .map((train) => (
                                    <div
                                      key={train.id}
                                      className="flex rounded-md bg-white/10 px-2 py-1.5 text-sm"
                                    >
                                      <span className="mx-auto text-center font-mono text-white/80">
                                        {train.timeEstimated}
                                      </span>
                                    </div>
                                  ))}
                              </Accordion.Content>
                            </Accordion.Item>
                          </Accordion.Root>
                        ) : id === arr.length - 1 && arr.length > 1 ? null : (
                          <span className="h-[1px] w-full border-b pb-2 pt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </Accordion.Content>
        )}
      </Accordion.Item>
    </Accordion.Root>
  );
};

const MainPage = () => {
  const station = api.station.getAll.useQuery();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Array<string>>([
    "mri-manggarai",
    "yk-yogya",
  ]);

  return (
    <main className="flex min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-[500px] flex-col gap-2">
        <nav className="h-[30px] px-[12px] py-[18px]">
          <h1 className="font-mono tracking-tight opacity-30">
            jadwal-krl.com
          </h1>
        </nav>

        <section className="flex flex-col gap-1.5 px-[12px] pb-20">
          {/*           <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
              <button
                type="button"
                aria-expanded={open}
                className="flex w-full items-center justify-between rounded-md border-[1px] border-white/20 p-2 text-white/50"
              >
                Cari stasiun
                <ChevronDown size={16} className="ml-2 shrink-0 opacity-50" />
              </button>
            </Popover.Trigger>
            <Popover.Content className="w-[80vw] p-0 sm:w-[500px]">
              <Command.Root className="overflow-y-scroll">
                <Command.Input placeholder="Cari stasiun.." className="h-9" />
                <Command.Empty>Stasiun tidak dapat ditemukan</Command.Empty>
                {selected.length > 0 ? (
                  <Command.Group heading="Tersimpan">
                    {station.data
                      ?.filter((s) =>
                        selected.includes(
                          `${s.id}-${s.name}`.toLocaleLowerCase(),
                        ),
                      )
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((s) => (
                        <Command.Item
                          key={s.id}
                          value={`${s.id}-${s.name}`}
                          onSelect={(currentValue) => {
                            if (selected.includes(currentValue)) {
                              setSelected((prev) =>
                                prev.filter((item) => item !== currentValue),
                              );
                            } else {
                              setSelected((prev) => [...prev, currentValue]);
                            }
                          }}
                          className="flex items-center"
                        >
                          {s.name}
                          {selected.includes(
                            `${s.id}-${s.name}`.toLocaleLowerCase(),
                          ) ? (
                            <Check size={16} className={cn("ml-auto")} />
                          ) : null}
                        </Command.Item>
                      ))}
                  </Command.Group>
                ) : null}
                <Command.Separator />
                <Command.Group heading="Belum Tersimpan">
                  {station.data
                    ?.filter((s) =>
                      selected.length > 0
                        ? !selected.includes(
                            `${s.id}-${s.name}`.toLocaleLowerCase(),
                          )
                        : true,
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((s) => (
                      <Command.Item
                        key={s.id}
                        value={`${s.id}-${s.name}`}
                        onSelect={(currentValue) => {
                          if (selected.includes(currentValue)) {
                            setSelected((prev) =>
                              prev.filter((item) => item !== currentValue),
                            );
                          } else {
                            setSelected((prev) => [...prev, currentValue]);
                          }
                        }}
                        className="flex items-center"
                      >
                        {s.name}
                        {selected.includes(
                          `${s.id}-${s.name}`.toLocaleLowerCase(),
                        ) ? (
                          <Check size={16} className={cn("ml-auto")} />
                        ) : null}
                      </Command.Item>
                    ))}
                </Command.Group>
              </Command.Root>
            </Popover.Content>
          </Popover.Root> */}

          {selected.length > 0 ? (
            <div className="flex flex-col gap-1">
              {selected.map((s) => (
                <StationItem
                  key={s}
                  station={{
                    id: s.split("-")[0]!,
                    name: s.split("-")[1]!,
                  }}
                />
              ))}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
};

export default MainPage;
