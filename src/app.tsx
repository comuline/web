import { SearchLg, X } from "@untitled-ui/icons-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import React from "react";
import { StationItem } from "./components/station-item";
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
              <div ref={ref} className="flex w-full">
                <AnimatePresence mode="popLayout" initial={false}>
                  <MotionConfig
                    transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
                  >
                    {isSearching ? (
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
                          "flex w-full items-center justify-between gap-2 py-0.5 will-change-transform"
                        }
                      >
                        <input
                          placeholder="Cari stasiun"
                          autoFocus
                          className="text-md w-full rounded-md bg-zinc-100 px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                        />
                        <motion.button
                          transition={{
                            type: "spring",
                            duration: 0.8,
                            bounce: 0.3,
                          }}
                          whileTap={{ scale: 0.75 }}
                          onClick={() => setIsSearching((prev) => !prev)}
                          className="rounded-md p-1.5 transition duration-200 ease-in-out hover:bg-zinc-100"
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
                          onClick={() => setIsSearching((prev) => !prev)}
                          className="rounded-md p-1.5 transition duration-200 ease-in-out hover:bg-zinc-100"
                        >
                          <SearchLg className="size-5" />
                        </motion.button>
                      </motion.div>
                    )}
                  </MotionConfig>
                </AnimatePresence>
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
