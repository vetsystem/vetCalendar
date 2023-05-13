import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/fhirApi";
import {
  createBundle,
  createBundleEntry,
  getResources,
} from "../../utils/fhir/fhirUtil";

/**
 * Create application reasons adapter for normalizing fetch api data from FHIR
 * server - not needed yet TODO
 */
const shiftAdapter = createEntityAdapter({
  selectId: (shift) => shift.id,
});
const initialState = shiftAdapter.getInitialState();

const getActors = (type, resource) => {
  const actor = resource.actor.filter((actor) => actor.type === type);
  return actor;
};

const getShiftFromResource = (resource) => {
  const doctor = getActors("Practitioner", resource);
  const room = getActors("Location", resource);
  const shift = {
    id: `${resource.resourceType}/${resource.id}`,
    doctor: doctor,
    room: room,
    start: resource.planningHorizon.start,
    end: resource.planningHorizon.end,
  };
  return shift;
};

/**
 * Transform Bundle fetched from FHIR server with data of all shifts
 * to redux store
 * @param {Object} bundle
 * @returns Object with shofts data prepared for redux store
 */
const transformBundle = (bundle) => {
  if (!bundle.entry) return shiftAdapter.setAll(initialState, []);
  const apiShifts = bundle.entry
    .filter((entry) => entry.resource.planningHorizon && entry.resource.actor)
    .map((entry) => getShiftFromResource(entry.resource));
  const shifts = shiftAdapter.setAll(initialState, apiShifts);

  return shifts;
};

/**
 * Add tag for shifts to redux store
 */
apiSlice.enhanceEndpoints({ addTagTypes: ["Shift"] });

/**
 * Function for adding endpoints to redux store
 */
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: () => "/Schedule?_count=500",
      transformResponse: (responseData) => {
        return transformBundle(responseData);
      },
      providesTags: ["Shift"],
    }),
    getShiftsForDay: builder.query({
      query: (date) => `/Schedule?date=${date}&_count=500`,
      transformResponse: (responseData) => {
        return transformBundle(responseData);
      },
      providesTags: ["Shift"],
    }),
    getShiftsForMonth: builder.query({
      query: ({ start, end }) =>
        `/Schedule?date=ge${start}&date=le${end}&_count=500`,
      providesTags: ["Shift"],
    }),
    addShift: builder.mutation({
      queryFn: async (args, api, extraOptions, baseQuery) => {
        const searchUrl = args.searchUrl;
        const bundle = args.bundle;
        // First check if in specified time and room already shift exists
        const bundleWithExistingShift = await baseQuery(searchUrl);
        if (bundleWithExistingShift.error)
          return { error: bundleWithExistingShift.error };
        else if (bundleWithExistingShift.data.total > 0)
          return { error: "Směna je obsazená" };
        // Create Shift with slots
        const result = await baseQuery({
          url: "/",
          method: "POST",
          body: bundle,
        });
        return result.data ? { data: result.data } : { error: result.error };
      },
      invalidatesTags: ["Shift"],
    }),
    deleteShift: builder.mutation({
      queryFn: async (args, api, extraOptions, baseQuery) => {
        const shiftId = args;
        const shiftDeleteEntry = createBundleEntry({
          method: "DELETE",
          url: `/Schedule/${shiftId}`,
        });
        // Search slots
        const slotsRes = await baseQuery(
          `/Slot?schedule=${shiftId}&_count=500`
        );
        if (slotsRes.error) return { error: slotsRes.error };
        // Create slots entries for delete bundle
        const slotsArr = getResources(slotsRes.data).map((slot) =>
          createBundleEntry({
            url: `${slot.resource.resourceType}/${slot.resource.id}`,
            method: "DELETE",
          })
        );
        // Add schedule delete entry to slots entries
        slotsArr.push(shiftDeleteEntry);
        // Create delete bundle
        const bundle = createBundle(slotsArr);
        // Delete slots and shift
        const result = await baseQuery({
          url: "/",
          method: "POST",
          body: bundle,
        });
        return result.data ? { data: result.data } : { error: result.error };
      },
      invalidatesTags: ["Shift"],
    }),
    getSlots: builder.query({
      query: ({ roomId, startDate, endDate }) => ({
        url: `/Slot?schedule.actor:Location=${roomId}&start=ge${startDate}&start=lt${endDate}&status=free`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        if (!responseData.entry) return [];
        const slots = responseData.entry.map((entry) => {
          const slot = {
            id: `${entry.resource.resourceType}/${entry.resource.id}`,
            start: entry.resource.start,
            end: entry.resource.end,
          };
          return slot;
        });
        return slots;
      },
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useGetShiftsForDayQuery,
  useGetShiftsForMonthQuery,
  useAddShiftMutation,
  useDeleteShiftMutation,
  useGetSlotsQuery,
} = extendedApiSlice;

export const selectShiftsResults =
  extendedApiSlice.endpoints.getShifts.select();

export const selectShiftsData = createSelector(
  selectShiftsResults,
  (shiftsResult) => shiftsResult.data
);
export const { selectAll: selectAllShifts, selectEntities: selectShiftsEnt } =
  shiftAdapter.getSelectors((state) => selectShiftsData(state) ?? initialState);
