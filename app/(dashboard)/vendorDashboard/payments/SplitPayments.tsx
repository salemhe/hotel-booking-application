"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SplitPayments = () => {
  const [platformPercentage, setPlatformPercentage] = useState(20); // default
  const [vendorPercentage, setVendorPercentage] = useState(80);
  const [loading, setLoading] = useState(false);

  // Fetch existing split config
  useEffect(() => {
    const fetchSplitConfig = async () => {
      try {
        const { data } = await axios.get("/api/vendor/payment/split-config");
        setPlatformPercentage(data.platformShare || 20);
        setVendorPercentage(100 - (data.platformShare || 20));
      } catch (error) {
        console.error("Failed to fetch split config", error);
        toast.error("Could not load split configuration.");
      }
    };

    fetchSplitConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (platformPercentage + vendorPercentage !== 100) {
      toast.error("Total split must equal 100%");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/vendor/payment/split-config", {
        platformShare: platformPercentage,
        vendorShare: vendorPercentage,
      });
      toast.success("Split configuration saved!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save split config.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Split Payments Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Platform Share (%)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={platformPercentage}
            onChange={(e) => setPlatformPercentage(Number(e.target.value))}
            required
            min={0}
            max={100}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Vendor Share (%)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={vendorPercentage}
            onChange={(e) => setVendorPercentage(Number(e.target.value))}
            required
            min={0}
            max={100}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save Configuration"}
        </button>
      </form>
    </div>
  );
};

export default SplitPayments;
