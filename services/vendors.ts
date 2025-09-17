// src/services/VendorService.ts
import API from '../lib/api';

// interface VendorParams {
//   businessName?: string;
//   businessType?: string;
//   branch?: string;
// }

export interface Vendor {
  id?:number;
  _id: string;
  businessName: string;
  businessType: string;
  vendorType: string;
  branch: string;
  onboarded: boolean;
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
      const response = await API.get('/vendors');
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  }
}


// In your VendorService, make sure the endpoint is correct