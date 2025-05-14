"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BankDetailsForm = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing bank details
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const { data } = await axios.get("/api/vendor/payment/bank-details");
        if (data) {
          setAccountName(data.accountName || "");
          setAccountNumber(data.accountNumber || "");
          setBankName(data.bankName || "");
        }
      } catch (error) {
        console.error(error);
        toast.error("Could not load bank details.");
      }
    };

    fetchBankDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountNumber || !bankName || !accountName) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/vendor/payment/bank-details", {
        accountNumber,
        bankName,
        accountName,
      });
      toast.success("Bank details updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update bank details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Account Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Details"}
        </button>
      </form>
    </div>
  );
};

export default BankDetailsForm;
