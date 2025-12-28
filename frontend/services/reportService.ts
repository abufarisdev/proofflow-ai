import api from "@/lib/api";

export const createReport = async (data: any) => {
  try {
    const response = await api.post("/reports/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating report", error);
    throw error;
  }
};

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
