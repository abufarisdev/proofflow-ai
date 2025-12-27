
import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5000/api/reports";

export const getReports = async () => {
  try {
    const config = await getAuthHeaders();
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error getting reports", error);
    throw error;
  }
};

export const getReport = async (id: string) => {
  try {
    const config = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error getting report", error);
    throw error;
  }
};
