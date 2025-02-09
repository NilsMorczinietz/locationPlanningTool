import { createReducer } from "@reduxjs/toolkit";
import { addLocation, updateLocation, deleteLocation, setLocations } from "../actions/locationsActions";

interface Location {
  id: string;
  active: boolean;
  title: string;
  identifier: string;
  number: string;
  address: string;
}

export interface LocationsState {
  locations: Location[];
}

const initialState: LocationsState = {
  locations: [],
};

export const locationsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addLocation, (state, action) => {
      state.locations.push(action.payload);
    })
    .addCase(updateLocation, (state, action) => {
      const index = state.locations.findIndex((loc) => loc.id === action.payload.id);
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
    })
    .addCase(deleteLocation, (state, action) => {
      state.locations = state.locations.filter((loc) => loc.id !== action.payload);
    })
    .addCase(setLocations, (state, action) => {
      state.locations = action.payload;
    });
});