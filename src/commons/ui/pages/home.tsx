"use client";

import * as Accordion from "@/commons/ui/components/accordion";
import { cn } from "@/commons/utils/cn";
import { getRelativeTimeString, removeSeconds } from "@/commons/utils/date";
import { api } from "@/trpc/react";
import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";

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

  if (!data) return null;

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
      className="w-full pr-1 pt-2"
      defaultValue={[station.id]}
      onValueChange={(v) => setOpen(v.length > 0)}
    >
      <Accordion.Item value={station.id}>
        <Accordion.Trigger className="items-center hover:no-underline">
          <div className="flex w-full flex-col gap-2 text-left">
            <p className="text-xs opacity-50">Stasiun</p>
            <h1 className="text-2xl font-semibold capitalize">
              {station.name.toLocaleLowerCase()}
            </h1>
          </div>
        </Accordion.Trigger>

        <Accordion.Content>
          {isLoading ? (
            <div className="flex animate-pulse flex-col gap-2">
              <div className="flex h-full w-full gap-3">
                <div
                  className={cn("h-[50px] w-[5px] rounded-full bg-white/10")}
                />
                <div className={cn("flex w-full flex-col gap-2")}>
                  <div className="flex flex-col gap-1 pb-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="h-[13px] w-[80px] rounded-md bg-white/10" />
                      <div className="h-[13px] w-[50px] rounded-md bg-white/10" />
                    </div>
                    <div className="flex items-start justify-between gap-2 ">
                      <div className="mt-1 h-[25px] w-[80px] rounded-md bg-white/10" />

                      <div className="mt-1 h-[25px] w-[70px] rounded-md bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            Object.keys(groupedData).map((lineKey, id, arr) => (
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
                            <p className="text-xs opacity-50">Jam berikutnya</p>
                            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-1">
                              {(groupedData[lineKey]?.[destKey] ?? [])
                                .slice(1, 5)
                                .map((train) => (
                                  <div
                                    key={train.id}
                                    className="flex flex-col gap-0.5"
                                  >
                                    <p className="font-mono text-sm font-semibold">
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
                        ) : id === arr.length - 1 && arr.length > 0 ? null : (
                          <span className="h-[1px] w-full border-b pb-2 pt-1" />
                        )}
                      </div>
                    ))}
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

const MainPage = () => {
  const station = api.station.getAll.useQuery();
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Array<string>>([]);
  const [isLoaded, setLoaded] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (selected.length === 0) {
      setSelected(["boo-bogor", "bks-bekasi"]);
    }
    localStorage.setItem("jadwal-krl-selected", JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    const saved = localStorage.getItem("jadwal-krl-selected");
    if (saved) {
      setSelected(JSON.parse(saved));
      setLoaded(false);
      return;
    }
    setSelected(["boo-bogor", "bks-bekasi"]);
    setLoaded(false);
    return;
  }, []);

  return (
    <main className="flex min-h-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-[500px] flex-col gap-2">
        <nav className="flex h-fit w-full items-center justify-between px-[12px] pt-[20px]">
          <h1 className="font-mono text-lg tracking-tight opacity-30">
            jadwal-krl.com
          </h1>
          <button
            type="button"
            onClick={() => {
              setOpen((prev) => !prev);
            }}
            className={cn("rotate-0 pr-0.5 transition-all", {
              "text-white/50 hover:text-white [&>svg]:rotate-45": isOpen,
              "[&>svg]:rotate-0": !isOpen,
            })}
          >
            <Plus
              size={20}
              className="shrink-0 transition-transform duration-200"
            />
          </button>
        </nav>

        {isOpen ? (
          <section className="flex flex-col gap-1.5 px-[4px] pb-20">
            <div className="my-2 px-[8px]">
              <input
                type="text"
                onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="Cari stasiun keberangkatan"
                className="w-full rounded-md border-[1px] border-white/20 bg-transparent p-2 text-white placeholder:text-white/30"
              />
            </div>
            {selected.length > 0 ? (
              <div className="mt-2 flex flex-col gap-1">
                <h1 className="px-[8px] text-sm opacity-50">Tersimpan</h1>
                {station.data
                  ?.filter((s) => {
                    if (search.length > 0) {
                      return (
                        selected.includes(
                          `${s.id}-${s.name}`.toLocaleLowerCase(),
                        ) &&
                        s.name
                          .toLocaleLowerCase()
                          .includes(search.toLocaleLowerCase())
                      );
                    }
                    return selected.includes(
                      `${s.id}-${s.name}`.toLocaleLowerCase(),
                    );
                  })
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      className="flex items-center rounded-md px-[8px] py-[4px] text-left capitalize transition-all hover:bg-white/10"
                      disabled={selected.length === 1}
                      onClick={() => {
                        const currentValue =
                          `${s.id}-${s.name}`.toLocaleLowerCase();
                        if (selected.includes(currentValue)) {
                          setSelected((prev) =>
                            prev.filter((item) => item !== currentValue),
                          );
                        } else {
                          setSelected((prev) => [...prev, currentValue]);
                        }
                      }}
                    >
                      {s.name.toLocaleLowerCase()}
                      {selected.includes(
                        `${s.id}-${s.name}`.toLocaleLowerCase(),
                      ) ? (
                        selected.length === 1 ? null : (
                          <Check size={16} className={cn("ml-auto")} />
                        )
                      ) : null}
                    </button>
                  ))}
              </div>
            ) : null}
            <span className="h-[1px] w-full border-b px-[8px] py-2" />
            <div className="mt-2 flex flex-col gap-1">
              <h1 className="px-[8px] text-sm opacity-50">Belum Tesimpan</h1>
              {station.data
                ?.filter((s) =>
                  selected.length > 0
                    ? !selected.includes(
                        `${s.id}-${s.name}`.toLocaleLowerCase(),
                      )
                    : true,
                )
                .filter((s) => {
                  if (search.length > 0) {
                    return s.name
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase());
                  }
                  return true;
                })
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className="flex items-center rounded-md px-[8px] py-[4px] text-left capitalize transition-all hover:bg-white/10"
                    onClick={() => {
                      const currentValue =
                        `${s.id}-${s.name}`.toLocaleLowerCase();
                      if (selected.includes(currentValue)) {
                        setSelected((prev) =>
                          prev.filter((item) => item !== currentValue),
                        );
                      } else {
                        setSelected((prev) => [...prev, currentValue]);
                      }
                    }}
                  >
                    {s.name.toLocaleLowerCase()}
                    {selected.includes(
                      `${s.id}-${s.name}`.toLocaleLowerCase(),
                    ) ? (
                      <Check size={16} className={cn("ml-auto")} />
                    ) : null}
                  </button>
                ))}
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-1.5 px-[12px] pb-20">
            {isLoaded ? (
              <div className="mt-5 flex flex-col gap-5">
                <div className="flex w-full flex-col gap-2 pr-1 pt-2 text-left">
                  <div className="h-[13px] w-[80px] rounded-md bg-white/10" />
                  <div className="h-[30px] w-[120px] rounded-md bg-white/10" />
                </div>
                <div className="flex w-full flex-col gap-2 pr-1 pt-2 text-left">
                  <div className="h-[13px] w-[80px] rounded-md bg-white/10" />
                  <div className="h-[30px] w-[120px] rounded-md bg-white/10" />
                </div>
              </div>
            ) : selected.length > 0 ? (
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
        )}
      </section>
    </main>
  );
};

export default MainPage;
