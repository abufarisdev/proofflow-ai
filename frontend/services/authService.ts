
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const getGithubAuthUrl = async () => {
  try {
    const response = await axios.get(`${API_URL}/github`);
    return response.data.url;
  } catch (error) {
    console.error("Error getting GitHub auth URL", error);
    throw error;
  }
};

export const exchangeCodeForToken = async (code: string) => {
  try {
    const response = await axios.post(`${API_URL}/github/callback`, { code });
    return response.data;
  } catch (error) {
    console.error("Error exchanging code for token", error);
    throw error;
  }
};
