import { getSession } from 'next-auth/react';

// Create a proper API service with NextAuth integration
class ApiService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  private async getAuthHeaders() {
    const session = await getSession();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  }

  // Dashboard API endpoints
  async getDashboardStats() {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/api/dashboard/stats`, { headers });
    return this.handleResponse(response);
  }

  async getHotelRevenueBreakdown(period: string = 'weekly') {
    const headers = await this.getAuthHeaders();
    const response = await fetch(
      `${this.baseURL}/api/dashboard/hotel/revenue-breakdown?period=${period}`,
      { headers }
    );
    return this.handleResponse(response);
  }

  async getReservationTrends(period: string = 'weekly') {
    const headers = await this.getAuthHeaders();
    const response = await fetch(
      `${this.baseURL}/api/dashboard/trends?period=${period}`,
      { headers }
    );
    return this.handleResponse(response);
  }

  async getTodayReservations() {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/api/dashboard/reservations/today`, { headers });
    return this.handleResponse(response);
  }

  // Branch API endpoints
  async getBranches(params?: Record<string, unknown>) {
    const headers = await this.getAuthHeaders();
    const url = new URL(`${this.baseURL}/api/super-admin/branches`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), { headers });
    return this.handleResponse(response);
  }

  async createBranch(branchData: Record<string, unknown>) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/api/super-admin/branches`, {
      method: 'POST',
      headers,
      body: JSON.stringify(branchData),
    });
    return this.handleResponse(response);
  }

  async updateBranch(id: string, branchData: Record<string, unknown>) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/api/super-admin/branches/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(branchData),
    });
    return this.handleResponse(response);
  }

  async deleteBranch(id: string) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/api/super-admin/branches/${id}`, {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse(response);
  }

  // Hotel specific API endpoints
  async getRoomAvailability(startDate: string, endDate: string) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(
      `${this.baseURL}/api/hotel/rooms/availability?startDate=${startDate}&endDate=${endDate}`,
      { headers }
    );
    return this.handleResponse(response);
  }

  async getRoomTypes() {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/api/hotel/room-types`, { headers });
    return this.handleResponse(response);
  }

  async getHotelBookings(status?: string) {
    const headers = await this.getAuthHeaders();
    const url = status 
      ? `${this.baseURL}/api/hotel/bookings?status=${status}` 
      : `${this.baseURL}/api/hotel/bookings`;
    const response = await fetch(url, { headers });
    return this.handleResponse(response);
  }

  // Restaurant specific API endpoints
  async getMenuCategories() {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/api/restaurant/menu/categories`, { headers });
    return this.handleResponse(response);
  }

  async getMenuItems(categoryId?: number) {
    const headers = await this.getAuthHeaders();
    const url = categoryId 
      ? `${this.baseURL}/api/restaurant/menu/items?categoryId=${categoryId}` 
      : `${this.baseURL}/api/restaurant/menu/items`;
    const response = await fetch(url, { headers });
    return this.handleResponse(response);
  }

  async getRestaurantReservations(status?: string) {
    const headers = await this.getAuthHeaders();
    const url = status 
      ? `${this.baseURL}/api/restaurant/reservations?status=${status}` 
      : `${this.baseURL}/api/restaurant/reservations`;
    const response = await fetch(url, { headers });
    return this.handleResponse(response);
  }

  // Common API endpoints
  async getUpcomingReservations() {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/api/reservations/upcoming`, { headers });
    return this.handleResponse(response);
  }

  async getUserProfile() {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseURL}/api/user/profile`, { headers });
    return this.handleResponse(response);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
