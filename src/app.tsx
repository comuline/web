import { SearchLg, X } from "@untitled-ui/icons-react";
import React from "react";
import { StationItem } from "./components/station-item";
import { cn } from "./utils";
import { AnimatePresence, motion } from "motion/react";
import { useMeasure } from "./hooks/use-measure";

const STATION_IDs = ["MRI", "AC"];

export function App() {
  const [isSearching, setIsSearching] = React.useState(false);
  const [ref, height] = useMeasure<HTMLDivElement>();
  return (
    <div className="min-w-screen flex min-h-screen flex-col">
      <section className="relative mx-auto flex w-full max-w-[550px] flex-col">
        <nav className="sticky top-0 z-10 flex h-fit flex-col gap-2 bg-white/50 p-5 backdrop-blur-md">
          <AnimatePresence>
            <motion.div animate={{ height }}>
              <div
                ref={ref}
                className={cn(
                  "flex w-full items-center justify-between gap-3",
                  {
                    /*               "pb-[10px]": !isAdding || !isSearching, */
                  },
                )}
              >
                <AnimatePresence>
                  {isSearching ? (
                    <motion.input
                      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                      initial={{ opacity: 0.5, y: 10, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0.5, y: -10, filter: "blur(10px)" }}
                      placeholder="Cari stasiun"
                      className="text-md w-full rounded-md bg-zinc-100 px-2 py-1"
                    />
                  ) : (
                    <motion.div
                      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                      initial={{ opacity: 0.5, y: -10, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0.5, y: 10, filter: "blur(10px)" }}
                      className="flex items-center gap-1 py-1 hover:opacity-100"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>

                <button onClick={() => setIsSearching((prev) => !prev)}>
                  {isSearching ? (
                    <X className="size-5" />
                  ) : (
                    <SearchLg className="size-5" />
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </nav>
        <section className="relative mx-auto flex w-full max-w-[500px] flex-col">
          <div className="w-lg">
            {STATION_IDs.map((stationId) => (
              <StationItem key={stationId} stationId={stationId} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
