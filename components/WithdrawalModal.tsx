"use client";
import { useState } from "react";
import { Wallet, X } from "lucide-react";
import API from "@/utils/userAxios";

export default function WithdrawalModal({
    balance,
    setIsWithdrawalModalOpen,
    setSuccessModalOpen,
}: {
    balance?: number;
    setIsWithdrawalModalOpen: (isOpen: boolean) => void;
    setSuccessModalOpen: (isOpen: boolean) => void;
}) {
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Loading state
    // const balance = 1000000; // Example balance
    const minimumWithdrawal = 1000;

    const isWithdrawDisabled =
        amount === "" ||
        parseFloat(amount.replace(/[^0-9.]/g, "")) > balance! ||
        parseFloat(amount.replace(/[^0-9.]/g, "")) < minimumWithdrawal;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
        setAmount(inputValue ? `₦${parseInt(inputValue).toLocaleString()}` : "");
    };

    const handleWithdraw = async () => {
        if (!isWithdrawDisabled) {
            setIsLoading(true); // Set loading state to true
            try {
                // Simulate API call or withdrawal logic
                const response = await API.post("/vendors/withdraw", {
                    amount: parseFloat(amount.replace(/[^0-9.]/g, "")),
                })
                if (response.status === 200) {
                    // Handle successful withdrawal
                    setSuccessModalOpen(true); // Open success modal on success
                    console.log("Withdrawal successful:", response.data);
                    setAmount(""); // Reset amount input
                }
                setIsWithdrawalModalOpen(false); // Close withdrawal modal
            } catch (error) {
                console.error("Withdrawal failed:", error); // Handle error
            } finally {
                setIsLoading(false); // Reset loading state
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl w-full max-w-lg relative max-h-[90vh] flex flex-col">
                    <button
                        onClick={() => setIsWithdrawalModalOpen(false)}
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 z-10 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8 overflow-y-auto flex-1 scrollbar-hide">
                        <style jsx global>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                            .scrollbar-hide {
                                -ms-overflow-style: none; /* IE and Edge */
                                scrollbar-width: none; /* Firefox */
                            }
                        `}</style>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wallet className="w-8 h-8 text-gray-600" />
                            </div>
                            <h2 className="text-2xl font-semibold mb-2">Withdraw Funds</h2>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Amounts
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={amount}
                                    placeholder="₦0.00"
                                    onChange={handleAmountChange}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 text-lg font-medium"
                                />
                                <div className="absolute right-4 top-3 px-3 py-1 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600">
                                        Balance: ₦{balance?.toLocaleString() || "N/A"}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Minimum withdrawal: ₦{minimumWithdrawal.toLocaleString()}
                            </p>
                        </div>

                        <div className="mb-6 bg-gray-50 rounded-xl p-4">
                            <p className="text-sm font-medium text-gray-600 mb-3">
                                Bank Account Details
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Account Number:</span>
                                    <span className="font-medium">1234567890</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Account Name:</span>
                                    <span className="font-medium">John Doe</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Bank Name:</span>
                                    <span className="font-medium">Example Bank</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Withdrawal Fee (12%):</span>
                                <span className="font-medium">
                                    ₦{((parseFloat(amount.replace(/[^0-9.]/g, "")) || 0) * 0.12).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">You&apos;ll Receive:</span>
                                <span className="font-medium">
                                    ₦{(
                                        (parseFloat(amount.replace(/[^0-9.]/g, "")) || 0) * 0.88
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-0">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsWithdrawalModalOpen(false)}
                                className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isWithdrawDisabled || isLoading}
                                onClick={handleWithdraw}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium text-white transition-colors ${
                                    isWithdrawDisabled || isLoading
                                        ? "bg-blue-300 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600"
                                }`}
                            >
                                {isLoading ? "Processing..." : "Withdraw"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
