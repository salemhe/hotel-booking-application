"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post("/api/vendor/payment/verify", {
          reference,
        });
        if (response.data.status === "success") {
          toast.success("Payment verified successfully!");
          setStatus("Payment successful!");
        } else {
          toast.error("Payment verification failed.");
          setStatus("Verification failed.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error verifying payment.");
        setStatus("Error occurred.");
      }
    };

    if (reference) {
      verifyPayment();
    }
  }, [reference]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-2xl text-center">
      <h2 className="text-xl font-semibold mb-2">Payment Status</h2>
      <p>{status}</p>
    </div>
  );
};

export default PaymentSuccess;
