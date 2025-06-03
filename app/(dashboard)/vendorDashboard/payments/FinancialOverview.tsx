"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";

const FinancialOverview = () => {
  const [data, setData] = useState({
    totalEarnings: 0,
    pendingBalance: 0,
    totalWithdrawn: 0,
    ordersCompleted: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get("/api/vendor/payment/overview");
        setData(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load financial data");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) return <p>Loading financial data...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm text-gray-500">Total Earnings</h3>
          <p className="text-xl font-semibold text-green-600">₦{data.totalEarnings.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm text-gray-500">Pending Balance</h3>
          <p className="text-xl font-semibold text-yellow-600">₦{data.pendingBalance.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm text-gray-500">Withdrawn</h3>
          <p className="text-xl font-semibold text-blue-600">₦{data.totalWithdrawn.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm text-gray-500">Orders Completed</h3>
          <p className="text-xl font-semibold text-purple-600">{data.ordersCompleted}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverview;
