// src/services/VendorService.ts
import API from "../axios";

// interface VendorParams {
//   businessName?: string;
//   businessType?: string;
//   branch?: string;
// }

export interface Vendor {
  id?: number;
  _id: string;
  businessName: string;
  businessType: string;
  branch: string;
  address: string;
  email: string;
  phone: string;
  services: string[];
  image?: string;
  profileImages?: string[];
  description?: string;
  rating?: number;
  reviews?: string[];
  createdAt?: string;
  updatedAt?: string;
  featured?: boolean;
  location?: string;
}

export class VendorService {
  /**
   * Get vendors with optional filtering
   */
  static async getVendors(): Promise<Vendor[]> {
    try {
      const response = await API.get("/vendors");
      return response.data || [];
    } catch (error) {
      console.warn("Error fetching vendors:", error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  }
}

// In your VendorService, make sure the endpoint is correct
