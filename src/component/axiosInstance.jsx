import axios from "axios";
import { baseUrl } from "../lib/dotenv";

const axiosInstance = axios.create({
	baseURL: baseUrl,

	timeout: 600000, // Set timeout to 10 minutes (600,000 ms)
});
axiosInstance.interceptors.request.use(
	async (config) => {
		const token = localStorage.getItem("authToken"); // Get token from local storage

		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosInstance;
