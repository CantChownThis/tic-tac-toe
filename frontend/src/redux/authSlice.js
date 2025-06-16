import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: token || null,
		isAuthenticated: !!token,
		loading: false,
		error: null,
	},
	reducers: {
		loginStart(state) {
			state.loading = true;
			state.error = null;
		},
		loginSuccess(state, action) {
			state.token = action.payload;
			state.isAuthenticated = true;
			state.loading = false;
		},
		loginFailure(state, action) {
			state.loading = false;
			state.error = action.payload;
		},
		logout(state) {
			state.token = null;
			state.isAuthenticated = false;
			localStorage.removeItem("token");
		},
	},
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
