// services/auth.service.ts
// import { jwtDecode } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import API from "../axios";
import { SessionService } from "./session.service";
import { DecodedToken } from "./userAuth.service";
import { getFrontendUrl } from "@/app/lib/config";
interface LoginResponse {
  message: string;
  profile: {
    id: string;
    name: string;
    businessName: string;
    businessType: string;
    email: string;
    address: string;
    branch: string;
    profileImage: string;
    services: string[];
    token: string;
    onboarded: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  email: string;
  phone: string;
  address: string;
  branch?: string;
  password: string;
  role: string;
  onboarded: boolean;
  services: string[];
}

interface RegisterData {
  businessName: string;
  businessType: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: string;
  onboarded?: boolean;
}

interface PaymentDetalsProps {
  accountNumber: string;
  bankAccountName: string;
  bankCode: string;
  bankName: string;
  paystackSubAccount: string;
  percentageCharge: number;
  recipientCode: string;

}

export interface AuthUser {
  email: string;
  role: string;
  token?: string;
  id: string;
  profile: {
    id: string;
    businessName: string;
    businessType: string;
    email: string;
    address: string;
    branch: string;
    profileImage: string;
    phone: number;
    paymentDetails: PaymentDetalsProps;
    recipientCode: string;
    onboarded: boolean;
  };
}

export class AuthService {
  private static BASE_URL =
    "https://hotel-booking-app-backend-30q1.onrender.com";
    // "localhost:5000";
  private static TOKEN_KEY = "auth_token";
  private static USER_KEY = "auth_user";
  private static SESSION_ID_KEY = "session_id";

  static async register(data: RegisterData) {
    try {
      // const url = `${this.BASE_URL}/api/vendors/register`;
      // console.log("Making registration request to:", url);

      const response = await fetch(`${this.BASE_URL}/api/vendors/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: data.businessName,
          businessType: data.businessType,
          email: data.email,
          phone: data.phone,
          address: data.address,
          password: data.password,
          role: data.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  static async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string }> {
    const response = await fetch(`${this.BASE_URL}/api/vendors/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "OTP verification failed");
    }

    return response.json();
  }

  // auth.services.ts - Enhanced error handling
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log("Starting login attempt with:", { email }); // Log the attempt

      const response = await fetch(`${this.BASE_URL}/api/vendors/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "same-origin", // Change from 'include' to 'same-origin' if cookies are on the same domain
      });

      console.log("Response status:", response.status); // Log the response status

      const data = await response.json();
      this.setToken(data.profile.token);
      console.log("Response data:", data); // Log the response data

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Create session
      const expiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString();
      const session = await SessionService.createSession(
        data.profile.id,
        data.profile.token,
        expiresAt
      );

      // Store session ID
      localStorage.setItem(this.SESSION_ID_KEY, session._id);
      // Store auth data
      this.setUser({
        email: data.profile.email,
        role: data.profile.role || "vendor",
        token: data.profile.token,
        profile: data.profile,
        id: data.profile.id,
      });

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

    static async fetchMyProfile(id: string): Promise<UserProfile | null> {
    try {
      const response = await API.get(`/vendors/${id}`);
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

  
    static async getId() {
      const token = await this.getToken();
      if (!token) return null;
      const decodedToken = jwtDecode<DecodedToken>(token);
      return decodedToken.id || null;
    }

  static async resendOTP(email: string): Promise<{ message: string }> {
    const response = await fetch(`${this.BASE_URL}/api/vendors/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to resend OTP");
    }

    return response.json();
  }

  static async setToken(token: string) {
    await fetch(`${getFrontendUrl()}/api/auth/set-vendor-token`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  static async getToken(): Promise<string | null> {
    const response = await fetch(`${getFrontendUrl()}/api/auth/get-vendor-token`, {
      method: "GET",
    });
    const data = await response.json();
    return data.token;
  }
  static getUser(): AuthUser | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  static setUser(user: AuthUser): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  static async logout(): Promise<void> {
    try {
      const sessionId = localStorage.getItem(this.SESSION_ID_KEY);
      if (sessionId) {
        await SessionService.deleteSession(sessionId);
      }
      await this.clearAuth()
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      this.clearAuth();
    }
  }

  private static async clearAuth():  Promise<void> {
    await fetch(`${getFrontendUrl()}/api/auth/clear-token`, {
      method: "GET",
    });
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

      return true;
    } catch {
      this.clearAuth();
      return false;
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  static isAuthorized(allowedRoles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? allowedRoles.includes(userRole) : false;
  }
}
