"use client";

import * as Dialog from "@/commons/ui/components/dialog";
import { cn } from "@/commons/utils/cn";
import { removeSeconds } from "@/commons/utils/date";
import { api } from "@/trpc/react";
import clsx from "clsx";
import { Route } from "lucide-react";

type TrainRouteDialogProps = {
  classNames?: {
    trigger?: string;
  };
  trainId: string;
  currentStationId: string;
};

const TrainRouteDialog = ({
  classNames,
  trainId,
  currentStationId,
}: TrainRouteDialogProps) => {
  const { data: trainRoute } = api.route.getByTrainId.useQuery(trainId);

  const currentStationIndex = trainRoute?.findIndex(
    (schedule) => schedule.stationId === currentStationId,
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Tampilkan rute kereta"
          className={cn(
            "transition-all duration-200",
            "visible text-foreground/50 hover:text-foreground",
            classNames?.trigger,
          )}
        >
          <Route size={20} />
        </button>
      </Dialog.Trigger>

      <Dialog.Content className="h-[85%]">
        <div className="flex flex-col">
          <Dialog.Title>Rute Kereta</Dialog.Title>
          <div
            className={clsx(
              "mt-6",
              "space-y-6",
              // make route timeline scrollable
              "h-0 flex-grow overflow-y-auto",
            )}
          >
            {trainRoute?.map((schedule, i) => {
              const beforeCurrentStation = currentStationIndex
                ? i < currentStationIndex
                : false;

              return (
                <div
                  key={schedule.id}
                  className="relative flex items-center gap-3"
                >
                  <div
                    className={clsx(
                      // use odd number so the line is always in the middle
                      "h-[21px] w-[21px]",
                      "rounded-full border border-foreground/40",
                    )}
                    style={
                      !beforeCurrentStation
                        ? { borderColor: schedule.color }
                        : {}
                    }
                  />

                  <p
                    className={cn(
                      "opacity-50",
                      !beforeCurrentStation && "opacity-80",
                      "font-mono text-sm",
                    )}
                  >
                    {removeSeconds(schedule.timeEstimated)}
                  </p>

                  <p
                    className={cn(
                      "capitalize",
                      "opacity-50",
                      !beforeCurrentStation && "opacity-80",
                    )}
                  >
                    {schedule.stationName?.toLocaleLowerCase()}
                  </p>

                  {i !== trainRoute.length - 1 && (
                    <div
                      className={clsx(
                        "absolute h-full w-px bg-foreground/40",
                        "left-[10px] top-[100%]",
                      )}
                      style={
                        !beforeCurrentStation
                          ? { backgroundColor: schedule.color }
                          : {}
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default TrainRouteDialog;
