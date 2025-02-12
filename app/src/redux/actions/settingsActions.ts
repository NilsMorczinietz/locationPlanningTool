import { createAction } from "@reduxjs/toolkit";

import { Location } from "../../types";

export const SET_TIMELIMIT = "SET_TIMELIMIT";

// Action Creator mit `createAction`
export const setTimeLimit = createAction<number>(SET_TIMELIMIT);

export type LocationActionTypes =
  | ReturnType<typeof setTimeLimit>