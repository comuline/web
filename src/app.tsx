import { StationItem } from "./components/station-item";
import { cn } from "./utils";

const STATION_IDs = ["MRI", "AC"];

export function App() {
  return (
    <div className="min-w-screen flex min-h-screen flex-col">
      <section className="relative mx-auto flex w-full max-w-[550px] flex-col">
        <nav className="sticky top-0 z-10 flex h-fit flex-col gap-2 bg-white/50 p-5 backdrop-blur-md">
          <div
            className={cn("flex w-full items-center justify-between", {
              /*               "pb-[10px]": !isAdding || !isSearching, */
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
          </div>
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
