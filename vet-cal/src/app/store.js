import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import currAppReducer from "../features/currApp/currAppSlice";
import calendarReducer from "../features/calendar/calendarSlice";
import { apiSlice } from "../api/fhirApi";
import windowReducer from "../features/window/windowSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    currApp: currAppReducer,
    calendar: calendarReducer,
    window: windowReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
