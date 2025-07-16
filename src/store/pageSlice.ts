import { createSlice, type PayloadAction,  } from "@reduxjs/toolkit";

interface PageState {
  title: string;
}

const initialState: PageState = {
  title: "Dashboard",
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPageTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
  },
});

export const { setPageTitle } = pageSlice.actions;
export default pageSlice.reducer;
