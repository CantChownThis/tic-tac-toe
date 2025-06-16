import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import gameReducer from "./gameSlice";
import statsReducer from "./statsSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
        game: gameReducer,
		stats: statsReducer
	},
	devTools: process.env.NODE_ENV !== "production",
});

export default store;
