// src/services/session.services.ts
import { api } from "@/lib/axios-config";

export interface Session {
  _id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export class SessionService {
  static async createSession(userId: string, token: string, expiresAt: string): Promise<Session> {
    const response = await api.post("/sessions", {
      userId,
      token,
      expiresAt
    });
    return response.data.session;
  }

  static async getSession(userId: string): Promise<Session> {
    const response = await api.get(`/sessions/${userId}`);
    return response.data;
  }

  static async deleteSession(userId: string): Promise<{ message: string }> {
    const response = await api.delete(`/sessions/delete/${userId}`);
    return response.data;
  }

  static isSessionExpired(expiresAt: string): boolean {
    return new Date(expiresAt) < new Date();
  }
}