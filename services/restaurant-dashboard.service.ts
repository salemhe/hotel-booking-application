import { apiFetcher } from '@/lib/fetcher';

// Type definitions for restaurant dashboard data
export interface RestaurantStats {
  reservationsToday: number;
  prepaidReservations: number;
  expectedGuests: number;
  pendingPayments: number;
  pendingPaymentsTrend: number;
  reservationsTrend: number;
  prepaidTrend: number;
  guestsTrend: number;
  totalRevenue: number;
  averageOrderValue: number;
  tableTurnoverRate: number;
}

export interface RestaurantReservation {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAvatar?: string;
  customerInitials?: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  tableNumber?: string;
  specialRequests?: string;
  prepaidAmount?: number;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationTrend {
  day: string;
  reservations: number;
  revenue: number;
  guests: number;
}

export interface CustomerFrequency {
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
  newCustomerPercentage: number;
  returningCustomerPercentage: number;
}

export interface RevenueByCategory {
  name: string;
  percentage: number;
  amount: number;
  color: string;
  itemsSold: number;
}

export interface ReservationSource {
  website: number;
  mobile: number;
  walkIn: number;
  phone: number;
  total: number;
}

export interface RealTimeUpdate {
  type: 'stats_update' | 'new_reservation' | 'reservation_update' | 'reservation_cancelled';
  data: unknown;
  timestamp: number;
}

// Restaurant Dashboard API Service
class RestaurantDashboardService {
  private baseUrl = '/api/restaurant/dashboard';
  private wsUrl = process.env.NEXT_PUBLIC_WS_ENDPOINT || 'ws://localhost:3001';
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Array<(data: unknown) => void>> = new Map();

  /**
   * Get restaurant dashboard stats for the authenticated vendor
   */
  async getStats(restaurantId?: string): Promise<RestaurantStats> {
    const endpoint = restaurantId 
      ? `${this.baseUrl}/stats?restaurantId=${restaurantId}`
      : `${this.baseUrl}/stats`;
    
    const response = await apiFetcher(endpoint);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch restaurant stats');
    }
    
    return response || {
      reservationsToday: 0,
      prepaidReservations: 0,
      expectedGuests: 0,
      pendingPayments: 0,
      pendingPaymentsTrend: 0,
      reservationsTrend: 0,
      prepaidTrend: 0,
      guestsTrend: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      tableTurnoverRate: 0
    };
  }

  /**
   * Get today's reservations for the restaurant
   */
  async getTodayReservations(restaurantId?: string): Promise<RestaurantReservation[]> {
    const endpoint = restaurantId 
      ? `${this.baseUrl}/reservations/today?restaurantId=${restaurantId}`
      : `${this.baseUrl}/reservations/today`;
    
    const response = await apiFetcher(endpoint);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch today\'s reservations');
    }
    
    return response || [];
  }

  /**
   * Get upcoming reservations (next 24 hours)
   */
  async getUpcomingReservations(restaurantId?: string): Promise<RestaurantReservation[]> {
    const endpoint = restaurantId 
      ? `${this.baseUrl}/reservations/upcoming?restaurantId=${restaurantId}`
      : `${this.baseUrl}/reservations/upcoming`;
    
    const response = await apiFetcher(endpoint);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch upcoming reservations');
    }
    
    return response || [];
  }

  /**
   * Get reservation trends for analytics
   */
  async getReservationTrends(period: string = 'weekly', restaurantId?: string): Promise<ReservationTrend[]> {
    const endpoint = restaurantId 
      ? `${this.baseUrl}/trends?period=${period}&restaurantId=${restaurantId}`
      : `${this.baseUrl}/trends?period=${period}`;
    
    const response = await apiFetcher(endpoint);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch reservation trends');
    }
    
    return response?.chartData || [];
  }

  /**
   * Get customer frequency data
   */
  async getCustomerFrequency(period: string = 'weekly', restaurantId?: string): Promise<CustomerFrequency> {
    const endpoint = restaurantId 
      ? `${this.baseUrl}/customers/frequency?period=${period}&restaurantId=${restaurantId}`
      : `${this.baseUrl}/customers/frequency?period=${period}`;
    
    const response = await apiFetcher(endpoint);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch customer frequency');
    }
    
    return response || {
      newCustomers: 0,
      returningCustomers: 0,
      totalCustomers: 0,
      newCustomerPercentage: 0,
      returningCustomerPercentage: 0
    };
  }

  /**
   * Get revenue breakdown by menu category
   */
  async getRevenueByCategory(period: string = 'weekly', restaurantId?: string): Promise<RevenueByCategory[]> {
    const endpoint = restaurantId 
      ? `${this.baseUrl}/revenue/by-category?period=${period}&restaurantId=${restaurantId}`
      : `${this.baseUrl}/revenue/by-category?period=${period}`;
    
    const response = await apiFetcher(endpoint);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch revenue by category');
    }
    
    return response?.categories || [];
  }

  /**
   * Get reservation sources analytics
   */
  async getReservationSources(period: string = 'weekly', restaurantId?: string): Promise<ReservationSource> {
    const endpoint = restaurantId 
      ? `${this.baseUrl}/reservations/sources?period=${period}&restaurantId=${restaurantId}`
      : `${this.baseUrl}/reservations/sources?period=${period}`;
    
    const response = await apiFetcher(endpoint);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch reservation sources');
    }
    
    return response || {
      website: 0,
      mobile: 0,
      walkIn: 0,
      phone: 0,
      total: 0
    };
  }

  /**
   * Get restaurant details
   */
  async getRestaurantDetails(restaurantId?: string): Promise<unknown> {
    const endpoint = restaurantId 
      ? `${this.baseUrl}/restaurant/${restaurantId}`
      : `${this.baseUrl}/restaurant`;
    
    const response = await apiFetcher(endpoint);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch restaurant details');
    }
    
    return response || {};
  }

  /**
   * WebSocket connection for real-time updates
   */
  connectWebSocket(restaurantId?: string) {
    if (typeof window === 'undefined') return null;

    const wsEndpoint = `${this.wsUrl}/restaurant-dashboard${restaurantId ? `?restaurantId=${restaurantId}` : ''}`;
    
    try {
      this.ws = new WebSocket(wsEndpoint);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected for restaurant dashboard');
        this.reconnectAttempts = 0;
        
        // Subscribe to restaurant-specific channels
        if (restaurantId) {
          this.ws?.send(JSON.stringify({
            action: 'subscribe',
            channels: [`restaurant_${restaurantId}_stats`, `restaurant_${restaurantId}_reservations`]
          }));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const update: RealTimeUpdate = JSON.parse(event.data);
          this.notifyListeners(update.type, update.data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.handleReconnection(restaurantId);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return this.ws;
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
      return null;
    }
  }

  /**
   * Handle WebSocket reconnection
   */
  private handleReconnection(restaurantId?: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting WebSocket reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket(restaurantId);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  /**
   * Add event listener for real-time updates
   */
  addEventListener(eventType: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(eventType: string, callback: (data: unknown) => void) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Notify listeners of real-time updates
   */
  private notifyListeners(eventType: string, data: unknown) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  /**
   * Get current restaurant ID from localStorage or context
   */
  private getCurrentRestaurantId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    try {
      // Try to get restaurant ID from localStorage
      const restaurantId = localStorage.getItem('currentRestaurantId');
      if (restaurantId) return restaurantId;
      
      // Fallback to user profile
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        return profile.restaurantId || profile.businessId;
      }
      
      return undefined;
    } catch (error) {
      console.error('Error getting restaurant ID:', error);
      return undefined;
    }
  }
}

// Create singleton instance
const restaurantDashboardService = new RestaurantDashboardService();

export default restaurantDashboardService;
