import axios from "axios";

const API_URL = process.env.REACT_APP_API_URI;

export const login = async (email, password) => {
	const response = await axios.post(`${API_URL}/login`, { email, password });
	return response.data.myToken; // backend returns { myToken }
};

export const register = async (email, password) => {
	const response = await axios.post(`${API_URL}/register`, { email, password });
	return response.data.message; // backend returns { message }
};
