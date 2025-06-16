import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	board: [],
	current_player: null,
    game_status: "ongoing",
	error: null,
};

const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		nextMoveRequest: (state) => {
			state.error = null;
		},
		nextMoveSuccess: (state, action) => {
			state.board = action.payload.board;
			state.current_player = action.payload.current_player;
			state.game_status = action.payload.game_status;
		},
		nextMoveFailure: (state, action) => {
			state.error = action.payload;
		},
        resetGame: () => initialState,
        startGameRequest: (state) => {
            state.error = null;
        },
        startGameSuccess: (state, action) => {
            state.board = action.payload.board;
            state.current_player = action.payload.current_player;
            state.game_status = action.payload.game_status;
        },
        startGameFailure: (state, action) => {
            state.error = action.payload;
        },
	},
});

export const { nextMoveRequest, nextMoveSuccess, nextMoveFailure, resetGame, startGameRequest, startGameSuccess, startGameFailure } = gameSlice.actions;

export default gameSlice.reducer;
