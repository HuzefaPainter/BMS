import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import loaderReducer from "./loaderSlice";

const store = configureStore({
    reducer: {
        loaders: loaderReducer,
        user: userReducer,
    }
});

export default store;