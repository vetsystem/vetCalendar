import appointmentRes from "./appointmentRes";
import { bundleEntryTemplate, bundleTemplate } from "./bundleTemplate";
import patientTemplate from "./patientTemplate";
import scheduleTemplate from "./scheduleTemplate";
import slotTemplate from "./slotRes";

function createFhirResource(resourceData) {
  const resourceType = resourceData.resourceType;
  switch (resourceType) {
    case "Appointment":
      const appointment = appointmentRes(resourceData);
      return appointment;
    case "Schedule":
      const schedule = scheduleTemplate();
      schedule.actor = createActors(Object.values(resourceData.actors));
      schedule.planningHorizon.start = resourceData.startDateTime;
      schedule.planningHorizon.end = resourceData.endDateTime;
      return schedule;
    case "Slot":
      const slot = slotTemplate();
      slot.schedule.reference = resourceData.id;
      slot.start = resourceData.start;
      slot.end = resourceData.end;
      return slot;
    case "Patient":
      const patient = patientTemplate();
      patient.name[0].text = resourceData.name;
      patient.birthDate = resourceData.birthDate;
      patient.extension[0].extension[0].valueCodeableConcept.coding[0] =
        resourceData.species;
      patient.contact[0].name.text = resourceData.owner;
      patient.contact[0].telecom = resourceData.contact;
      return patient;
    case "Bundle":
      const bundle = bundleTemplate();

      resourceData.entries.forEach((element) => {
        const bundleEntry = bundleEntryTemplate();
        if (element.fullUrl) bundleEntry.fullUrl = element.fullUrl;
        if (element.resource) bundleEntry.resource = element.resource;
        bundleEntry.request.method = element.method;
        bundleEntry.request.url = element.url ?? element.resource.resourceType;
        if (element.ifNoneExist)
          bundleEntry.request.ifNoneExist = element.ifNoneExist;
        bundle.entry.push(bundleEntry);
      });
      return bundle;

    default:
      throw new Error("Unknown resourceType");
  }
}

const getDeleteAppBundle = (resources, appointmentId) => {
  const slotsResources = getResourceByType(resources, "Slot");
  const appointmentDeleteEntry = {
    request: { method: "DELETE", url: `Appointment/${appointmentId}` },
  };
  const slotsModifiedEntries = slotsResources.map((slot) => ({
    fullUrl: slot.fullUrl,
    resource: { ...slot.resource, status: "free" },
    request: { method: "POST", url: `Slot/${slot.resource.id}` },
  }));
  const bundleEntries = [...slotsModifiedEntries, appointmentDeleteEntry];
  const bundle = createBundle(bundleEntries);
  return bundle;
};

const createBundle = (entries) => {
  return { resourceType: "Bundle", type: "transaction", entry: entries };
};

const createBundleEntry = ({ resource, method, fullUrl, url }) => {
  const bundleEntry = {
    fullUrl: fullUrl,
    resource: resource,
    request: {
      method: method,
      url: url,
    },
  };
  return bundleEntry;
};

const getResources = (bundle) => {
  if (!bundle.entry) return [];
  return bundle.entry;
};
const getResourceByType = (resources, type) => {
  return resources.filter(
    (resource) => resource.resource.resourceType === type
  );
};

const createActors = (actors) => {
  const actorsArr = actors
    .filter((actor) => actor !== "")
    .map((actor) => createActor(actor));
  return actorsArr;
};

function createActor(actor) {
  return { reference: actor.id, type: actor.type, display: actor.display };
}
export {
  createFhirResource,
  createActor,
  getDeleteAppBundle,
  getResources,
  createBundleEntry,
  createBundle,
};
