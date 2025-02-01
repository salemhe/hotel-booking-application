import API from "@/utils/axios";

export const createSession = async (userId: string, token: string, expiresAt: string) => {
  try {
    const res = await API.post("/sessions/create", { userId, token, expiresAt });
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Session creation failed";
  }
};

export const getSession = async (sessionId: string) => {
  try {
    const res = await API.get(`/sessions/${sessionId}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to get session";
  }
};

export const deleteSession = async (sessionId: string) => {
  try {
    const res = await API.delete(`/sessions/${sessionId}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to delete session";
  }
};
