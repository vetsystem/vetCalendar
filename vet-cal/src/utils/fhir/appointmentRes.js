import { addMinutes, formatISO } from "date-fns";
import { createActor } from "./fhirUtil";

function appointmentRes({
  slots,
  appReason,
  startDate,
  endDate,
  patient,
  doctor,
  room,
}) {
  const rawApp = {
    resourceType: "Appointment",
    status: "booked",
    participant: [],
  };
  const appWithTimeSlot = addTimeSlot(rawApp, startDate, endDate);
  const appWithTitle = addTitle(appWithTimeSlot, appReason);
  const appWithParticipants = addParticipants(appWithTitle, [
    patient,
    doctor,
    room,
  ]);
  const appWithSubject = addSubject(appWithParticipants, patient);
  const appWithSlot = addSlots(appWithSubject, slots);
  return appWithSlot;
}

function addSlots(appRes, slots) {
  const slotsRef = slots.map((slot) =>
    slot?.resource.id
      ? { reference: `Slot/${slot.resource.id}`, type: "Slot" }
      : null
  );
  const appWithSlots = { ...appRes, slot: slotsRef };
  return appWithSlots;
}

function addSubject(appRes, patient) {
  const appWithSubject =
    patient?.id && patient.id !== ""
      ? {
          ...appRes,
          subject: {
            reference: patient.id,
            display: patient.name,
            type: patient.type,
          },
        }
      : appRes;
  return appWithSubject;
}

function addTitle(appRes, appReason) {
  const appWithTitle =
    appReason !== "" ? { ...appRes, description: appReason } : appRes;
  return appWithTitle;
}

function addTimeSlot(appRes, startDate, endDate) {
  const start = formatISO(startDate);
  const end =
    !endDate || endDate === null || endDate === ""
      ? formatISO(
          addMinutes(startDate, process.env.REACT_APP_MIN_SLOT_DURATION)
        )
      : formatISO(endDate);
  const appWithTimeSlot = { ...appRes, start, end };
  return appWithTimeSlot;
}

function addParticipants(appRes, participants) {
  const appResWithParticipants = {
    ...appRes,
    participant: createParticipants(participants),
  };
  return appResWithParticipants;
}

function createParticipants(participants) {
  const participantsArr = participants
    .filter((participant) => participant?.id && participant.id !== "")
    .map((participant) => ({
      actor: createActor(participant),
      status: "accepted",
    }));
  return participantsArr;
}

export default appointmentRes;
