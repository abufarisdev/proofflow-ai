import api from "@/lib/api";

export const getProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error getting user", error);
    throw error;
  }
};

export const updateProfile = async (data: any) => {
  try {
    const response = await api.put("/users/profile", data);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile", error);
    throw error;
  }
};
