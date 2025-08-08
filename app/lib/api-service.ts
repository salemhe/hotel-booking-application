import { apiFetcher } from './fetcher';

// Dashboard API endpoints
export const getDashboardStats = async () => {
  return apiFetcher('/api/dashboard/stats');
};

export const getHotelRevenueBreakdown = async (period: string = 'weekly') => {
  return apiFetcher(`/api/dashboard/hotel/revenue-breakdown?period=${period}`);
};

export const getReservationTrends = async (period: string = 'weekly') => {
  return apiFetcher(`/api/dashboard/trends?period=${period}`);
};

export const getTodayReservations = async () => {
  return apiFetcher('/api/dashboard/reservations/today');
};

export const getCustomerFrequency = async (period: string = 'weekly') => {
  return apiFetcher(`/api/dashboard/customers/frequency?period=${period}`);
};

export const getRevenueByCategory = async (period: string = 'weekly') => {
  return apiFetcher(`/api/dashboard/revenue/by-category?period=${period}`);
};

export const getReservationSources = async (period: string = 'weekly') => {
  return apiFetcher(`/api/dashboard/reservations/sources?period=${period}`);
};

// Branch API endpoints
export const getBranches = async () => {
  return apiFetcher('/api/branches');
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
  return apiFetcher('/api/reservations/upcoming');
};

export const getUserProfile = async () => {
  return apiFetcher('/api/user/profile');
};
