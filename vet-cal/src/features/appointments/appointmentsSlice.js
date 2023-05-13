import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/fhirApi";
import { getResources, getDeleteAppBundle } from "../../utils/fhir/fhirUtil";

const appAdapter = createEntityAdapter({ selectId: (app) => app.event_id });
const initialState = appAdapter.getInitialState();
/**
 * Add tag for appointment to redux store
 */
apiSlice.enhanceEndpoints({ addTagTypes: ["Appointment"] });

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: () => "/Appointment?_count=100",
      transformResponse: (responseData) => {
        const apiApps = responseData.entry.map((entry) => {
          const room = entry.resource.participant.filter(
            (participant) => participant.actor.type === "Location"
          );
          const doc = entry.resource.participant.filter(
            (participant) => participant.actor.type === "Practitioner"
          );
          const patient = entry.resource.participant.filter(
            (participant) => participant.actor.type === "Patient"
          );
          const event = {
            event_id: parseInt(entry.resource.id),
            title: entry.resource.description,
            start: entry.resource.start,
            end: entry.resource.end,
            assignee: room[0].actor.reference,
            doctorId: doc[0]?.actor?.reference || null,
            patientId: patient[0]?.actor?.reference || null,
          };
          return event;
        });
        const apps = appAdapter.setAll(initialState, apiApps);
        return apps;
      },
      providesTags: ["Appointment"],
    }),
    addApp: builder.mutation({
      query: (bundle) => ({
        url: "/",
        method: "POST",
        body: bundle,
      }),
      invalidatesTags: ["Appointment"],
    }),
    deleteApp: builder.mutation({
      queryFn: async (args, api, extraOptions, baseQuery) => {
        // First fetch appointment to delete with it's ocuppied slots
        const appId = args;
        const bundleWithResToModify = await baseQuery(
          `/Appointment?_id=${appId}&_include=Appointment:slot`
        );
        if (bundleWithResToModify.error)
          return { error: bundleWithResToModify.error };
        /* Transform response budle to transaction bundle with modified slots 
        resources to status free and  request to delete appointment */
        const resourcesToModify = getResources(bundleWithResToModify.data);
        const deleteAppBundle = getDeleteAppBundle(resourcesToModify, appId);
        // Delete appointment and modify slots
        const result = await baseQuery({
          url: "",
          headers: { "content-type": "application/json+fhir" },
          method: "POST",
          body: deleteAppBundle,
        });
        return result.data ? { data: result.data } : { error: result.error };
      },
      invalidatesTags: ["Appointment"],
    }),
  }),
});

export const {
  useAddAppMutation,
  useGetAppointmentsQuery,
  useDeleteAppMutation,
} = extendedApiSlice;

export const selectAppointmentsResults =
  extendedApiSlice.endpoints.getAppointments.select();
export const selectAppointmentsData = createSelector(
  selectAppointmentsResults,
  (appointmentResult) => appointmentResult.data
);

export const { selectAll: selectAllApps } = appAdapter.getSelectors(
  (state) => selectAppointmentsData(state) ?? initialState
);
