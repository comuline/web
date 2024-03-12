"use client";

import * as Accordion from "@/commons/ui/components/accordion";
import * as Dropdown from "@/commons/ui/components/dropdown";
import { cn } from "@/commons/utils/cn";
import { getRelativeTimeString, removeSeconds } from "@/commons/utils/date";
import { api } from "@/trpc/react";
import {
  ArrowDownAZ,
  ArrowUpDown,
  ArrowUpZA,
  Minus,
  Plus,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
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
  const [isAdding, setAdding] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [selected, setSelected] = useState<
    Array<{
      id: string;
      name: string;
      savedAt: string;
    }>
  >([]);
  const [isLoaded, setLoaded] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{
    by: "name" | "date";
    order: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    if (selected.length === 0) return;
    localStorage.setItem("jadwal-krl-saved", JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    if (!sort) return;
    localStorage.setItem("jadwal-krl-sort", JSON.stringify(sort));
  }, [sort]);

  useEffect(() => {
    const saved = {
      selected: localStorage.getItem("jadwal-krl-saved"),
      sort: localStorage.getItem("jadwal-krl-sort"),
    };
    if (saved.selected ?? saved.sort) {
      if (saved.sort) setSort(JSON.parse(saved.sort));
      if (saved.selected) setSelected(JSON.parse(saved.selected));
      setLoaded(false);
      return;
    }
    const now = new Date().toISOString();
    setSelected([
      {
        id: "bks",
        name: "Bekasi",
        savedAt: now,
      },
      {
        id: "boo",
        name: "Bogor",
        savedAt: now,
      },
    ]);
    setSort({ by: "date", order: "desc" });
    setLoaded(false);
    return;
  }, []);

  return (
    <main className="flex min-h-screen bg-black text-white">
      <section className="relative mx-auto flex w-full max-w-[500px] flex-col">
        <nav className="sticky top-0 z-10 flex h-fit flex-col gap-2 bg-black px-[12px] pt-[20px]">
          <div
            className={cn("flex w-full items-center justify-between", {
              "pb-[10px]": !isAdding || !isSearching,
            })}
          >
            <h1 className="font-mono text-lg tracking-tight opacity-30">
              jadwal-krl.com
            </h1>
            <div className="flex items-center gap-5">
              {isAdding ? null : (
                <button
                  type="button"
                  onClick={() => {
                    setSearching((prev) => !prev);
                    setAdding(false);
                    setSearch("");
                  }}
                  className={cn("transition-all duration-200", {
                    "visible text-white/50 hover:text-white": !isAdding,
                    "invisible opacity-0": isAdding,
                  })}
                >
                  {isSearching ? (
                    <X size={20} />
                  ) : (
                    <Search
                      size={20}
                      className="shrink-0 transition-transform duration-200"
                    />
                  )}
                </button>
              )}

              {sort ? (
                <Dropdown.Root>
                  <Dropdown.Trigger asChild>
                    <button
                      type="button"
                      className={cn("transition-all duration-200", {
                        "visible text-white/50 hover:text-white": !isAdding,
                        "invisible opacity-0": isAdding,
                      })}
                    >
                      <ArrowUpDown size={20} className="shrink-0 " />
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Content side="bottom" align="end" sideOffset={10}>
                    <Dropdown.Item
                      className="flex items-center gap-2"
                      onClick={() =>
                        setSort({
                          by: "name",
                          order: sort.order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      {sort.by === "name" ? (
                        sort.order === "desc" ? (
                          <ArrowDownAZ size={14} className="opacity-80" />
                        ) : (
                          <ArrowUpZA size={14} className="opacity-80" />
                        )
                      ) : (
                        <Minus size={14} className="opacity-80" />
                      )}
                      Urut nama
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="flex items-center gap-2"
                      onClick={() =>
                        setSort({
                          by: "date",
                          order: sort.order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      {sort.by === "date" ? (
                        sort.order === "desc" ? (
                          <ArrowDownAZ size={14} className="opacity-80" />
                        ) : (
                          <ArrowUpZA size={14} className="opacity-80" />
                        )
                      ) : (
                        <Minus size={14} className="opacity-80" />
                      )}
                      Urut tanggal ditambahkan
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown.Root>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setAdding((prev) => !prev);
                  setSearching(false);
                  setSearch("");
                }}
                className={cn("transition-all", {
                  "text-white/50 hover:text-white [&>svg]:rotate-45": isAdding,
                  "[&>svg]:rotate-0": !isAdding,
                })}
              >
                <Plus
                  size={20}
                  className="shrink-0 transition-transform duration-200"
                />
              </button>
            </div>
          </div>
          {isAdding ? (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="Cari stasiun keberangkatan"
              className="mb-3 w-full rounded-md border-[1px] border-white/20 bg-transparent p-2 text-white placeholder:text-white/30"
            />
          ) : isSearching ? (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="Cari stasiun keberangkatan"
              className="mb-3 w-full rounded-md border-[1px] border-white/20 bg-transparent p-2 text-white placeholder:text-white/30"
            />
          ) : null}
        </nav>

        {isAdding ? (
          <section className="flex flex-col gap-1.5 px-[4px] pt-[10px]">
            {selected.length > 0 ? (
              <div className="mt-2 flex flex-col gap-1">
                <h1 className="px-[8px] text-sm opacity-50">Tersimpan</h1>
                {station.data
                  ?.filter((s) => {
                    return selected
                      .map(({ name }) => name.toLocaleLowerCase())
                      .includes(s.name.toLocaleLowerCase());
                  })
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      className="group flex items-center rounded-md px-[8px] py-[4px] text-left capitalize transition-all hover:bg-white/10"
                      disabled={selected.length === 1}
                      onClick={() => {
                        if (
                          selected
                            .map(({ name }) => name.toLocaleLowerCase())
                            .includes(s.name.toLocaleLowerCase())
                        ) {
                          setSelected((prev) =>
                            prev.filter(
                              (item) =>
                                item.name.toLocaleLowerCase() !==
                                  s.name.toLocaleLowerCase() &&
                                item.id !== s.id,
                            ),
                          );
                        } else {
                          setSelected((prev) => [
                            ...prev,
                            {
                              id: s.id,
                              name: s.name,
                              savedAt: new Date().toISOString(),
                            },
                          ]);
                        }
                      }}
                    >
                      {s.name.toLocaleLowerCase()}
                      {selected
                        .map(({ name }) => name.toLocaleLowerCase())
                        .includes(s.name.toLocaleLowerCase()) ? (
                        selected.length === 1 ? null : (
                          <X
                            size={16}
                            className={cn(
                              "ml-auto opacity-50 transition group-hover:opacity-100",
                            )}
                          />
                        )
                      ) : null}
                    </button>
                  ))}
              </div>
            ) : null}
            <span className="h-[1px] w-full border-b px-[8px] py-2" />
            <div className="mt-2 flex flex-col gap-1">
              <h1 className="px-[8px] text-sm opacity-50">Belum Tersimpan</h1>
              {(station.data ?? [])
                ?.filter((s) =>
                  selected.length > 0
                    ? !selected
                        .map(({ name }) => name.toLocaleLowerCase())
                        .includes(s.name.toLocaleLowerCase())
                    : true,
                )
                .filter((s) => {
                  if (search.length > 0) {
                    return s.name
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase());
                  }
                  return true;
                }).length > 0 ? (
                station.data
                  ?.filter((s) =>
                    selected.length > 0
                      ? !selected
                          .map(({ name }) => name.toLocaleLowerCase())
                          .includes(s.name.toLocaleLowerCase())
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
                        if (
                          selected
                            .map(({ name }) => name.toLocaleLowerCase())
                            .includes(s.name.toLocaleLowerCase())
                        ) {
                          setSelected((prev) =>
                            prev.filter(
                              (item) =>
                                item.name.toLocaleLowerCase() !==
                                  s.name.toLocaleLowerCase() &&
                                item.id !== s.id,
                            ),
                          );
                        } else {
                          setSelected((prev) => [
                            ...prev,
                            {
                              id: s.id,
                              name: s.name,
                              savedAt: new Date().toISOString(),
                            },
                          ]);
                        }
                      }}
                    >
                      {s.name.toLocaleLowerCase()}
                    </button>
                  ))
              ) : (
                <p className="px-[8px] py-1 text-sm opacity-50">
                  Tidak tersedia
                </p>
              )}
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-1.5 px-[12px]">
            {isLoaded || selected.length === 0 ? (
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
                {selected
                  .sort((a, b) => {
                    if (!sort) return 0;
                    const aName = a.name.toLocaleLowerCase();
                    const bName = b.name.toLocaleLowerCase();

                    switch (sort.by) {
                      case "name":
                        if (sort.order === "asc") {
                          return aName.localeCompare(bName);
                        }
                        return bName.localeCompare(aName);
                      case "date":
                        if (sort.order === "asc") {
                          return (
                            new Date(a.savedAt).getTime() -
                            new Date(b.savedAt).getTime()
                          );
                        }
                        return (
                          new Date(b.savedAt).getTime() -
                          new Date(a.savedAt).getTime()
                        );
                      default:
                        return 0;
                    }
                  })
                  .filter((s) => {
                    if (search.length > 0) {
                      return s.name
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase());
                    }
                    return true;
                  })
                  .map((s) => (
                    <StationItem
                      key={s.id}
                      station={{
                        id: s.id,
                        name: s.name,
                      }}
                    />
                  ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="my-2 flex rounded-md border-[1px] border-white/10 bg-white/5 py-2.5 text-center text-sm text-white/80 transition hover:border-white/20  hover:text-white"
            >
              <div className="mx-auto flex items-center gap-2">
                <Plus size={16} className="opacity-50" />
                <span>Tambah stasiun lain</span>
              </div>
            </button>
          </section>
        )}

        <div className="flex w-full flex-col gap-[10px] py-10 text-center text-sm">
          <p className="mx-auto w-2/3 opacity-50">
            Made as an act of belief that public transportation data should be
            publicly accessible
          </p>

          <div className="mx-auto flex  items-center gap-[10px]">
            <Link
              target="_blank"
              href="https://www.api.jadwal-krl.com/docs"
              className="underline opacity-50 transition hover:opacity-100"
            >
              API
            </Link>
            <p className="opacity-30">⋅</p>
            <Link
              target="_blank"
              href="https://github.com/abielzulio/jadwal-krl"
              className="underline opacity-50 transition hover:opacity-100"
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
