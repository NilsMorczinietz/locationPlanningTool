import { createAction } from "@reduxjs/toolkit";

export const ADD_LOCATION = "ADD_LOCATION";
export const UPDATE_LOCATION = "UPDATE_LOCATION";
export const DELETE_LOCATION = "DELETE_LOCATION";
export const SET_LOCATIONS = "SET_LOCATIONS";

interface Location {
  id: string;
  active: boolean;
  title: string;
  identifier: string;
  number: string;
  address: string;
}

// Action Creator mit `createAction`
export const addLocation = createAction<Location>(ADD_LOCATION);
export const updateLocation = createAction<Location>(UPDATE_LOCATION);
export const deleteLocation = createAction<string>(DELETE_LOCATION);
export const setLocations = createAction<Location[]>(SET_LOCATIONS);

export type LocationActionTypes =
  | ReturnType<typeof addLocation>
  | ReturnType<typeof updateLocation>
  | ReturnType<typeof deleteLocation>
  | ReturnType<typeof setLocations>;