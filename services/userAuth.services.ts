// src/services/userAuth.services.ts
import { jwtDecode } from "jwt-decode";
import { api, setAuthToken } from "@/lib/axios-config";
import { SessionService } from "./session.services";

interface LoginResponse {
  message: string;
  token: string;
  user: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      profileImage: string;
      _id: string;
      createdAt: string;
      updatedAt: string;
      __v: 0;
  }
}

export interface UserProfile {
  email: string;
  id: string,
  firstName: string,
  lastName: string,
  phone: string,
  profileImage: string,
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
  private static user: UserProfile | null = null;
  private static USER_KEY = "auth_user";
  private static token: string | null = null;
  private static SESSION_ID_KEY = "session_id";
  private static AUTH_TOKEN_KEY = "auth_token";

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    setAuthToken(token);
  }
  
  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    }
    return this.token;
  }
  
  static getUser(): UserProfile | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  static setUser(user: UserProfile): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }
  
  static clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.SESSION_ID_KEY);
    localStorage.removeItem(this.USER_KEY);
    setAuthToken(null);
  }
  
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && this.validateToken(token);
  }
  
  static validateToken(token: string): boolean {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      if (!decodedToken.id || !decodedToken.exp) return false;
      return decodedToken.exp * 1000 > Date.now() + 5000;
    } catch {
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
      const token = this.getToken();
      if (token) {
        const userId = this.extractUserId(token);
        if (userId) {
          await SessionService.deleteSession(userId);
        }
      }
    } finally {
      this.clearAuth();
    }
  }
  
  static async login(email: string, password: string): Promise<UserProfile> {
    console.log("Login function called with email:", email);
  
    try {
      const res = await api.post<LoginResponse>("users/login", { email, password });
      console.log("API login response:", res.data);
  
      if (!res.data.token) throw new Error("No token received from API");
  
      this.setToken(res.data.token);
      const userProfile: UserProfile = {
        id: res.data.user._id,
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName,
        email: res.data.user.email,
        phone: "", // Set default value for required field
        profileImage: res.data.user?.profileImage,
      };
      this.setUser(userProfile);
  
      return userProfile;
    } catch (error) {
      console.error("AuthService login error:", error);
      throw error;
    }
  }
  
  
  static async validateSession(): Promise<boolean> {
    try {
      console.log("Validating session...");
      const token = this.getToken();
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
        this.clearAuth();
        return false;
      }
  
      return true;
    } catch (error) {
      console.log("Session validation failed:", error);
      this.clearAuth();
      return false;
    }
  }
  
  static async checkSession(): Promise<boolean> {
    try {
      const sessionId = localStorage.getItem(this.SESSION_ID_KEY);
      if (!sessionId) return false;

      const session = await SessionService.getSession(sessionId);
      
      if (SessionService.isSessionExpired(session.expiresAt)) {
        this.clearAuth();
        return false;
      }

      // If we have a valid session but no user data, fetch the user profile
      if (!this.user) {
        const token = this.getToken();
        if (token && this.validateToken(token)) {
          const userId = this.extractUserId(token);
          if (userId) {
            const response = await api.get(`users/profile/${userId}`);
            const userData = response.data;
            
            const userProfile: UserProfile = {
              id: userData.id || userData._id,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              phone: userData.phone || "",
              profileImage: userData.profileImage || "",
              profile: userData.profile
            };
            
            this.setUser(userProfile);
          }
        }
      }

      return true;
    } catch (error) {
      console.error("Check session error:", error);
      this.clearAuth();
      return false;
    }
  }
}