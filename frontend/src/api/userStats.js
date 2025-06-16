import axios from "axios";

const API_URL = process.env.REACT_APP_API_URI;

export const userStats = async () => {
	const token = localStorage.getItem("token");
	const response = await axios.get(
		`${API_URL}/user/stats`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response.data;
}