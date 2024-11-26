import { StationItem } from "./components/station-item";

const STATION_IDs = ["MRI", "AC"];

export function App() {
  return (
    <div className="min-w-screen flex-cole flex min-h-screen">
      <section className="relative mx-auto flex w-full max-w-[500px] flex-col">
        <div className="w-lg">
          {STATION_IDs.map((stationId) => (
            <StationItem key={stationId} stationId={stationId} />
          ))}
        </div>
      </section>
    </div>
  );
}
