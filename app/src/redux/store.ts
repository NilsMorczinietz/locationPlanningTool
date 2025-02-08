import { configureStore } from '@reduxjs/toolkit';
import { locationsReducer } from './reducers/locationsReducer';

const store = configureStore({
    reducer: {
        planning: locationsReducer,
    },
    devTools: true
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;