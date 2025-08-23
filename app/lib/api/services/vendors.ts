// src/services/VendorService.ts
import API from '../axios';

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
      return response.data || [];
    } catch (error) {
      console.error('Error fetching vendors:', error);
      // Return mock data as fallback to prevent app from breaking
      return [
        {
          _id: "1",
          businessName: "Sample Restaurant",
          businessType: "restaurant",
          branch: "Main Branch",
          onboarded: true,
          address: "123 Main St, Lagos",
          email: "restaurant@example.com",
          phone: "1234567890",
          services: ["Dining", "Takeaway"],
          image: "/restaurant.jpg",
          profileImages: ["/restaurant.jpg"],
          description: "A great place to dine",
          rating: 4.5,
          reviews: ["Great food!"],
          featured: true,
          location: "Lagos, Nigeria"
        },
        {
          _id: "2",
          businessName: "Sample Hotel",
          businessType: "hotel",
          branch: "Main Branch",
          onboarded: true,
          address: "456 Hotel Ave, Lagos",
          email: "hotel@example.com",
          phone: "0987654321",
          services: ["Accommodation", "Room Service"],
          image: "/restaurant.jpg",
          profileImages: ["/restaurant.jpg"],
          description: "A comfortable stay",
          rating: 4.8,
          reviews: ["Excellent service!"],
          featured: true,
          location: "Lagos, Nigeria"
        }
      ];
    }
  }
}


// In your VendorService, make sure the endpoint is correct
