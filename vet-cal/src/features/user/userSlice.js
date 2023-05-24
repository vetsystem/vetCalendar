import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: "",
  initials: "",
  color: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.initials = action.payload.initials;
      state.color = action.payload.color;
    },
    logout: (state, action) => {
      state.id = null;
      state.name = "";
      state.initials = "";
      state.color = "";
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
