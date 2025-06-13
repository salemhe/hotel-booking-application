// src/services/VendorService.ts
import API from '../axios';

interface VendorParams {
  businessName?: string;
  businessType?: string;
  branch?: string;
}

export interface Vendor {
  id: string;
  businessName: string;
  businessType: string;
  branch: string;
  address: string;
  email: string;
  phone: string;
  services: string[];
}

export class VendorService {
  /**
   * Get vendors with optional filtering
   */
  static async getVendors(params: VendorParams = {}): Promise<Vendor[]> {
    try {
      const response = await API.get<Vendor[]>('/vendors', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  }
}
