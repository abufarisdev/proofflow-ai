
import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5000/users";

export const getUser = async () => {
  try {
    const config = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/me`, config);
    return response.data;
  } catch (error) {
    console.error("Error getting user", error);
    throw error;
  }
};
