import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

import { apiSlice } from "../../api/fhirApi";

const ORGANIZATION_ID = process.env.REACT_APP_ORGANIZATION_ID;

const roomsAdapter = createEntityAdapter();
const initialState = roomsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: () => `/Location`,
      transformResponse: (responseData) => {
        const apiRooms = responseData.entry
          .map((entry) => {
            const room = {
              id: `${entry.resource.resourceType}/${entry.resource.id}`,
              type: "room",
              resourceType: entry.resource.resourceType,
              name: entry.resource.name,
              assignee: `${entry.resource.resourceType}/${entry.resource.id}`,
            };
            return room;
          })
          .filter((entry) => entry.name);
        const rooms = roomsAdapter.setAll(initialState, apiRooms);
        return rooms;
      },
    }),
  }),
});

export const { useGetRoomsQuery } = extendedApiSlice;

export const selectRoomsResults = extendedApiSlice.endpoints.getRooms.select();

export const selectRoomsData = createSelector(
  selectRoomsResults,
  (roomsResult) => roomsResult.data
);

export const { selectAll: selectAllRooms, selectEntities: selectAllRoomEnts } =
  roomsAdapter.getSelectors((state) => selectRoomsData(state) ?? initialState);
