import { formatISO } from "date-fns";

function slotRes(scheduleId, start, end) {
  return {
    resourceType: "Slot",
    schedule: {
      reference: scheduleId,
    },
    status: "free",
    start: formatISO(start),
    end: formatISO(end),
  };
}

export default slotRes;
