import { TrainRoute } from "@/commons/ui/sections/train-route";

export default async function Home({
  params,
}: {
  params: { trainId: string };
}) {
  return <TrainRoute trainId={params.trainId} />;
}
