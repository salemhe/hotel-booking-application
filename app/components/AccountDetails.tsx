"use client";
// import React, { useEffect, useState } from "react";
// import { Button } from "./ui/button";
// import { toast } from "sonner";
// import WithdrawalModal from "./WithdrawalModal";
// import { useRouter } from "next/navigation";
// import { Wallet, X } from "lucide-react";
// import { AuthService } from "@/app/lib/api/services/auth.service";
// import API from "@/app/lib/api/axios";
// import { verifyBankAccount } from "../lib/action";

const AccountDetails = () => {
  // const user = AuthService.getUser();
  // const router = useRouter();
  // const [isVerifying, setIsVerifying] = useState(false);
  // const [accountName, setAccountName] = useState<string | null>("");

  // useEffect(() => {
  //   async function verifyAccount() {
  //     if (
  //       !user?.profile.paymentDetails.accountNumber ||
  //       !user?.profile.paymentDetails.bankCode
  //     ) {
  //       return;
  //     }

  //     setIsVerifying(true);
  //     setAccountName(null);

  //     try {
  //       const result = await verifyBankAccount(
  //         user?.profile.paymentDetails.accountNumber,
  //         user?.profile.paymentDetails.bankCode
  //       );

  //       if (result.status) {
  //         setAccountName(result.data?.account_name || null);
  //       } else {
  //         toast.error(result.message || "Could not verify account details");
  //       }
  //     } catch {
  //       toast.error(
  //         "An error occurred while verifying the account. Please try again."
  //       );
  //     } finally {
  //       setIsVerifying(false);
  //     }
  //   }
  //   verifyAccount();
  // }, []);
  // return (
  //   <div className="p-6 bg-white rounded-lg shadow-md mt-6 border border-gray-200 no-scroll-bar">
  //     <div className="flex items-center justify-between">
  //       <div>
  //         <h2 className="text-lg font-semibold text-gray-900">
  //           Available Balance
  //         </h2>
  //         <p className="text-3xl font-bold text-green-600">
  //           {balance! > -1 ? `₦${balance}` : "N/A"}
  //         </p>
  //       </div>
  //       <Button
  //         onClick={handleWithdraw}
  //         className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 cursor-pointer transition-all duration-300 ring-blue-700 ring-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
  //       >
  //         <Wallet className="w-4 h-4 mr-2" />
  //         Withdraw
  //       </Button>
  //     </div>
  //   </div>
  // );
};

export default AccountDetails;
