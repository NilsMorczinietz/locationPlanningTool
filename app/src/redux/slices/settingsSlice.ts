import { createSlice } from '@reduxjs/toolkit'

interface InitialState {
    timeLimit: number;
    showDistricts: boolean;
    showIsochrones: boolean;
}

const initialState: InitialState = {
    timeLimit: 8,
    showDistricts: true,
    showIsochrones: true,
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTimeLimit: (state, action) => {
            const { payload } = action;
            state.timeLimit = payload;
        },
        toggleDistrictsVisibility: (state, action) => {
            const { payload } = action;
            state.showDistricts = payload;
        },
        toggleIsochronesVisibility: (state, action) => {
            const { payload } = action;
            state.showIsochrones = payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    setTimeLimit,
    toggleDistrictsVisibility,
    toggleIsochronesVisibility,
} = settingsSlice.actions

export default settingsSlice.reducer