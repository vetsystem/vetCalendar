import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  height: 0,
};

const windowSlice = createSlice({
  name: "window",
  initialState,
  reducers: {
    setHeight: (state, action) => {
      state.height = action.payload;
    },
  },
});

export const { setHeight } = windowSlice.actions;
export default windowSlice.reducer;
