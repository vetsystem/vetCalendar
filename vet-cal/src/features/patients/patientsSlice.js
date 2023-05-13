import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/fhirApi";

const patientsAdapter = createEntityAdapter();
const initialState = patientsAdapter.getInitialState();

/**
 * Add tag for patient to redux store
 */
apiSlice.enhanceEndpoints({ addTagTypes: ["Patient"] });

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: () => "/Patient",
      transformResponse: (responseData) => {
        const apiPatients = responseData.entry
          .filter(({ resource }) => {
            return (
              resource.name[0].text &&
              resource.birthDate &&
              resource.extension[0].extension[0].url === "species"
            );
          })
          .map(({ resource }) => {
            const patient = {
              name: resource.name[0].text,
              id: `${resource.resourceType}/${resource.id}`,
              bd: resource.birthDate,
              species:
                resource.extension[0].extension[0].valueCodeableConcept
                  .coding[0],
              owner: resource.contact[0].name.text,
              contact: resource.contact[0].telecom[0].value,
            };
            return patient;
          });
        const patients = patientsAdapter.setAll(initialState, apiPatients);
        return patients;
      },
      providesTags: ["Patient"],
    }),
    getPatient: builder.mutation({
      query: ({ bundle }) => ({
        url: "",
        headers: { "content-type": "application/json+fhir" },
        method: "POST",
        body: bundle,
      }),
      invalidatesTags: ["Patient"],
    }),
  }),
});

export const { useGetPatientsQuery, useGetPatientMutation } = extendedApiSlice;
export const selectPatientsResults =
  extendedApiSlice.endpoints.getPatients.select();
export const selectPatientsData = createSelector(
  selectPatientsResults,
  (patientsResult) => patientsResult.data
);
export const {
  selectAll: selectAllPatients,
  selectEntities: selectPatientsEnts,
} = patientsAdapter.getSelectors(
  (state) => selectPatientsData(state) ?? initialState
);
