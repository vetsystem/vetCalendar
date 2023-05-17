import { createTypedReference } from "./fhirUtil";

function ActivityDefinitionRes(label, duration, participants) {
  const rawActivityDefinition = {
    resourceType: "ActivityDefinition",
    name: label,
    ...(duration && { timingDuration: { value: duration, unit: "min" } }),
    ...(participants && {
      participant: [
        ...(participants.doctors?.length > 0
          ? participants.doctors.map((doctor) =>
              createTypedReference("practitioner", doctor)
            )
          : []),
        ...(participants.rooms?.length > 0
          ? participants.rooms.map((room) =>
              createTypedReference("location", room)
            )
          : []),
      ],
    }),
  };
  return rawActivityDefinition;
}

export default ActivityDefinitionRes;
