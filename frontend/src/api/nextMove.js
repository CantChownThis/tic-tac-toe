import axios from "axios";

const API_URL = process.env.REACT_APP_API_URI;

export const nextMove = async (row, col) => {
	const token = localStorage.getItem("token");
	const response = await axios.post(
		`${API_URL}/game/move`,
		{ row, col },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response.data;
}