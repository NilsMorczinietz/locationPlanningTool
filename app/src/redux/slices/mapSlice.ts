import { createSlice } from '@reduxjs/toolkit'
import { LocationRecord } from '../../types'

interface InitialState {
    locations: LocationRecord[];
    isochronesValid: boolean;
}

const initialState: InitialState = {
    locations: [],
    isochronesValid: false,
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        addLocation: (state, action: {payload: LocationRecord, type: string}) => {
            const { payload } = action;
            state.locations.push(payload)
        },
        updateLocation: (state, action : {payload : LocationRecord, type: string}) => {
            const { payload } = action;
            const index = state.locations.findIndex((LocationRecord) => LocationRecord.location.id === payload.location.id);
            if (index !== -1) {
                state.locations[index] = payload;
                return;
            }
            if (payload.metaData.needsIsochroneRecalculation) {
                state.isochronesValid = false;
            }
        },
        deleteLocation: (state, action: {payload: string, type: string}) => {
            const { payload } = action;
            state.locations = state.locations.filter((LocationRecord) => LocationRecord.location.id !== payload);
        },
        setLocations: (state, action: {payload: LocationRecord[], type: string}) => {
            const { payload } = action;
            state.locations = payload
        },
        toggleIsochronesValid: (state, action: {payload: boolean, type:string}) => {
            const { payload } = action;
            state.isochronesValid = payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    setLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    toggleIsochronesValid
} = mapSlice.actions

export default mapSlice.reducer