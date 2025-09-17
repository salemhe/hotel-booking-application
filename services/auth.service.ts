import { jwtDecode } from "jwt-decode";
import API from "../lib/api";
import { getFrontendUrl } from "../lib/config";
import {
  AuthUser,
  DecodedToken,
  RegisterData,
  UserLoginResponse,
  UserProfile,
  VendorLoginResponse,
} from "@/types/auth";

export class AuthService {
  private static BASE_URL =
    "https://hotel-booking-app-backend-30q1.onrender.com";
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
  static async login(
    email: string,
    password: string,
    role: string
  ): Promise<UserLoginResponse | VendorLoginResponse | undefined> {
    try {
      const response = await API.post(`/${role}s/login`, {
        email,
        password,
      });

      const data = response.data;
      console.log("Response Token:", data.token);
      await this.setToken(data.token)

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async fetchMyProfile(
    id: string,
  ): Promise<UserProfile | null> {
    try {
      const url = `/vendors/${id}`;
      const response = await API.get(url, { withCredentials: true });
      console.log("fetchMyProfile response:", response);
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
    await fetch(`${getFrontendUrl()}/api/auth/set-token`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  static async getToken(): Promise<string | null> {
    const response = await fetch(
      `${getFrontendUrl()}/api/auth/get-token`,
      {
        method: "GET",
      }
    );
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
      await this.clearAuth();
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      this.clearAuth();
    }
  }

  private static async clearAuth(): Promise<void> {
    await fetch(
      `https://hotel-booking-app-backend-30q1.onrender.com/api/auth/clear-token`,
      {
        method: "GET",
      }
    );
  }

  static async isAuthenticated(): Promise<boolean> {
    return await !!this.getToken();
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
