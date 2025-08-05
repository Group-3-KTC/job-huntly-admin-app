import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isSidebarCollapsed: boolean;
  isSidebarOpen: boolean; 
}

const initialState: UIState = {
  isSidebarCollapsed: false,
  isSidebarOpen: false, 
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebarCollapse(state) {
      state.isSidebarCollapsed = !state.isSidebarCollapsed; 
    },
    toggleSidebarOpen(state, action) {
      state.isSidebarOpen =
        action.payload !== undefined ? action.payload : !state.isSidebarOpen; 
    },
    setSidebarCollapsed(state, action) {
      state.isSidebarCollapsed = action.payload;
    },
  },
});

export const { toggleSidebarCollapse, toggleSidebarOpen, setSidebarCollapsed } =
  uiSlice.actions;
export default uiSlice.reducer;