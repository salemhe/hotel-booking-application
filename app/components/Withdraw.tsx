"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import WithdrawalModal from "./WithdrawalModal";
import { useRouter } from "next/navigation";
import { Wallet, X } from "lucide-react";
import { AuthService } from "@/lib/api/services/auth.service";
import API from "@/lib/api/axios";

const user = AuthService.getUser();

const Withdraw = () => {
  const router = useRouter();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [balance, setBalance] = useState();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await API.get("/vendors/balance");
        setBalance(response.data.balance);
      } catch (error) {
        console.error(error);
        alert("something went wrong");
      }
    };
    fetchBalance();
  }, []);
  const handleWithdraw = () => {
    console.log("Payment details", user?.profile.paymentDetails)
    if (!user?.profile.paymentDetails.recipientCode) {
      toast.error("Please add your bank information to withdraw funds.");
      // router.push("/vendorDashboard/setting/payments");
      return;
    }
    setIsWithdrawalModalOpen(true);
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6 border border-gray-200 no-scroll-bar">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Available Balance
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {balance! > -1 ? `₦${balance}` : "N/A"}
          </p>
        </div>
        <Button
          onClick={handleWithdraw}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 cursor-pointer transition-all duration-300 ring-blue-700 ring-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Withdraw
        </Button>
      </div>
      {isWithdrawalModalOpen && (
        <WithdrawalModal
          balance={balance}
          setSuccessModalOpen={setSuccessModalOpen}
          setIsWithdrawalModalOpen={setIsWithdrawalModalOpen}
        />
      )}
      {successModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-8 relative">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Withdrawal Successful
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Your withdrawal request has been successfully submitted.
            </p>
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                toast.success("Withdrawal request submitted successfully.");
                router.refresh();
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
