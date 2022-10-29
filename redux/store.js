import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { studiosReducer } from '../features/studios/studiosSlice';
import { commentsReducer } from '../features/comments/commentsSlice';
import { promotionsReducer } from '../features/promotions/promotionsSlice';
import { favouritesReducer } from '../features/favourites/favouriteSlice';
import {
    persistStore,
    persistCombineReducers,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
    key: 'root',
    storage: AsyncStorage,
    debug: true
};

export const store = configureStore({
    reducer: persistCombineReducers(config, {
        studios: studiosReducer,
        comments: commentsReducer,
        promotions: promotionsReducer,
        favourites: favouritesReducer
    }),
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [
                    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
                ]
            }
        })

});

export const persistor = persistStore(store);