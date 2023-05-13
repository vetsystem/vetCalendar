import { createSlice } from "@reduxjs/toolkit";
import { formatISO } from "date-fns";

const initialState = {
  selectedDate: formatISO(new Date(), { representation: "date" }),
  selectedTimeSlot: {
    start: null,
    end: null,
    duration: 0,
    shiftId: "",
    room: "",
    doctor: "",
  },
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    changeSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { changeSelectedDate } = calendarSlice.actions;
export default calendarSlice.reducer;
