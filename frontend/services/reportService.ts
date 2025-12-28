import api from "@/lib/api";

export const getReports = async () => {
  try {
    const response = await api.get("/reports");
    return response.data;
  } catch (error) {
    console.error("Error getting reports", error);
    throw error;
  }
};

export const getReport = async (id: string) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting report", error);
    throw error;
  }
};
