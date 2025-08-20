import { getSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';

// Enhanced API service with better error handling and token management
class EnhancedApiService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];

  private async getAuthHeaders() {
    try {
      const session = await getSession();
      
      if (!session?.accessToken) {
        console.warn('No access token found in session');
        throw new Error('No authentication token available');
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      };

      return headers;
    } catch (error) {
      console.error('Error getting auth headers:', error);
      throw error;
    }
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'An error occurred', 
        status: response.status 
      }));
      
      // Handle specific HTTP status codes
      switch (response.status) {
        case 401:
          console.error('Unauthorized - Token may be expired');
          // Redirect to login or refresh token
          throw new Error('Authentication required. Please log in again.');
        case 403:
          console.error('Forbidden - Insufficient permissions');
          throw new Error('You do not have permission to access this resource.');
        case 404:
          console.error('Resource not found');
          throw new Error('The requested resource was not found.');
        case 500:
          console.error('Server error');
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
    }
    
    return response.json();
  }

  private async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Authentication required')) {
        // Handle token refresh or redirect
        console.error('Authentication error:', error);
        // You could implement token refresh here
        throw error;
      }
      throw error;
    }
  }

  // Dashboard API endpoints
  async getDashboardStats() {
    return this.makeAuthenticatedRequest(`${this.baseURL}/api/dashboard/stats`);
  }

  async getHotelRevenueBreakdown(period: string = 'weekly') {
    return this.makeAuthenticatedRequest(
      `${this.baseURL}/api/dashboard/hotel/revenue-breakdown?period=${period}`
    );
  }

  async getReservationTrends(period: string = 'weekly') {
    return this.makeAuthenticatedRequest(
      `${this.baseURL}/api/dashboard/trends?period=${period}`
    );
  }

  async getTodayReservations() {
    return this.makeAuthenticatedRequest(`${this.baseURL}/api/dashboard/reservations/today`);
  }

  // Branch API endpoints
  async getBranches(params?: Record<string, unknown>) {
    const url = new URL(`${this.baseURL}/api/super-admin/branches`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.makeAuthenticatedRequest(url.toString());
  }

  async createBranch(branchData: Record<string, unknown>) {
    return this.makeAuthenticatedRequest(`${this.baseURL}/api/super-admin/branches`, {
      method: 'POST',
      body: JSON.stringify(branchData),
    });
  }

  async updateBranch(id: string, branchData: Record<string, unknown>) {
    return this.makeAuthenticatedRequest(`${this.baseURL}/api/super-admin/branches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(branchData),
    });
  }

  async deleteBranch(id: string) {
    return this.makeAuthenticatedRequest(`${this.baseURL}/api/super-admin/branches/${id}`, {
      method: 'DELETE',
    });
  }

  // Hotel specific API endpoints
  async getRoomAvailability(startDate: string, endDate: string) {
    return this.makeAuthenticatedRequest(
      `${this.baseURL}/api/hotel/rooms/availability?startDate=${startDate}&endDate=${endDate}`
    );
  }

  async getRoomTypes() {
    return this.makeAuthenticatedRequest(`${this.baseURL}/api/hotel/room-types`);
  }

  async getHotelBookings(status?: string) {
    const url = status 
      ? `${this.baseURL}/api/hotel/bookings?status=${status}` 
      : `${this.baseURL}/api/hotel/bookings`;
    return this.makeAuthenticatedRequest(url);
  }

  // Restaurant specific API endpoints
  async getMenuCategories() {
    return this.makeAuthenticatedRequest(`${this.baseURL}/api/restaurant/menu/categories`);
  }

  async getMenuItems(categoryId?: number) {
    const url = categoryId 
      ? `${this.baseURL}/api/restaurant/menu/items?categoryId=${categoryId}` 
      : `${this.baseURL}/api/restaurant/menu/items`;
    return this.makeAuthenticatedRequest(url);
  }

  async getRestaurantReservations(status?: string) {
    const url = status 
      ? `${this.baseURL}/api/restaurant/reservations?status=${status}` 
      : `${this.baseURL}/api/restaurant/reservations`;
    return this.makeAuthenticatedRequest(url);
  }

  // Common API endpoints
  async getUpcomingReservations() {
    return this.makeAuthenticatedRequest(`${this.baseURL}/api/reservations/upcoming`);
  }

  async getUserProfile() {
    return this.makeAuthenticatedRequest(`${this.baseURL}/api/user/profile`);
  }

  // Utility method to check if user is authenticated
  async isAuthenticated() {
    try {
      await this.getAuthHeaders();
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const enhancedApiService = new EnhancedApiService();
export default enhancedApiService;
