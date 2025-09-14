import { apiFetcher } from './fetcher';

// Mock data for development mode
const MOCK_DATA = {
  dashboardStats: {
    reservationsToday: 24,
    prepaidReservations: 16,
    expectedGuests: 78,
    pendingPayments: 45000,
    pendingPaymentsTrend: 5,
    reservationsTrend: 12,
    prepaidTrend: 8,
    guestsTrend: 15
  },
  todayReservations: [
    {
      id: "res123",
      customerName: "John Smith",
      customerInitials: "JS",
      date: new Date().toISOString(),
      time: "7:00 PM",
      guests: 4,
      status: "Confirmed"
    },
    {
      id: "res124",
      customerName: "Sarah Johnson",
      customerInitials: "SJ",
      date: new Date().toISOString(),
      time: "8:30 PM",
      guests: 2,
      status: "Pending"
    },
    {
      id: "res125",
      customerName: "Michael Davis",
      customerInitials: "MD",
      date: new Date().toISOString(),
      time: "6:15 PM",
      guests: 6,
      status: "Confirmed"
    }
  ],
  reservationTrends: {
    chartData: [
      { day: "Mon", value1: 12, value2: 10, value3: 8 },
      { day: "Tue", value1: 18, value2: 15, value3: 10 },
      { day: "Wed", value1: 15, value2: 12, value3: 9 },
      { day: "Thu", value1: 20, value2: 18, value3: 12 },
      { day: "Fri", value1: 25, value2: 22, value3: 15 },
      { day: "Sat", value1: 30, value2: 28, value3: 20 },
      { day: "Sun", value1: 28, value2: 25, value3: 18 }
    ]
  },
  customerFrequency: {
    newCustomers: 45,
    returningCustomers: 55,
    totalCustomers: 100
  },
  revenueByCategory: {
    categories: [
      { name: "Main Course", percentage: 45, amount: 315000, color: "bg-blue-500" },
      { name: "Desserts", percentage: 20, amount: 140000, color: "bg-green-500" },
      { name: "Beverages", percentage: 25, amount: 175000, color: "bg-yellow-500" },
      { name: "Appetizers", percentage: 10, amount: 70000, color: "bg-purple-500" }
    ]
  },
  reservationSources: {
    website: 60,
    mobile: 30,
    walkIn: 10,
    total: 100
  },
  upcomingReservations: [
    {
      id: "res126",
      customerName: "David Wilson",
      customerInitials: "DW",
      date: new Date().toISOString(),
      time: "6:30 PM",
      guests: 3,
      status: "Upcoming"
    }
  ]
};

/**
 * Helper function to handle API calls with mock data fallback
 * 
 * This function attempts to fetch data from the real API endpoint first.
 * If the API call fails, it falls back to mock data in development mode.
 * 
 * @param endpoint - The API endpoint to call (e.g. '/api/dashboard/stats')
 * @param mockData - Mock data to use if the API call fails
 * @returns The API response data or mock data if the call failed
 */
const apiCallWithMockFallback = async <T>(endpoint: string, mockData: T): Promise<T> => {
  // Log the API call for debugging
  console.log(`Calling API endpoint: ${endpoint}`);
  
  try {
    const result = await apiFetcher(endpoint);
    
    // Check if result is an error or empty
    if (result && typeof result === 'object') {
      if ('isError' in result && result.isError) {
        console.warn(`API error for ${endpoint}, using mock data`);
        // Only use mock data in development mode
        if (process.env.NODE_ENV === 'development') {
          return mockData;
        }
        // In production, return the error result
        return result as unknown as T;
      }
      
      // Check if response is an empty object
      if (Object.keys(result).length === 0) {
        console.warn(`Empty response for ${endpoint}, using mock data`);
        // Only use mock data in development mode
        if (process.env.NODE_ENV === 'development') {
          return mockData;
        }
      }
    }
    
    console.log(`Successfully received data from ${endpoint}`);
    return result;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    // Only use mock data in development mode
    if (process.env.NODE_ENV === 'development') {
      return mockData;
    }
    throw error;
  }
};

// Dashboard API endpoints
export const getDashboardStats = async () => {
  return apiCallWithMockFallback('/api/dashboard/stats', MOCK_DATA.dashboardStats);
};

export const getHotelRevenueBreakdown = async (period: string = 'weekly') => {
  // We don't have mock data for this yet, but using the same pattern
  return apiCallWithMockFallback(`/api/dashboard/hotel/revenue-breakdown?period=${period}`, {});
};

export const getReservationTrends = async (period: string = 'weekly') => {
  return apiCallWithMockFallback(`/api/dashboard/trends?period=${period}`, MOCK_DATA.reservationTrends);
};

export const getTodayReservations = async () => {
  return apiCallWithMockFallback('/api/dashboard/reservations/today', MOCK_DATA.todayReservations);
};

export const getCustomerFrequency = async (period: string = 'weekly') => {
  return apiCallWithMockFallback(`/api/dashboard/customers/frequency?period=${period}`, MOCK_DATA.customerFrequency);
};

export const getRevenueByCategory = async (period: string = 'weekly') => {
  return apiCallWithMockFallback(`/api/dashboard/revenue/by-category?period=${period}`, MOCK_DATA.revenueByCategory);
};

export const getReservationSources = async (period: string = 'weekly') => {
  return apiCallWithMockFallback(`/api/dashboard/reservations/sources?period=${period}`, MOCK_DATA.reservationSources);
};

// Branch API endpoints
export const getBranches = async () => {
  try {
    // Add fallback mock data if in development environment
    const result = await apiFetcher('/api/branches');
    
    // Check if we got an error response
    if (result && typeof result === 'object' && 'isError' in result && result.isError) {
      console.warn('Failed to fetch branches from API, using default data');
      
      // In development, provide mock data for better development experience
      if (process.env.NODE_ENV === 'development') {
        return [
          { id: 1, branchName: 'Main Branch', address: '123 Main St', city: 'New York', state: 'NY' },
          { id: 2, branchName: 'Downtown', address: '456 Market St', city: 'San Francisco', state: 'CA' },
        ];
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in getBranches service function:', error);
    
    // Return empty array as fallback
    return [];
  }
};

export const getBranchById = async (id: number) => {
  return apiFetcher(`/api/branches/${id}`);
};

export const createBranch = async (branchData: Record<string, unknown>) => {
  return apiFetcher('/api/branches', {
    method: 'POST',
    body: JSON.stringify(branchData),
  });
};

export const updateBranch = async (id: number, branchData: Record<string, unknown>) => {
  return apiFetcher(`/api/branches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(branchData),
  });
};

export const deleteBranch = async (id: number) => {
  return apiFetcher(`/api/branches/${id}`, {
    method: 'DELETE',
  });
};

// Hotel specific API endpoints
export const getRoomAvailability = async (startDate: string, endDate: string) => {
  return apiFetcher(`/api/hotel/rooms/availability?startDate=${startDate}&endDate=${endDate}`);
};

export const getRoomTypes = async () => {
  return apiFetcher('/api/hotel/room-types');
};

export const getHotelBookings = async (status?: string) => {
  const url = status ? `/api/hotel/bookings?status=${status}` : '/api/hotel/bookings';
  return apiFetcher(url);
};

// Restaurant specific API endpoints
export const getMenuCategories = async () => {
  return apiFetcher('/api/restaurant/menu/categories');
};

export const getMenuItems = async (categoryId?: number) => {
  const url = categoryId ? `/api/restaurant/menu/items?categoryId=${categoryId}` : '/api/restaurant/menu/items';
  return apiFetcher(url);
};

export const getRestaurantReservations = async (status?: string) => {
  const url = status ? `/api/restaurant/reservations?status=${status}` : '/api/restaurant/reservations';
  return apiFetcher(url);
};

// Common API endpoints
export const getUpcomingReservations = async () => {
  return apiCallWithMockFallback('/api/reservations/upcoming', MOCK_DATA.upcomingReservations);
};

export const getUserProfile = async () => {
  try {
    // Try to get the profile from the API
    const result = await apiFetcher('/api/user/profile');
    
    // Check if we got an error response or empty data
    if (result && typeof result === 'object') {
      if ('isError' in result && result.isError) {
        console.warn('Failed to fetch user profile from API, trying local fallback');
        // Try to get user info from localStorage as fallback
        if (typeof window !== 'undefined') {
          try {
            // Try to get the business name from localStorage
            const businessName = localStorage.getItem('businessName');
            const role = localStorage.getItem('user_role') || 'vendor';
            const userId = localStorage.getItem('userId');
            
            if (businessName) {
              console.log('Using local business name:', businessName);
              return {
                businessName,
                role,
                id: userId,
                email: localStorage.getItem('userEmail') || '',
                // Include other fields that might be used in the UI
                fromLocalStorage: true
              };
            }
          } catch (localStorageError) {
            console.error('Error reading from localStorage:', localStorageError);
          }
        }
        
        // In development, provide mock data for better development experience
        if (process.env.NODE_ENV === 'development') {
          return {
            businessName: 'Delicious Restaurant',
            role: 'vendor',
            id: '123',
            email: 'vendor@example.com',
            businessType: 'restaurant',
            onboarded: true,
            mockData: true
          };
        }
      } else if (Object.keys(result).length === 0) {
        // Handle empty object response
        console.warn('Received empty profile object');
        if (process.env.NODE_ENV === 'development') {
          return {
            businessName: 'Delicious Restaurant',
            role: 'vendor',
            id: '123',
            email: 'vendor@example.com',
            businessType: 'restaurant',
            onboarded: true,
            mockData: true
          };
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in getUserProfile service function:', error);
    
    // Provide fallback data to avoid UI breaking
    if (process.env.NODE_ENV === 'development') {
      return {
        businessName: 'Delicious Restaurant',
        role: 'vendor',
        id: '123',
        email: 'vendor@example.com',
        businessType: 'restaurant',
        onboarded: true,
        mockData: true
      };
    }
    
    return {};
  }
};
