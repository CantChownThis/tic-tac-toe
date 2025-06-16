import logo from '../assets/tt.svg';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { startGame } from '../api/startGame';
import { startGameRequest, startGameSuccess, startGameFailure } from "../redux/gameSlice";

export default function Dashboard() {
    const dispatch = useDispatch();
    const game = useSelector((state) => state.game);
	const navigate = useNavigate();
    const [ firstPlayer, setFirstPlayer ] = useState("user");

    const handleStartGame = async (e) => {
        e.preventDefault();
		dispatch(startGameRequest());
		try {
            const userStarts = firstPlayer === "user";
			const data = await startGame(userStarts);
			dispatch(startGameSuccess(data));
            
            navigate("/gamesession");
		} catch (err) {
			dispatch(startGameFailure(err.message));
		}
	};

	const handleLogout = (e) => {
        e.preventDefault();
		localStorage.removeItem("token");
		window.location.href = "/login";
	};
	return (
		<>
			<div className="flex items-center justify-center min-h-screen px-4 py-12">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<div className="max-w-sm rounded overflow-hidden shadow-lg">
						<div className="px-6 py-4 bg-neutral-950">
							<img
								className="mx-auto h-44 w-auto"
								src={logo}
								alt="Tic Tac Toe"
							/>
							<div className="font-bold text-xl mb-2 text-center text-white">
								Tic Tac Toe
							</div>
							<form className="space-y-6">
								<div>
									<button
										onClick={handleStartGame}
										className="flex w-full justify-center rounded-md bg-red-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
									>
										Start Game
									</button>
									{game && game.error && <p>{game.error}</p>}
								</div>
								<div>
									<label
										htmlFor="firstPlayer"
										className="block mb-1 text-white text-sm"
									>
										Starting Player
									</label>
									<select
										id="firstPlayer"
										value={firstPlayer}
										onChange={(e) => setFirstPlayer(e.target.value)}
										className="w-full p-2 rounded-md text-black mb-12"
									>
										<option value="user">You</option>
										<option value="computer">Computer</option>
									</select>
								</div>
								<div>
									<button
                                        type='button'
										onClick={() => navigate("/userstats")}
										className="flex w-full justify-center rounded-md bg-red-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
									>
										My Stats
									</button>
								</div>
                                <div>
									<button
										onClick={handleLogout}
										className="flex w-full justify-center rounded-md bg-red-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
									>
										Logout
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
