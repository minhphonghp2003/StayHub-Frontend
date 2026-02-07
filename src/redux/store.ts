import { configureStore } from '@reduxjs/toolkit';
import demoReducer from './features/demo/demo-slice';
import imageReducer from './features/images/ImageSlice';
import userReducer from './features/RBAC/UserSlice';
export const store = () => {
    return configureStore({
        reducer: {
            demo: demoReducer,
            user: userReducer,
            image: imageReducer
        },
    })
}


// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']