"use client";

import * as Dropdown from "@/commons/ui/components/dropdown";
import { cn } from "@/commons/utils/cn";
import { api } from "@/trpc/react";
import {
  ArrowDownAZ,
  ArrowUpDown,
  ArrowUpZA,
  Minus,
  Moon,
  Plus,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Footer from "../sections/footer";
import StationItem from "../sections/station-item";

const MainPage = () => {
  const station = api.station.getAll.useQuery(undefined, {
    initialData:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("jadwal-krl-station") ?? "[]")
        : [],
  });
  const [isAdding, setAdding] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [selected, setSelected] = useState<
    Array<{
      id: string;
      name: string;
      savedAt: string;
    }>
  >([]);
  const [isLoaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{
    by: "name" | "date";
    order: "asc" | "desc";
  } | null>(null);
  const addStationInputRef = useRef<HTMLInputElement>(null);
  const addStationButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchStationInputRef = useRef<HTMLInputElement>(null);
  const searchStationButtonRef = useRef<HTMLButtonElement>(null);

  const { setTheme, theme } = useTheme();

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
      setLoaded(true);
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
    setLoaded(true);
    return;
  }, []);

  useEffect(() => {
    if (station.data.length === 0) return;
    const local = localStorage.getItem("jadwal-krl-station");
    if (JSON.stringify(local) !== JSON.stringify(station.data)) {
      localStorage.setItem("jadwal-krl-station", JSON.stringify(station.data));
    }
  }, [station.data]);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <section className="relative mx-auto flex w-full max-w-[500px] flex-col">
        <nav className="sticky top-0 z-10 flex h-fit flex-col gap-2 bg-background pl-[8px] pr-[12px] pt-[20px]">
          <div
            className={cn("flex w-full items-center justify-between", {
              "pb-[10px]": !isAdding || !isSearching,
            })}
          >
            <div className="flex items-center gap-1 opacity-30 transition-opacity hover:opacity-100">
              <svg
                width="25"
                height="25"
                viewBox="0 0 250 250"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M91.7793 124.5L122.366 62H200M91.7793 124.5L75.4906 157.784H50M91.7793 124.5L122.366 187H200M91.7793 124.5L75.4906 91.2157H50"
                  stroke="currentColor"
                  strokeWidth="20"
                />
              </svg>
              <h1 className="font-mono text-lg tracking-tight">Comuline</h1>
            </div>

            <div className="flex items-center gap-5">
              {isLoaded ? (
                isAdding ? null : (
                  <Dropdown.Root>
                    <Dropdown.Trigger asChild>
                      <button
                        type="button"
                        aria-label="Ganti tema"
                        className={cn("transition-all duration-200", {
                          "visible text-foreground/50 hover:text-foreground":
                            !isAdding,
                          "invisible opacity-0": isAdding,
                        })}
                      >
                        {theme === "light" ? (
                          <Moon size={20} />
                        ) : (
                          <Sun size={20} />
                        )}
                      </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content side="bottom" align="end" sideOffset={10}>
                      <Dropdown.CheckboxItem
                        className="flex items-center justify-between"
                        onClick={() => setTheme("light")}
                        checked={theme === "light"}
                      >
                        Light
                      </Dropdown.CheckboxItem>
                      <Dropdown.CheckboxItem
                        className="flex items-center justify-between"
                        onClick={() => setTheme("dark")}
                        checked={theme === "dark"}
                      >
                        Dark
                      </Dropdown.CheckboxItem>
                      <Dropdown.CheckboxItem
                        className="flex items-center justify-between"
                        onClick={() => setTheme("black")}
                        checked={theme === "black"}
                      >
                        Black
                      </Dropdown.CheckboxItem>
                    </Dropdown.Content>
                  </Dropdown.Root>
                )
              ) : null}

              <button
                ref={searchStationButtonRef}
                type="button"
                aria-label={
                  isSearching
                    ? "Tutup input pencarian stasiun keberangkatan"
                    : "Buka input pencarian stasiun keberangkatan"
                }
                aria-expanded={isSearching}
                aria-controls="search-station-input"
                hidden={isAdding}
                onClick={() => {
                  flushSync(() => {
                    setSearching((prev) => !prev);
                    setAdding(false);
                    setSearch("");
                  });

                  if (!isSearching) {
                    searchStationInputRef.current?.focus();
                  }
                }}
                className={cn("transition-all duration-200", {
                  "visible text-foreground/50 hover:text-foreground": !isAdding,
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

              {sort ? (
                <Dropdown.Root>
                  <Dropdown.Trigger asChild>
                    <button
                      type="button"
                      aria-label="Urutkan stasiun keberangkatan"
                      className={cn("transition-all duration-200", {
                        "visible text-foreground/50 hover:text-foreground":
                          !isAdding,
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
                aria-label={
                  isAdding
                    ? "Tutup input penambah stasiun keberangkatan"
                    : "Buka input penambah stasiun keberangkatan"
                }
                aria-controls="add-station-input"
                onClick={(e) => {
                  flushSync(() => {
                    addStationButtonRef.current = e.currentTarget;

                    setAdding((prev) => !prev);
                    setSearching(false);
                    setSearch("");
                  });

                  if (!isAdding) {
                    addStationInputRef.current?.focus();
                  }
                }}
                className={cn("transition-all", {
                  "text-foreground/50 hover:text-foreground [&>svg]:rotate-45":
                    isAdding,
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
          <div hidden={!isAdding} className="relative">
            <input
              ref={addStationInputRef}
              type="text"
              id="add-station-input"
              aria-label="Cari stasiun keberangkatan untuk ditambahkan ke halaman depan"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  flushSync(() => {
                    setAdding(false);
                    setSearching(false);
                    setSearch("");
                  });

                  addStationButtonRef.current?.focus();
                }
              }}
              className="mb-3 w-full rounded-md border-[1px] border-foreground/20 bg-transparent p-2 text-foreground"
            />
            <span
              aria-hidden
              hidden={search !== ""}
              className="pointer-events-none absolute left-0 p-2 leading-relaxed text-foreground/30"
            >
              Cari stasiun keberangkatan
            </span>
          </div>
          <div hidden={!isSearching} className="relative">
            <input
              ref={searchStationInputRef}
              type="text"
              id="search-station-input"
              aria-label="Cari stasiun keberangkatan"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  flushSync(() => {
                    setSearching(false);
                    setSearch("");
                  });
                  searchStationButtonRef.current?.focus();
                }
              }}
              className="mb-3 w-full rounded-md border-[1px] border-foreground/20 bg-transparent p-2 text-foreground"
            />
            <span
              aria-hidden
              hidden={search !== ""}
              className="pointer-events-none absolute left-0 p-2 leading-relaxed text-foreground/30"
            >
              Cari stasiun keberangkatan
            </span>
          </div>
        </nav>

        <section
          hidden={!isAdding}
          className={cn(
            "flex-col gap-1.5 px-[4px] pt-[10px]",
            isAdding && "flex",
          )}
        >
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
                    className="group flex items-center rounded-md px-[8px] py-[4px] text-left capitalize transition-all hover:bg-foreground/10"
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
                                s.name.toLocaleLowerCase() && item.id !== s.id,
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
          {isAdding && (
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
                      className="flex items-center rounded-md px-[8px] py-[4px] text-left capitalize transition-all hover:bg-foreground/10"
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
          )}
        </section>

        <section
          hidden={isAdding}
          className={cn("flex-col gap-1.5 px-[12px]", !isAdding && "flex")}
        >
          {!isLoaded || selected.length === 0 ? (
            <div className="mt-5 flex flex-col gap-5">
              <div className="flex w-full flex-col gap-2 pr-1 pt-2 text-left">
                <div className="h-[13px] w-[80px] rounded-md bg-foreground/10" />
                <div className="h-[30px] w-[120px] rounded-md bg-foreground/10" />
              </div>
              <div className="flex w-full flex-col gap-2 pr-1 pt-2 text-left">
                <div className="h-[13px] w-[80px] rounded-md bg-foreground/10" />
                <div className="h-[30px] w-[120px] rounded-md bg-foreground/10" />
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
            aria-expanded={isAdding}
            aria-controls="add-station-input"
            onClick={(e) => {
              flushSync(() => {
                addStationButtonRef.current = e.currentTarget;
                setAdding(true);
              });

              addStationInputRef.current?.focus();
            }}
            className="my-2 flex items-center justify-center gap-2 rounded-md border-[1px] border-foreground/10 bg-foreground/5 py-2.5 text-center text-sm text-foreground/80 transition hover:border-foreground/20  hover:text-foreground"
          >
            <Plus size={16} className="opacity-50" />
            <span>Tambah stasiun lain</span>
          </button>
        </section>

        <Footer />
      </section>
    </main>
  );
};

export default MainPage;
