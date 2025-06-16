import axios from "axios";

const API_URL = process.env.REACT_APP_API_URI;

export const startGame = async (userStarts = true) => {
	const token = localStorage.getItem("token");
	const response = await axios.post(
		`${API_URL}/game/start`,
		{ userStarts },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response.data;
}