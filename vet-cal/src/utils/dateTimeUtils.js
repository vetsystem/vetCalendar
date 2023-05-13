import { formatISO } from "date-fns";

export function formatISONull(date) {
  if (date === null || !date) return "";
  else return formatISO(date);
}
