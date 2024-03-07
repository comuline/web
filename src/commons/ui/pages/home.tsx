"use client";

import { api } from "@/trpc/react";
import * as Command from "@/commons/ui/components/command";
import * as Popover from "@/commons/ui/components/popover";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/commons/utils/cn";

const StationItem = ({ item }: { item: string }) => (
  <p>
    {item.split("-")[0]} dan {item.split("-")[1]}
  </p>
);

const MainPage = () => {
  const station = api.station.getAll.useQuery();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Array<string>>([]);

  return (
    <main className="flex h-screen w-screen bg-black text-white">
      <section className="mx-auto flex w-full max-w-[500px] flex-col gap-5">
        <nav className="h-[30px] px-[12px] py-[18px]">
          <h1 className="font-mono tracking-tight opacity-30">
            jadwal-krl.com
          </h1>
        </nav>

        <section className="flex flex-col gap-2 px-[12px]">
          <Popover.Root open={open} onOpenChange={setOpen}>
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
          </Popover.Root>

          {selected.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Stasiun Tersimpan</h2>
              <div className="flex flex-col gap-2">
                {selected.map((s) => (
                  <StationItem key={s} item={s} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
};

export default MainPage;
