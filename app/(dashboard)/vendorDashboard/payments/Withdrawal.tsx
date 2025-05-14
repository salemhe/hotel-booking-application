"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Withdrawals = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch withdrawal history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get("/api/vendor/payment/withdrawals");
        setHistory(data.withdrawals || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load withdrawal history.");
      }
    };

    fetchHistory();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/vendor/payment/withdraw", {
        amount: Number(amount),
      });

      toast.success(data.message || "Withdrawal requested!");
      setAmount("");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Withdrawal request failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      {/* Withdrawal Form */}
      <div className="p-6 bg-white shadow-md rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
        <form onSubmit={handleWithdraw} className="flex space-x-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (₦)"
            className="flex-1 border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
        </form>
      </div>

      {/* Withdrawal History Table */}
      <div className="p-6 bg-white shadow-md rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Withdrawal History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No withdrawals yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Amount (₦)</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((w, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{new Date(w.createdAt).toLocaleString()}</td>
                  <td className="p-2">{(w.amount / 100).toLocaleString()}</td>
                  <td className="p-2 capitalize">{w.status || "pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Withdrawals;
