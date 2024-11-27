import { Plus, SearchMd, X } from "@untitled-ui/icons-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import React from "react";
import { StationItem } from "./components/station-item";
import { useMeasure } from "./hooks/use-measure";
import { cn } from "./utils";
import { useOnClickOutside } from "./hooks/use-click-outside";

const STATION_IDs = ["MRI", "AC"];

export function App() {
  const [state, setState] = React.useState<"VIEW" | "SEARCH" | "ADD">("VIEW");
  const [ref, height] = useMeasure<HTMLDivElement>();

  useOnClickOutside(ref, () => setState("VIEW"));

  return (
    <div className="min-w-screen flex min-h-screen flex-col">
      <section className="relative mx-auto flex w-full max-w-[550px] flex-col">
        <nav className="sticky top-0 z-10 flex h-fit flex-col gap-2 bg-white p-5">
          <AnimatePresence>
            <motion.div animate={{ height }}>
              <div
                ref={ref}
                className="flex w-full items-center justify-between gap-2"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <MotionConfig
                    transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
                  >
                    {state === "SEARCH" ? (
                      <motion.div
                        key="search"
                        initial={{
                          opacity: 0,
                          y: -10,
                          scale: 0.9,
                          filter: "blur(15px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          y: 10,
                          scale: 0.9,
                          filter: "blur(15px)",
                        }}
                        className={
                          "flex w-full items-center justify-between gap-2 rounded-md bg-zinc-100 px-2 py-0.5 will-change-transform"
                        }
                      >
                        <span className="p-1.5 opacity-50 transition duration-200 ease-in-out hover:opacity-100">
                          <SearchMd className="size-5" />
                        </span>
                        <input
                          placeholder="Cari stasiun"
                          autoFocus
                          className="text-md w-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent"
                        />
                        <motion.button
                          transition={{
                            type: "spring",
                            duration: 0.8,
                            bounce: 0.3,
                          }}
                          whileTap={{ scale: 0.75 }}
                          onClick={() => setState("VIEW")}
                          className="p-1.5 opacity-50 transition duration-200 ease-in-out hover:opacity-100"
                        >
                          <X className="size-5" />
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="logo"
                        initial={{
                          opacity: 0,
                          y: 10,
                          scale: 0.9,
                          filter: "blur(15px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          y: -10,
                          scale: 0.9,
                          filter: "blur(15px)",
                        }}
                        className={
                          "flex w-full items-center justify-between gap-2 will-change-transform"
                        }
                      >
                        <div className="flex items-center gap-1 py-1 hover:opacity-100">
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
                          <h1 className="font-mono text-lg tracking-tight">
                            Comuline
                          </h1>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.75 }}
                          onClick={() => setState("SEARCH")}
                          className="rounded-md p-1.5 transition duration-200 ease-in-out hover:bg-zinc-100"
                        >
                          <SearchMd className="size-5" />
                        </motion.button>
                      </motion.div>
                    )}
                  </MotionConfig>
                </AnimatePresence>
                <motion.button
                  transition={{
                    type: "spring",
                    duration: 0.8,
                    bounce: 0.3,
                  }}
                  whileTap={{ scale: 0.75 }}
                  onClick={() =>
                    setState((prev) => (prev === "ADD" ? "VIEW" : "ADD"))
                  }
                  data-state={"open"}
                  className="rounded-md p-1.5 transition hover:bg-zinc-100"
                >
                  <Plus
                    className={cn(
                      "size-5 transition-transform duration-200 ease-in-out",
                      {
                        "rotate-45": state === "ADD",
                        "rotate-0": state !== "ADD",
                      },
                    )}
                  />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </nav>
        <section className="relative mx-auto flex w-full max-w-[500px] flex-col">
          {STATION_IDs.map((stationId) => (
            <StationItem key={stationId} stationId={stationId} />
          ))}
        </section>
      </section>
    </div>
  );
}
