import API from "../axios";

async function preflightAuth() {
  try {
    if (typeof window === 'undefined') return;
    const token =
      localStorage.getItem('auth_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('vendor-token');
    if (token) {
      await API.post('auth/set-vendor-token', { token });
    }
  } catch (e) {
    // non-fatal
  }
}

export const DashboardService = {
  async getPayments(vendorId: string) {
    await preflightAuth();
    const response = await API.get(`/payments?vendorId=${vendorId}`);
    return response.data;
  },
  async getBranches(vendorId: string) {
    await preflightAuth();
    const response = await API.get(`/branches?vendorId=${vendorId}`);
    return response.data;
  },
  async getStaff(vendorId: string) {
    await preflightAuth();
    const response = await API.get(`/staff?vendorId=${vendorId}`);
    return response.data;
  },
};
