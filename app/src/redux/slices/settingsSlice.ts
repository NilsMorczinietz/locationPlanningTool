import { createSlice } from '@reduxjs/toolkit'

interface InitialState {
    timeLimit: number | null;
}

const initialState: InitialState = {
    timeLimit: null,
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTimeLimit: (state, action) => {
            const { payload } = action;
            state.timeLimit = payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    setTimeLimit,
} = settingsSlice.actions

export default settingsSlice.reducer