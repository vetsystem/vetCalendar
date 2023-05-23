import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "fhirApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_FHIR_SERVER_URL,
  }),
  endpoints: (builder) => ({
    /* getRooms: builder.query({
            query: () => '/Location',
            transformResponse: responseData => {
                const apiRooms = responseData.entry.map(entry => {
                    const room = { name: entry.resource.name }
                    return room
                })
                return apiRooms
            }
        }), */
    /* getDoctors: builder.query({
            query: () => '/Practitioner'
        }), */
    /* getAppReasons: builder.query({
            query: () => '/ActivityDefinition'
        }) */
  }),
});

export const { useGetRoomsQuery, useGetDoctorsQuery, useGetAppReasonsQuery } =
  apiSlice;
