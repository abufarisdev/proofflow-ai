import api from "@/lib/api";

export interface CreateProjectData {
    repoName: string;
    repoUrl: string;
    description?: string;
}

export const createProject = async (data: CreateProjectData) => {
    try {
        const response = await api.post("/projects/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating project", error);
        throw error;
    }
};

export const getAllProjects = async () => {
    try {
        const response = await api.get("/projects");
        return response.data;
    } catch (error) {
        console.error("Error getting all projects", error);
        throw error;
    }
};

export const getProjectById = async (id: string) => {
    try {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error getting project", error);
        throw error;
    }
};
