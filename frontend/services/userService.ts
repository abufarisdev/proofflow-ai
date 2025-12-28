import api from "@/lib/api";

export const getUser = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error getting user", error);
    throw error;
  }
};
