import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const formatRelativeToNow = (time: string) => {
  const baseDate = new Date(time);

  const todayDate = new Date().setHours(
    baseDate.getHours(),
    baseDate.getMinutes(),
  );

  return formatDistanceToNow(todayDate, {
    locale: id,
  });
};

export const formatDateToTime = (baseDate: string) => {
  const date = new Date(baseDate);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
