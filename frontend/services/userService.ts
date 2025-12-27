
import axios from "axios";

const API_URL = "http://localhost:5000/users";

export const getUser = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user", error);
    throw error;
  }
};
