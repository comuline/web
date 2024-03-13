export interface Schedule {
  id: string;
  stationId: string;
  trainId: string;
  line: string;
  route: string;
  color: string;
  destination: string;
  timeEstimated: string;
  destinationTime: string;
  updatedAt: string;
}

export type GroupedSchedule = Record<string, Record<string, Array<Schedule>>>;

export interface Station {
  id: string;
  daop: number;
  name: string;
  fgEnable: number;
  haveSchedule: boolean;
  updatedAt: string;
}
