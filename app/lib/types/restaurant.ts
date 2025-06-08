export type Restaurant = {
  _id: string;
  name: string;
  businessName: string;
  businessDescription: string;
  email: string;
  phone: string;
  address: string;
  // branch: string;
  // role: string;
  profileImage: string;
  // services: string[];
  // price: string;
  // rating: number;
  businessType: string;
  branch: string;
  role: string;
  profileImages: string[];
  services: string[];

  paymentDetails: {
    bankAccountName: string;
    bankName: string;
    bankCode: string;
    accountNumber: string;
    recipientCode: string;
  };
  percentageCharge: number;
  balance: number;
  isVerified: boolean;
  createdAt: string;
};
