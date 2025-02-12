import { createReducer } from "@reduxjs/toolkit";

import { setTimeLimit } from "../actions/settingsActions";

export interface SettingsState {
    timeLimit: number | null;
}

const initialState: SettingsState = {
    timeLimit: null,
};

export const settingsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setTimeLimit, (state, action) => {
            state.timeLimit = action.payload;
        });
});