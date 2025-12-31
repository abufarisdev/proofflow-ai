        // frontend/lib/api.ts
        "use client";

        import axios from "axios";
        import { auth } from "./firebase-config"; // Correct import path

        const api = axios.create({
          baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api",
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        });

        api.interceptors.request.use(
          async (config) => {
            const user = auth.currentUser;
            if (user) {
              try {
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
              } catch (error) {
                console.error("Error getting Firebase ID token:", error);
                // Handle token errors (e.g., redirect to login)
              }
            }
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
        );

        export default api;
