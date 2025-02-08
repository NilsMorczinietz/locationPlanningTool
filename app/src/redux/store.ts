import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { locationsReducer } from './reducers/locationsReducer';

// Hier den Typ für den State definieren
import type { LocationsState } from './reducers/locationsReducer';

const persistConfig = {
    key: 'root',
    storage,
};

// Typisierung für den persistierten Reducer
const persistedReducer = persistReducer<LocationsState>(persistConfig, locationsReducer);

export const store = configureStore({
    reducer: {
        planning: persistedReducer, // Jetzt mit richtigem Typ
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;