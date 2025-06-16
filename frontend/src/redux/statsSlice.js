import { createSlice } from "@reduxjs/toolkit";

const statsSlice = createSlice({
	name: "stats",
	initialState: {
		user: null,
		stats: null,
		error: null,
	},
	reducers: {
		statsRequest: (state) => {
			state.error = null;
		},
		statsSuccess: (state, action) => {
			state.user = action.payload.user;
			state.stats = action.payload.stats;
		},
		statsFailure(state, action) {
			state.error = action.payload;
		},
	},
});

export const { statsRequest, statsSuccess, statsFailure } = statsSlice.actions;
export default statsSlice.reducer;
