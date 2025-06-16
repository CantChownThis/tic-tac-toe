import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { nextMove } from '../api/nextMove';
import { nextMoveRequest, nextMoveSuccess, nextMoveFailure } from "../redux/gameSlice";
import { useEffect } from "react";

export default function GameSession() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
	const { board, current_player, game_status } = useSelector((state) => state.game);

    const handleTurn = async (row, col) => {
        dispatch(nextMoveRequest());
        console.log(row, col);
        try {
            const data = await nextMove(row, col);
            dispatch(nextMoveSuccess(data));
            console.log(data);
            // navigate("/gamesession");
        } catch (err) {
            dispatch(nextMoveFailure(err.message));
        }
    }

    useEffect(() => {
        if (game_status && game_status !== "ongoing") {
            alert(`Game Over: ${game_status === "draw" ? "It's a draw!" : `${game_status.toUpperCase()} wins!`}`);
            <div className="rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
                
            </div>
        }
    }, [game_status])

	return (
		<>
			<div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white px-4">
				<h1 className="text-3xl font-bold mb-6">Tic Tac Toe</h1>
				<p className="mb-4 text-lg">
					Current Player: {current_player === "x" ? "X (You)" : "O (Computer)"}
				</p>

				<div className="grid grid-cols-3 gap-2">
					{board.map((row, rowIndex) =>
						row.map((cell, colIndex) => (
							<button
                                onClick={() => handleTurn(rowIndex, colIndex)}
								key={`${rowIndex}-${colIndex}`}
                                disabled={(game_status && game_status !== "ongoing") || cell !== 0}
								className="w-20 h-20 flex items-center justify-center border border-white text-2xl font-bold"
							>
								{cell === -1 ? "X" : cell === 1 ? "O" : ""}
							</button>
						))
					)}
				</div>

                {game_status && game_status !== "ongoing" && (
                    <>
                        <div className="rounded-md bg-red-100 px-4 py-2 text-sm text-red-700 mt-4 mb-4">
                        {game_status === "draw"
                            ? "It's a draw!"
                            : `${game_status.toUpperCase()} wins!`}
                        </div>
                        <div>
                            <button
                                type='button'
                                onClick={() => navigate("/dashboard")}
                                className="flex w-full justify-center rounded-md bg-red-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </>
                )}
			</div>
		</>
	);
}
