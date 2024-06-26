import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./reducers/todoReducer";

export const store = configureStore({
    reducer: {
        todo: todoReducer,
    }
})