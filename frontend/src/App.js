import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import GameSession from "./components/GameSession";
import UserStats from "./components/UserStats";

export default function App() {
	const token = localStorage.getItem("token");

	return (
		<>
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
						}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/gamesession"
						element={
							<ProtectedRoute>
								<GameSession />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/userstats"
						element={
							<ProtectedRoute>
								<UserStats />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
			{/* <Login /> */}
		</>
	);
}
