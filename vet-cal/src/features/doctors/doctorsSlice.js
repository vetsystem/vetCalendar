import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

import { apiSlice } from "../../api/fhirApi";
import { nameToColor } from "../../utils/nameToColor";

const doctorsAdapter = createEntityAdapter();
const initialState = doctorsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: () => "/Practitioner",
      transformResponse: (responseData) => {
        const apiDocs = responseData.entry
          .filter((entry) => {
            return (
              entry.resource.name[0].text &&
              entry.resource.name[0].family &&
              entry.resource.name[0].given
            );
          })
          .map((entry) => {
            const doc = {
              id: `${entry.resource.resourceType}/${entry.resource.id}`,
              type: "doctor",
              resourceType: entry.resource.resourceType,
              name: entry.resource.name[0].text,
              initials: `${entry.resource.name[0].given[0][0]}${entry.resource.name[0].family[0]}`,
              color: nameToColor(entry.resource.name[0].text),
            };
            return doc;
          });
        const docs = doctorsAdapter.setAll(initialState, apiDocs);
        return docs;
      },
    }),
  }),
});

export const { useGetDoctorsQuery } = extendedApiSlice;

export const selectDoctorsResults =
  extendedApiSlice.endpoints.getDoctors.select();

export const selectDoctorsData = createSelector(
  selectDoctorsResults,
  (doctorsResult) => doctorsResult.data
);

export const {
  selectAll: selectAllDoctos,
  selectIds: selectDocIds,
  selectEntities: selectDocsEnts,
} = doctorsAdapter.getSelectors(
  (state) => selectDoctorsData(state) ?? initialState
);
