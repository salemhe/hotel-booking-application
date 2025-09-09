// services/auth.service.ts
// import { jwtDecode } "jwt-decode";
import { jwtDecode } from "jwt-decode";
import API from "../axios";
import { SessionService } from "./session.service";
import { DecodedToken } from "./userAuth.service";
import { getFrontendUrl } from "../../config";
interface LoginResponse {
  message?: string;
  token?: string;
  error?: string; // Added error field for type safety
  status?: string;
  profile?: {
    id?: string;
    name?: string;
    businessName?: string;
    businessType?: string;
    email?: string;
    address?: string;
    branch?: string;
    profileImage?: string;
    services?: string[];
    token?: string;
    onboarded?: boolean;
    role?: string;
    _id?: string; // Added for MongoDB ID field
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
  profileImage?: string;
  paymentDetails?: PaymentDetalsProps;
  recipientCode?: string;
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
  businessName?: string;
  businessType?: string;
  address?: string;
  branch?: string;
  profileImage?: string;
  onboarded?: boolean;
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
  // static async login(email: string, password: string, role: string = 'vendor'): Promise<LoginResponse> {
  //   try {
  //     let url = `${this.BASE_URL}/api/vendors/login`;
  //     if (role === 'super-admin') {
  //       url = `${this.BASE_URL}/api/super-admins/login`;
  //     }

  //     console.log("Starting login attempt with:", { email, passwordLength: password.length, role });
  //     console.log("API URL:", url);
      
  //     // Log the exact request payload
  //     const payload = { email, password };
  //     console.log("Request payload:", payload);
      
  //     const requestOptions = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Accept": "application/json"
  //       },
  //       body: JSON.stringify(payload),
  //       credentials: "include" as RequestCredentials
  //     };
      
  //     console.log("Request options:", { 
  //       method: requestOptions.method,
  //       headers: requestOptions.headers,
  //       credentials: requestOptions.credentials
  //     });

  //     // Make the request
  //     const response = await fetch(url, requestOptions);
  //     console.log("Response received:", { 
  //       status: response.status, 
  //       statusText: response.statusText,
  //       headers: [...response.headers.entries()].reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  //     });
      
  //     // Get the raw response text first
  //     const responseText = await response.text();
  //     console.log("Raw response body:", responseText);
      
  //     // Attempt to parse JSON
  //     let data;
  //     try {
  //       data = responseText ? JSON.parse(responseText) : {};
  //       console.log("Parsed response data:", data);
  //     } catch (parseError) {
  //       console.error("JSON parse error:", parseError);
  //       throw new Error(`Server returned invalid JSON: ${responseText}`);
  //     }
      
  //     if (!response.ok) {
  //       console.error(`Authentication failed with status ${response.status}: ${data.message || 'No error message provided'}`);
  //       throw new Error(data.message || "Login failed");
  //     }

  //     // Only set token if it exists in the response
  //     if (data.profile && data.profile.token) {
  //       await this.setToken(data.profile.token, data.profile.role); // Pass role here
  //     }

  //     // Create session
  //     const expiresAt = new Date(
  //       Date.now() + 24 * 60 * 60 * 1000
  //     ).toISOString();
  //     const session = await SessionService.createSession(
  //       data.profile.id,
  //       data.profile.token,
  //       expiresAt
  //     );

  //     // Store session ID
  //     localStorage.setItem(this.SESSION_ID_KEY, session._id);
  //     // Store auth data
  //     this.setUser({
  //       email: data.profile.email,
  //       role: data.profile.role || "vendor",
  //       token: data.profile.token,
  //       profile: data.profile,
  //       id: data.profile.id,
  //     });

  //     return data;
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     throw error;
  //   }
  // }

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

  static async fetchMyProfile(id: string, role: string): Promise<UserProfile | null> {
    try {
      let url = `/api/vendors/${id}`; // Default for vendors
      if (role === "super-admin") {
        url = `/api/super-admins/${id}`; // Use super-admin endpoint
      }
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

  // static async setToken(token: string, role: string = 'vendor') {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("auth_token", token);
  //   }
  //   // Optionally, also send to backend if needed
  //   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://hotel-booking-app-backend-30q1.onrender.com";
  //   let endpoint = "set-vendor-token"; // Default for vendors
  //   if (role === "super-admin") {
  //     endpoint = "set-admin-token"; // Use set-admin-token for super-admins
  //   }
  //   const fetchUrl = `${backendUrl}/api/auth/${endpoint}`;
  //   console.log("AuthService.setToken: Fetching URL:", fetchUrl);
  //   await fetch(fetchUrl, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ token }),
  //     credentials: "include"
  //   });
  // }

  // static async getToken(): Promise<string | null> {
  //   if (typeof window !== "undefined") {
  //     return localStorage.getItem("auth_token");
  //   }
  //   return null;
  // }

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
    await fetch(`https://hotel-booking-app-backend-30q1.onrender.com/api/auth/clear-token`, {
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
