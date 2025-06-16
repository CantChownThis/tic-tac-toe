import logo from '../assets/tt.svg';
import { useDispatch, useSelector } from "react-redux";
import { userStats } from '../api/userStats';
import { statsRequest, statsSuccess, statsFailure } from "../redux/statsSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserStats() {
    const dispatch = useDispatch();
    const { user, stats } = useSelector((state) => state.stats);
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(statsRequest());
        const showStats = async () => {
            try {
                const data = await userStats();
                dispatch(statsSuccess(data));
                console.log(data);
            } catch (err) {
                dispatch(statsFailure(err.message));
            }
        }
        showStats();
    }, [dispatch]);
    return (
			<>
				<div className="flex items-center justify-center min-h-screen px-4 py-12">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<div className="max-w-sm rounded overflow-hidden shadow-lg">
							<div className="px-6 py-4 bg-neutral-950 text-white">
								<img
									className="mx-auto h-44 w-auto"
									src={logo}
									alt="Tic Tac Toe"
								/>
								<h1 className="text-3xl font-bold my-6">My Stats</h1>
								<div>
									{user && stats && (
										<ul className="text-lg space-y-2">
											<li>
												<strong>User:</strong> {user}
											</li>
											<li>
												<strong>Games Won:</strong> {stats.wins}
											</li>
											<li>
												<strong>Games Lost:</strong> {stats.losses}
											</li>
											<li>
												<strong>Games Drawn:</strong> {stats.draws}
											</li>
										</ul>
									)}
								</div>
                                <div className='mt-4'>
									<button
										onClick={() => navigate("/dashboard")}
										className="flex w-full justify-center rounded-md bg-red-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
									>
										Dashboard
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
}