import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

import { apiSlice } from "../../api/fhirApi";

/**
 * Create application reasons adapter for normalizing fetch api data from FHIR
 * server
 */
const appReasonAdapter = createEntityAdapter();
const initialState = appReasonAdapter.getInitialState();

/**
 * Get Array of ids of possible participants list for example type Location or
 * Doctor
 * @param {Array} participants array of participants from FHIR resource
 * @param {String} participantType in case of appointment reason only type
 * location and practitioner are implemented
 * @returns Array of ids asociated with selected appointment reason
 */
const getParticipantsIds = (participants, participantType) => {
  const participantsFiltered = participants.filter(
    (participant) => participant.type === participantType
  );
  const ids = participantsFiltered.map(
    (entry) => entry.typeReference.reference
  );
  return ids;
};

/**
 * Transform FHIR ActivityDefinition resource to appointment reason object
 * @param {Object} entry Fhir ActivityReason JSON
 * @returns Object appointment reason object
 */
const transformResource = (entry) => {
  const appReason = {
    id: `${entry.resourceType}/${entry.id}`,
    type: "appReason",
    label: entry.name,
    room: getParticipantsIds(entry.participant || [], "location"),
    doctor: getParticipantsIds(entry.participant || [], "practitioner"),
    duration: entry.timingDuration?.value,
  };
  return appReason;
};

/**
 * Transform Bundle fetched from FHIR server with data of all appointment
 * reason to redux store
 * @param {Object} bundle
 * @returns Object with appointment reson data prepared for redux store
 */
const transformBundle = (bundle) => {
  if (!bundle.entry) return appReasonAdapter.setAll(initialState, []);
  const apiAppReasons = bundle.entry
    .map((entry) => transformResource(entry.resource))
    .filter((entry) => entry.label);
  const appReasons = appReasonAdapter.setAll(initialState, apiAppReasons);
  return appReasons;
};

/**
 * Add tag for appointment reason to redux store
 */
apiSlice.enhanceEndpoints({ addTagTypes: ["AppReason"] });

/**
 * Function for adding endpoints to redux store
 */
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppReasons: builder.query({
      query: () => "/ActivityDefinition",
      transformResponse: (responseData) => transformBundle(responseData),
      providesTags: ["AppReason"],
    }),
    addAppReason: builder.mutation({
      query: (bundle) => ({
        url: "/",
        method: "POST",
        body: bundle,
      }),
      transformResponse: (response, meta, arg) => {
        if (
          response.entry &&
          response.entry[0] &&
          response.entry[0].response &&
          response.entry[0].response.status
        )
          return response.entry[0].response.status;
        else return "";
      },
      invalidatesTags: ["AppReason"],
    }),
  }),
});

export const { useGetAppReasonsQuery, useAddAppReasonMutation } =
  extendedApiSlice;
export const selectAppReasonsResults =
  extendedApiSlice.endpoints.getAppReasons.select();

export const selectAppReasonsData = createSelector(
  selectAppReasonsResults,
  (appReasonsResult) => appReasonsResult.data
);

export const {
  selectAll: selectAllAppReasons,
  selectEntities: selectAppReasonsEnt,
} = appReasonAdapter.getSelectors(
  (state) => selectAppReasonsData(state) ?? initialState
);
