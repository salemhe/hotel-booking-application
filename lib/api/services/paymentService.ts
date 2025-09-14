interface PaymentInitializeRequest {
  email: string;
  amount: string;
  vendorId: string;
}

interface VendorPaymentSetup {
  businessName: string;
  bankCode: string;
  accountNumber: string;
  percentageCharge: number;
}

export const paymentService = {
  async initializePayment(data: PaymentInitializeRequest) {
    try {
      const response = await fetch('/api/users/make-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  async verifyPayment(reference: string) {
    try {
      const response = await fetch('/api/users/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reference })
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async saveVendorPaymentDetails(data: VendorPaymentSetup) {
    try {
      const response = await fetch('/api/vendors/save-payment', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result.data;
    } catch (error) {
      throw error;
    }
  }
};