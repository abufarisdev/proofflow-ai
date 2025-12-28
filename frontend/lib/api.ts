import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { auth } from "./firebase-config";

// Standard API Response type
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}

// Create axios instance
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            // Handle known errors (e.g., 401 Unauthorized)
            if (error.response.status === 401) {
                console.warn("Unauthorized access - redirecting to login...");
                // You might want to trigger a redirect or state change here
            }
            console.error("API Error:", error.response.data);
        } else if (error.request) {
            console.error("Network Error:", error.request);
        } else {
            console.error("Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
