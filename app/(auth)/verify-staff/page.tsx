"use client";

import { useState, useEffect } from "react";
import {useSearchParams} from "next/navigation";
import { toast } from "react-toastify";


export default function StaffSetPassword() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const urlOTP = searchParams.get("otp");
  const email = searchParams.get("email") || ""; // Get email from query params
    useEffect(() => {
        if (urlOTP) {
        setOtp(urlOTP);
        }
    }, [urlOTP]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vendors/staff/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, password }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      setMessage("Password set successfully! You can now login.");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      toast.success("Password set successfully! You can now login.");
        window.location.href = "/staff-login";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      
      const parsedError = JSON.parse(err.message);
      setMessage(parsedError.message || "Something went wrong");
      toast.error(parsedError.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Set Your Password
        </h2>
        <p className="text-[14px] font-bold text-center text-gray-800 mb-6">
         Verify your staff account to access your dashboard.
        </p>

        {message && (
          <div className="mb-4 p-3 text-sm rounded-lg bg-gray-100 text-gray-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* OTP Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled
              required
              className="mt-1 block w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter the OTP sent to your email"
            />
          </div>

           
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
