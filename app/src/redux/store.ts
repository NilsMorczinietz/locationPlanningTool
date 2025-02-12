import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import locationsReducer from './slices/mapSlice';
import settingsReducer from './slices/settingsSlice';
import { PersistPartial } from 'redux-persist/es/persistReducer';

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({ 
    map: locationsReducer, 
    settings: settingsReducer 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof persistedReducer>;
export type AppDispatch = typeof store.dispatch;