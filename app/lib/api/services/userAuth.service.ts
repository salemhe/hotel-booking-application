// src/services/userAuth.services.ts
import { jwtDecode } from "jwt-decode";
import { api } from "@/app/lib/axios-config";
import { SessionService } from "./session.service";
import API from "../userAxios";
import { apiFetcher } from "@/app/lib/fetcher";

interface LoginResponse {
  message: string;
  token: string;
}

export interface UserProfile {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage: string;
  profile?: {
    id: string;
    name: string;
    businessName: string;
    email: string;
    address: string;
    branch: string;
  };
}

export interface DecodedToken {
  id?: string;
  exp?: number;
  iat?: number;
}

export class AuthService {
  private static USER_KEY = "auth_user";
  private static SESSION_ID_KEY = "session_id";
  private static AUTH_TOKEN_KEY = "auth_token";

  static async fetchMyProfile(id: string): Promise<UserProfile | null> {
    try {
      const response = await API.get(`/users/profile/${id}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to fetch user profile:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }


  static async setToken(token: string) {
    await apiFetcher(`/api/auth/set-user-token`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  static async getToken(): Promise<string | null> {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.AUTH_TOKEN_KEY);
    }
    return null;
  }

  static async getUser(id: string): Promise<UserProfile | null> {
      const response = await API.get(`/users/profile/${id}`);
      return response.data;
  }

  static setUser(user: UserProfile): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  static async clearToken() {
    await apiFetcher(`/api/auth/clear-token`, {
      method: "GET",
    });
  }

  static async getId() {
    const token = await this.getToken();
    if (!token) return null;
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken.id || null;
  }

  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    const valid = !!token && this.validateToken(token);
    return valid;
  }

  static validateToken(token: string): boolean {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      if (!decodedToken.id || !decodedToken.exp) {
        return false;
      }
      const valid = decodedToken.exp * 1000 > Date.now() + 5000;
      return valid;
    } catch (_) {
      // Using underscore to indicate an unused variable
      return false;
    }
  }

  static extractUserId(token: string): string | null {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken.id || null;
    } catch {
      return null;
    }
  }

  static async createSession(token: string) {
    const userId = this.extractUserId(token);
    if (!userId) throw new Error("Unable to extract user ID from token");

    const expiresAt = new Date();
    const decodedToken = jwtDecode<DecodedToken>(token);
    if (decodedToken.exp) {
      expiresAt.setTime(decodedToken.exp * 1000);
    } else {
      // Default expiration: 24 hours
      expiresAt.setHours(expiresAt.getHours() + 24);
    }

    const session = await SessionService.createSession(
      userId,
      token,
      expiresAt.toISOString()
    );

    localStorage.setItem(this.SESSION_ID_KEY, userId);
    console.log("Session created:", session);
    return session;
  }

  static async logout(): Promise<void> {
    try {
      await this.clearToken();
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ data: { token: string } }> {
    try {
      const res = await api.post<LoginResponse>("users/login", {
        email,
        password,
      });

      if (!res.data.token) throw new Error("No token received from API");

      return res;
    } catch (error) {
      console.error("AuthService login error:", error);
      throw error;
    }
  }

  static async validateSession(): Promise<boolean> {
    try {
      console.log("Validating session...");
      const token = await this.getToken();
      if (!token) {
        console.log("No token found.");
        return false;
      }

      if (!this.validateToken(token)) {
        console.log("Token validation failed.");
        return false;
      }

      const userId = this.extractUserId(token);
      if (!userId) {
        console.log("Failed to extract user ID.");
        return false;
      }

      console.log(`Checking session for user ${userId}`);
      const session = await SessionService.getSession(userId);

      console.log("Session data:", session);

      if (SessionService.isSessionExpired(session.expiresAt)) {
        console.log("Session expired.");
        this.clearToken();
        return false;
      }

      return true;
    } catch (error) {
      console.log("Session validation failed:", error);
      this.clearToken();
      return false;
    }
  }

  static async checkSession(): Promise<boolean> {
    try {
      const sessionId = localStorage.getItem(this.SESSION_ID_KEY);
      if (!sessionId) return false;

      const session = await SessionService.getSession(sessionId);

      if (SessionService.isSessionExpired(session.expiresAt)) {
        this.clearToken();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Check session error:", error);
      this.clearToken();
      return false;
    }
  }
}
