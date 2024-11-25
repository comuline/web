import { useSchedule } from "./hooks/use-schedule";
import { components } from "./schema";

export type GroupedSchedule = Record<
  string,
  Record<string, Array<components["schemas"]["Schedule"]>>
>;

export function App() {
  const { data, isLoading, isValidating, error } = useSchedule("MRI");

  const groupedSchedule = data?.data.reduce((acc: GroupedSchedule, obj) => {
    const lineKey = `${obj.line}-${obj.metadata.origin?.color}`;
    const destKey = obj.station_destination_id;

    const lineKeyRecord = acc[lineKey] ?? {};
    const destKeyArray = lineKeyRecord[destKey] ?? [];

    destKeyArray.push({ ...obj });

    lineKeyRecord[destKey] = destKeyArray;
    acc[lineKey] = lineKeyRecord;
    return acc;
  }, {});

  return (
    <div class="min-w-screen flex-cole flex min-h-screen">
      <section className="mx-auto flex max-w-2xl">
        {isLoading ? (
          <p>loading</p>
        ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </section>
    </div>
  );
}
