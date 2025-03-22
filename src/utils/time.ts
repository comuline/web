import { format, formatDistanceToNow } from "date-fns";
import { Language } from "../libs/i18n/types";

export const formatRelativeToNow = (time: string) => {
  const baseDate = new Date(time);

  const todayDate = new Date().setHours(
    baseDate.getHours(),
    baseDate.getMinutes(),
  );

  return formatDistanceToNow(todayDate);
};

export const formatDateToTime = (baseDate: string, lang: Language = "id") => {
  const date = new Date(baseDate);
  return format(date, lang === "id" ? "HH:mm" : "hh:mmaaa");
};
