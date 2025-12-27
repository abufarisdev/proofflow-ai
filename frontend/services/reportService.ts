
import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

export const getReports = async (token: string) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting reports", error);
    throw error;
  }
};

export const getReport = async (token: string, id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting report", error);
    throw error;
  }
};
