import API from "../axios";

export const DashboardService = {
  async getPayments(vendorId: string) {
    const response = await API.get(`/payments?vendorId=${vendorId}`);
    return response.data;
  },
  async getBranches(vendorId: string) {
    const response = await API.get(`/branches?vendorId=${vendorId}`);
    return response.data;
  },
  async getStaff(vendorId: string) {
    const response = await API.get(`/staff?vendorId=${vendorId}`);
    return response.data;
  },
};
