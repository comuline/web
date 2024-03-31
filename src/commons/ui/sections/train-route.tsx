"use client";

import { api } from "@/trpc/react";

export const TrainRoute = ({ trainId }: { trainId: string }) => {
  const { data } = api.route.getByTrainId.useQuery(trainId);

  return (
    <div>
      {data?.map((schedule) => (
        <p key={schedule.id}>
          {schedule.timeEstimated} {schedule.stationId}
        </p>
      ))}
    </div>
  );
};
