export function parseTime(timeString: string): Date {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours ?? date.getHours());
  date.setMinutes(minutes ?? date.getMinutes());
  date.setSeconds(seconds ?? date.getSeconds());
  return date;
}

export function getRelativeTimeString(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h!);
  date.setMinutes(m!);

  const timeMs = typeof date === "number" ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  // Array representing one minute, hour, day, week, month, etc in seconds
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds),
  );

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  if (!divisor) return "sekarang";

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]!);
}

export function removeSeconds(time: string) {
  return time.split(":").slice(0, 2).join(":");
}
