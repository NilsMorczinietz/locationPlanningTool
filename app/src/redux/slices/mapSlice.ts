import { createSlice } from '@reduxjs/toolkit'
import { Location } from '../../types'

interface InitialState {
    locations: Location[];
}

const initialState: InitialState = {
    locations: [],
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        addLocation: (state, action) => {
            console.log(action)
            const { payload } = action;
            state.locations.push(payload)
        },
        updateLocation: (state, action) => {
            const { payload } = action;
            const index = state.locations.findIndex((loc) => loc.id === payload.id);
            if (index !== -1) {
                state.locations[index] = payload;
            }
        },
        deleteLocation: (state, action) => {
            const { payload } = action;
            state.locations = state.locations.filter((loc) => loc.id !== payload);
        },
        setLocations: (state, action) => {
            const { payload } = action;
            console.log(payload)
            state.locations = payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    setLocations,
    addLocation,
    updateLocation,
    deleteLocation,
} = mapSlice.actions

export default mapSlice.reducer