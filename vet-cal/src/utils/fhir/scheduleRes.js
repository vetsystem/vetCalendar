import { formatISO } from "date-fns";
import { createActor } from "./fhirUtil";

function scheduleRes({ actors, start, end }) {
  const rawSchedule = {
    resourceType: "Schedule",
    actor: [],
  };
  addActors(rawSchedule, actors);
  addPlanningHorizont(rawSchedule, start, end);
  return rawSchedule;
}

function addActors(scheduleRes, actors) {
  scheduleRes.actor = actors.map((actor) => createActor(actor));
}

function addPlanningHorizont(scheduleRes, start, end) {
  scheduleRes.planningHorizon = {
    start: formatISO(start),
    end: formatISO(end),
  };
}

export default scheduleRes;
