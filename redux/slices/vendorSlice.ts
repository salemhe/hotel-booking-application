import { Restaurant, VendorState, VendorType } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: VendorState = {
  type: null,
  details: {
    id: "",
    email: ""
  },
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendorType: (state, action: PayloadAction<VendorType>) => {
      state.type = action.payload;
    },
    setVendorDetails: (state, action: PayloadAction<Restaurant>) => {
      state.details = { ...state.details, ...action.payload };
    },
    resetVendor: () => initialState,
  },
});

export const { setVendorType, setVendorDetails, resetVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
