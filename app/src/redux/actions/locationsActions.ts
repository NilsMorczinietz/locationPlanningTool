import { createAction } from "@reduxjs/toolkit";

export const ADD_LOCATION = "ADD_LOCATION";
export const UPDATE_LOCATION = "UPDATE_LOCATION";
export const DELETE_LOCATION = "DELETE_LOCATION";

interface Location {
  id: string;
  title: string;
  identifier: string;
  number: string;
  address: string;
}

// Action Creator mit `createAction`
export const addLocation = createAction<Location>(ADD_LOCATION);
export const updateLocation = createAction<Location>(UPDATE_LOCATION);
export const deleteLocation = createAction<string>(DELETE_LOCATION);

export type LocationActionTypes =
  | ReturnType<typeof addLocation>
  | ReturnType<typeof updateLocation>
  | ReturnType<typeof deleteLocation>;
