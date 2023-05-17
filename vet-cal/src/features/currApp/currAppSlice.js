import { createSlice } from "@reduxjs/toolkit";
import { addMinutes, formatISO, parseISO } from "date-fns";
import countAge from "../../utils/countAge";

const initialState = {
  appReason: "",
  startDate: null,
  endDate: null,
  duration: process.env.REACT_APP_MIN_SLOT_DURATION,
  doctor: {
    selected: "",
    options: [],
  },
  room: {
    selected: "",
    options: [],
  },
  patient: {
    owner: "",
    contact: "",
    name: "",
    birthDate: "",
    age: "",
    species: "",
  },
};

const currAppSlice = createSlice({
  name: "currApp",
  initialState,
  reducers: {
    addAppDetailVal: (state, action) => {
      state[action.payload.type].selected = action.payload.id;
    },
    addStartDate: (state, action) => {
      state.startDate = action.payload;
      if (state.duration)
        state.endDate = formatISO(
          addMinutes(parseISO(action.payload), state.duration)
        );
      else state.endDate = null;
    },
    addDuration: (state, action) => {
      state.duration = action.payload;
      if (state.startDate)
        state.endDate = formatISO(
          addMinutes(parseISO(state.startDate), state.duration)
        );
    },
    addTimeSlot: (state, action) => {
      const timeSlot = action.payload;
      state.startDate = timeSlot.start;
      state.duration = timeSlot.duration;
      state.endDate = timeSlot.end;
      state.room.selected = timeSlot.room;
      state.doctor.selected = timeSlot.doctor;
    },
    resetCurrAppReason: (state, action) => {
      state.appReason = initialState.appReason;
      state.duration = initialState.duration;
      state.doctor.options = initialState.doctor.options;
      state.room.options = initialState.room.options;
    },
    addCurrAppReason: (state, action) => {
      const data = action.payload;
      state.appReason = data.label;
      state.duration = data.duration;
      state.doctor.options = data.doctor;
      state.room.options = data.room;
    },
    setSpecies: (state, action) => {
      const data = action.payload;
      state.patient.species = data;
    },
    setPatient: (state, action) => {
      const patient = action.payload;
      state.patient.owner = patient.owner;
      state.patient.contact = patient.contact;
      state.patient.name = patient.name;
      state.patient.birthDate = patient.bd;
      state.patient.age = countAge(patient.bd);
      state.patient.species = patient.species;
    },
    setBirthDate: (state, action) => {
      state.patient.birthDate = action.payload;
      state.patient.age = countAge(action.payload);
    },
    setAge: (state, action) => {
      state.patient.age = action.payload.age;
      state.patient.birthDate = action.payload.birthdate;
    },
    updatePatient: (state, action) => {
      const { type, value } = action.payload;
      state.patient[type] = value;
    },
    resetPatient: (state, action) => {
      state.patient.owner = "";
      state.patient.contact = "";
      state.patient.name = "";
      state.patient.birthDate = "";
      state.patient.age = "";
      state.patient.species = "";
    },
  },
});

export default currAppSlice.reducer;
export const {
  addAppDetailVal,
  addStartDate,
  addCurrAppReason,
  addTimeSlot,
  resetCurrAppReason,
  addDuration,
  setPatient,
  setBirthDate,
  setAge,
  updatePatient,
  resetPatient,
} = currAppSlice.actions;
export const selectCurrApp = (state) => state.currApp;
