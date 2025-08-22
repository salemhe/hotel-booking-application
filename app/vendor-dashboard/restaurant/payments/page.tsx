"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Edit,
  Plus,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Filter,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

// 🔹 Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
 import { AuthService } from "@/app/lib/api/services/userAuth.service";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800";
    case "Partly paid":
      return "bg-yellow-100 text-yellow-800";
    case "Current":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface Account {
  id: string;
  bankName: string;
  accountNumber: string;
  type: string;
  accountName: string;
  bankLogoUrl?: string;
}

interface Stats {
  totalEarnings?: number;
  earningsVsLastYear?: string;
  earningsThisWeek?: number;
  earningsVsLastWeek?: string;
  completedPayments?: number;
  completedVsLastWeek?: string;
  pendingPayments?: number;
  pendingVsLastWeek?: string;
  availableBalance?: number;
  lastPaymentProcessed?: string;
  chartData?: ChartData[];
}

interface Transaction {
  date: string;
  transactionId: string;
  customer: string;
  branch: string;
  method: string;
  status: string;
}

interface ChartData {
  name: string;
  value: number;
}

export default function RestaurantPayments() {
  // Real-time state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [vendor, setVendor] = useState<{ businessName?: string; role?: string; profileImage?: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [accountForm, setAccountForm] = useState<Account>({ bankName: '', accountNumber: '', type: 'savings', id: '', accountName: '', bankLogoUrl: '' });
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [stats, setStats] = useState<Stats>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchAll();
    const fetchVendor = async () => {
      try {
        if (await AuthService.isAuthenticated()) {
          const token = await AuthService.getToken();
          const id = AuthService.extractUserId(token!);
          const profile = await AuthService.fetchMyProfile(id!);
          setVendor(profile);
        }
      } catch {
        setVendor(null);
      }
    };
    fetchVendor();
  }, []);
  const fetchAll = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const [accRes, statsRes, transRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors/accounts`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors/payments/stats`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors/payments/transactions`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).then(r => r.json()),
      ]);
      // Defensive: ensure accounts is always an array
      const accountsArray = Array.isArray(accRes) ? accRes : (accRes?.accounts || []);
      setAccounts(accountsArray);
      setStats(statsRes);
      // Defensive: ensure transactions is always an array
      const transactionsArray = Array.isArray(transRes) ? transRes : (transRes?.transactions || []);
      setTransactions(transactionsArray);
      setChartData(statsRes.chartData || []);
      console.log("accounts from API:", accRes);
      console.log("transactions from API:", transRes);
    } catch {}
  };

  const verifyAccount = async (accountNumber: string) => {
    setVerifying(true);
    setVerifyError('');
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token2 = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const res = await fetch(`${BASE_URL}/api/vendor/accounts/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token2 ? { Authorization: `Bearer ${token2}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ accountNumber })
      });
      const data = await res.json();
      if (data.accountName) {
        setAccountForm(f => ({ ...f, accountName: data.accountName, bankLogoUrl: data.bankLogoUrl }));
      } else {
        setVerifyError("Account verification failed");
      }
    } catch {
      setVerifyError("Account verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const saveAccount = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    try {
      if (accountForm.id) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors/accounts/${accountForm.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify(accountForm)
        });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors/accounts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify(accountForm)
        });
      }
      setShowEditModal(false);
      setShowAddModal(false);
      setAccountForm({ bankName: '', accountNumber: '', type: 'savings', id: '', accountName: '', bankLogoUrl: '' });
      fetchAll();
    } catch {}
  };

  const AccountCard = ({ account }: { account: Account }) => (
    // <Card className="relative overflow-hidden mb-4">
    //   <CardHeader>
    //     <div className="flex items-center justify-between">
    //       <div className="flex items-center gap-3">
    //         {account.bankLogoUrl && <img src={account.bankLogoUrl} alt={account.bankName} className="w-10 h-10 rounded" />}
    //         <div>
    //           <div className="font-semibold text-lg">{account.accountName}</div>
    //           <div className="text-sm text-gray-400">{account.bankName} ({account.type})</div>
    //         </div>
    //       </div>
    //       <div className="flex gap-2">
    //         <Button variant="ghost" size="sm" onClick={() => { setAccountForm(account); setShowEditModal(true); }}>
    //           <Edit className="h-4 w-4" />
    //         </Button>
    //         <Button variant="ghost" size="sm" onClick={() => { setAccountForm({ bankName: '', accountNumber: '', type: 'savings', id: '', accountName: '', bankLogoUrl: '' }); setShowAddModal(true); }}>
    //           <Plus className="h-4 w-4" />
    //         </Button>
    //       </div>
    //     </div>
    //   </CardHeader>
    //   <CardContent>
    //     <div className="text-lg font-mono mb-1">••••••{account.accountNumber.slice(-4)}</div>
    //     <div className="text-xs text-gray-500">{account.accountNumber}</div>
    //   </CardContent>
    // </Card>
    <div className="w-[340px] h-[120px] bg-[#1c1c1c] text-white rounded-[16px] p-5 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          {account.bankLogoUrl && (
            <img
              src={account.bankLogoUrl}
              alt={account.bankName}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div className="flex flex-col">
            <div className="text-[1.1rem] font-bold text-[#F9FAFB]">
              {account.bankName}
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-[#F4F4F4]">
              {/* Active SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#4ade80">
                <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.4-1.4z"/>
              </svg>
              Verified Account
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className="inline-flex items-center h-8 px-2 bg-[#606368] text-[#F9FAFB] text-sm rounded-md"
            onClick={() => {
              setAccountForm(account);
              setShowEditModal(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clip-path="url(#clip0_1291_2912)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9366 2.52509C13.6241 2.21264 13.2002 2.03711 12.7583 2.03711C12.3164 2.03711 11.8925 2.21264 11.58 2.52509L2.98498 11.1201C2.67239 11.4326 2.49674 11.8564 2.49664 12.2984V16.6593C2.49664 17.1234 2.87414 17.5009 3.33831 17.5009L16.6666 17.5001C16.8877 17.5001 17.0996 17.4123 17.2559 17.256C17.4122 17.0997 17.5 16.8878 17.5 16.6668C17.5 16.4457 17.4122 16.2338 17.2559 16.0775C17.0996 15.9212 16.8877 15.8334 16.6666 15.8334H10.0566L17.4725 8.41759C17.7849 8.10504 17.9605 7.68119 17.9605 7.23925C17.9605 6.79731 17.7849 6.37347 17.4725 6.06092L13.9366 2.52509ZM7.69998 15.8334L16.2941 7.23925L12.7583 3.70342L4.16331 12.2984V15.8334H7.69998Z" fill="#F9FAFB"/>
              </g>
              <defs>
                <clipPath id="clip0_1291_2912">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            Edit
          </button>
          <Button
            className="inline-flex items-center h-8 px-2 bg-[#606368] text-[#F9FAFB] text-sm rounded-md"
            onClick={() => {
              setAccountForm({
                bankName: "",
                accountNumber: "",
                type: "savings",
                id: "",
                accountName: "",
                bankLogoUrl: "",
              });
              setShowAddModal(true);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        <div className="text-lg font-mono text-[#F4F4F4] mb-1">
          *****{account.accountNumber.slice(-4)}
        </div>
        <div className="text-sm text-[#F4F4F4]">
          {account.accountName}
        </div>
      </div>
    </div>

  );

  // Static list of Nigerian commercial and microfinance banks
  const NIGERIAN_BANKS = useMemo(() => [
    // Commercial Banks
    "Access Bank",
    "Citibank",
    "Ecobank Nigeria",
    "Fidelity Bank",
    "First Bank of Nigeria",
    "First City Monument Bank (FCMB)",
    "Globus Bank",
    "Guaranty Trust Bank (GTB)",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank",
    "Sterling Bank",
    "Suntrust Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa (UBA)",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank",
    // Major Microfinance Banks
    "AB Microfinance Bank",
    "Accion Microfinance Bank",
    "Addosser Microfinance Bank",
    "Baobab Microfinance Bank",
    "Boctrust Microfinance Bank",
    "Fina Trust Microfinance Bank",
    "Infinity Microfinance Bank",
    "LAPO Microfinance Bank",
    "Mainstreet Microfinance Bank",
    "Mutual Trust Microfinance Bank",
    "Parallex Microfinance Bank",
    "Rephidim Microfinance Bank",
    "Opay",
    "Palmpay",
    "MoniePoint",
    "Kuda",
    "FairMoney",
    "VFD Microfinance Bank"
  ], []);
  const [bankSearch, setBankSearch] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const filteredBanks = useMemo(() =>
    NIGERIAN_BANKS.filter(b => b.toLowerCase().includes(bankSearch.toLowerCase())),
    [NIGERIAN_BANKS, bankSearch]
  );

  // Controlled input for account number
  const [accountNumberInput, setAccountNumberInput] = useState("");

  useEffect(() => {
    setAccountNumberInput(accountForm.accountNumber);
  }, [accountForm.accountNumber]);

  const AccountModal = ({ open, onClose, isEdit }: { open: boolean, onClose: () => void, isEdit: boolean }) => (
    open ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
          <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Account" : "Add Account"}</h2>
          <div className="space-y-4">
            {/* Modern Searchable Nigerian Banks Dropdown */}
            <div className="relative">
              <Input
                placeholder="Search or select bank..."
                value={bankSearch || accountForm.bankName}
                onChange={e => {
                  setBankSearch(e.target.value);
                  setShowBankDropdown(true);
                  setAccountForm(f => ({ ...f, bankName: e.target.value }));
                }}
                onFocus={() => setShowBankDropdown(true)}
                className="mb-2"
                autoComplete="off"
              />
              {showBankDropdown && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow max-h-48 overflow-y-auto">
                  {filteredBanks.length === 0 && (
                    <div className="px-4 py-2 text-gray-500">No banks found</div>
                  )}
                  {filteredBanks.map(bank => (
                    <div
                      key={bank}
                      className={`px-4 py-2 cursor-pointer hover:bg-teal-100 ${accountForm.bankName === bank ? "bg-teal-50 font-semibold" : ""}`}
                      onClick={() => {
                        setAccountForm(f => ({ ...f, bankName: bank }));
                        setBankSearch(bank);
                        setShowBankDropdown(false);
                      }}
                    >
                      {bank}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Input
              placeholder="Account Number"
              value={accountNumberInput}
              onChange={e => {
                setAccountNumberInput(e.target.value);
                setAccountForm(f => ({ ...f, accountNumber: e.target.value }));
              }}
              maxLength={10}
              inputMode="numeric"
              autoComplete="off"
            />
            <Button onClick={() => verifyAccount(accountNumberInput)} disabled={verifying}>
              {verifying ? "Verifying..." : "Verify Account"}
            </Button>
            {accountForm.accountName && <div className="text-green-600 font-semibold">{accountForm.accountName}</div>}
            {verifyError && <div className="text-red-600">{verifyError}</div>}
            <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={saveAccount}>{isEdit ? "Save Changes" : "Add Account"}</Button>
          </div>
        </div>
      </div>
    ) : null
  );


  //BARCHART DATA & STYLE
  const data = {
    labels: ["Jan 1", "Jan 7", "Jan 14", "Jan 21", "Jan 28", "Feb 4", "Feb 11", "Feb 18"],
    datasets: [
      {
        label: "Total Sales",
        data: [50, 120, 280, 220, 300, 420, 310, 400],
        borderColor: "rgba(96,159,160,0.8)", // line color
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        // 👇 background gradient
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;

          if (!chartArea) return null; // chart not ready yet

          const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(202, 249, 250, 0.8)"); // top color
          gradient.addColorStop(1, "#FFFFFF"); // bottom color
          return gradient;
        },
      },
    ],
  };


  const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: "rgba(0,0,0,0.05)",
      },
      ticks: {
        callback: function (value) {
          return value >= 1000 ? `₦${value / 1000}` : `₦${value}k`;
        },
      },
    },
  },
};



  return (
    <div 
      // className="flex h-screen bg-gray-50"
      className="max-w-[1440px]"
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {/* SEARCHBAR COMPONENT */}
                <div className="flex justify-center items-center w-[520px] px-3 py-2 gap-2 rounded-lg border border-[#DAE9E9] bg-[#F9FAFB]"> 
                    {/* random search svg */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clip-path="url(#clip0_1224_81)">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75003 1.66667C7.62052 1.66676 6.50741 1.93697 5.50358 2.45474C4.49974 2.97252 3.63427 3.72285 2.97939 4.64313C2.32451 5.56341 1.8992 6.62696 1.73895 7.74504C1.5787 8.86312 1.68815 10.0033 2.05818 11.0705C2.4282 12.1377 3.04807 13.1009 3.86606 13.8798C4.68405 14.6587 5.67645 15.2306 6.76046 15.548C7.84446 15.8654 8.98865 15.9189 10.0975 15.7041C11.2064 15.4893 12.2479 15.0125 13.135 14.3133L16.1784 17.3567C16.3355 17.5085 16.546 17.5925 16.7645 17.5906C16.983 17.5887 17.192 17.501 17.3465 17.3465C17.501 17.192 17.5887 16.983 17.5906 16.7645C17.5925 16.546 17.5085 16.3355 17.3567 16.1783L14.3134 13.135C15.1367 12.0905 15.6493 10.8353 15.7926 9.5131C15.9359 8.19088 15.704 6.85502 15.1235 5.65841C14.5431 4.4618 13.6374 3.4528 12.5103 2.74686C11.3831 2.04092 10.08 1.66658 8.75003 1.66667ZM3.33336 8.75C3.33336 7.31341 3.90404 5.93566 4.91987 4.91984C5.93569 3.90402 7.31344 3.33333 8.75003 3.33333C10.1866 3.33333 11.5644 3.90402 12.5802 4.91984C13.596 5.93566 14.1667 7.31341 14.1667 8.75C14.1667 10.1866 13.596 11.5643 12.5802 12.5802C11.5644 13.596 10.1866 14.1667 8.75003 14.1667C7.31344 14.1667 5.93569 13.596 4.91987 12.5802C3.90404 11.5643 3.33336 10.1866 3.33336 8.75Z" fill="#606368"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_1224_81">
                            <rect width="20" height="20" fill="white"/>
                          </clipPath>
                        </defs>
                    </svg>
                    <input
                      placeholder="Search"
                      className="w-full h-full outline-none text-sm placeholder:text-gray-400"
                    />
                  </div>
              </div>
            </div>

            {/* PROFILE AREA */}
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 grid place-items-center rounded-full bg-white border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2.66667C13.5246 2.66667 11.1507 3.65 9.40034 5.40034C7.65 7.15068 6.66667 9.52465 6.66667 12V16.704C6.66686 16.9108 6.61893 17.1149 6.52667 17.3L4.23733 21.8773C4.1255 22.101 4.0727 22.3495 4.08393 22.5992C4.09517 22.849 4.17007 23.0918 4.30153 23.3045C4.43298 23.5171 4.61663 23.6927 4.83502 23.8144C5.05342 23.9362 5.2993 24 5.54933 24H26.4507C26.7007 24 26.9466 23.9362 27.165 23.8144C27.3834 23.6927 27.567 23.5171 27.6985 23.3045C27.8299 23.0918 27.9048 22.849 27.9161 22.5992C27.9273 22.3495 27.8745 22.101 27.7627 21.8773L25.4747 17.3C25.3819 17.115 25.3336 16.9109 25.3333 16.704V12C25.3333 9.52465 24.35 7.15068 22.5997 5.40034C20.8493 3.65 18.4754 2.66667 16 2.66667ZM16 28C15.1725 28.0002 14.3653 27.7439 13.6895 27.2663C13.0138 26.7888 12.5027 26.1134 12.2267 25.3333H19.7733C19.4973 26.1134 18.9862 26.7888 18.3105 27.2663C17.6347 27.7439 16.8275 28.0002 16 28Z" fill="#111827"/>
                </svg>
              </button> 

              {/* AVATAR + NAME */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={vendor?.profileImage || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback>{vendor?.businessName?.[0] || "V"}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{vendor?.businessName || "Vendor Name"}</div>
                  <div className="text-gray-500">{vendor?.role || "Vendor"}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PART B: MAIN CONTAINER */}
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[18px] font-bold text-gray-900">Payments & Earnings</h1>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clip-path="url(#clip0_1291_3099)">
                    <path d="M2.54166 7.75809C2.50624 7.6523 2.49241 7.54048 2.50101 7.42925C2.50961 7.31802 2.54046 7.20965 2.59172 7.11057C2.64299 7.01148 2.71362 6.9237 2.79945 6.85242C2.88527 6.78114 2.98453 6.72782 3.09134 6.69562C3.19815 6.66342 3.31035 6.653 3.42126 6.66496C3.53218 6.67693 3.63956 6.71105 3.73705 6.76529C3.83454 6.81953 3.92014 6.8928 3.98878 6.98074C4.05743 7.06869 4.10771 7.16952 4.13666 7.27726C5.87499 13.0989 14.1217 13.0998 15.8617 7.28059C15.8928 7.17564 15.9444 7.07786 16.0134 6.99284C16.0824 6.90782 16.1674 6.83721 16.2637 6.78506C16.3599 6.7329 16.4655 6.70022 16.5744 6.68887C16.6833 6.67752 16.7934 6.68773 16.8983 6.71892C17.0033 6.75011 17.1011 6.80167 17.1861 6.87064C17.2711 6.93962 17.3417 7.02467 17.3939 7.12093C17.446 7.2172 17.4787 7.32279 17.49 7.43168C17.5014 7.54058 17.4912 7.65064 17.46 7.75559C17.1568 8.79825 16.6425 9.76746 15.9492 10.6031L17.0117 11.6664C17.1635 11.8236 17.2475 12.0341 17.2456 12.2526C17.2437 12.4711 17.156 12.6801 17.0015 12.8346C16.847 12.9891 16.638 13.0768 16.4195 13.0787C16.201 13.0806 15.9905 12.9966 15.8333 12.8448L14.7408 11.7523C14.1512 12.1969 13.4999 12.5531 12.8075 12.8098L13.105 13.9223C13.1367 14.029 13.1468 14.141 13.1345 14.2516C13.1222 14.3623 13.0879 14.4693 13.0336 14.5665C12.9793 14.6637 12.906 14.749 12.8182 14.8174C12.7303 14.8858 12.6297 14.9359 12.5221 14.9647C12.4146 14.9935 12.3024 15.0005 12.1921 14.9853C12.0818 14.9701 11.9757 14.9329 11.8801 14.8759C11.7844 14.819 11.7011 14.7435 11.6351 14.6538C11.5691 14.5642 11.5218 14.4622 11.4958 14.3539L11.1925 13.2231C10.4033 13.3398 9.59666 13.3398 8.80749 13.2231L8.50416 14.3539C8.47823 14.4622 8.43087 14.5642 8.36487 14.6538C8.29887 14.7435 8.21558 14.819 8.11991 14.8759C8.02424 14.9329 7.91814 14.9701 7.80786 14.9853C7.69758 15.0005 7.58536 14.9935 7.47784 14.9647C7.37031 14.9359 7.26965 14.8858 7.18181 14.8174C7.09396 14.749 7.02071 14.6637 6.96638 14.5665C6.91206 14.4693 6.87775 14.3623 6.86548 14.2516C6.85322 14.141 6.86326 14.029 6.89499 13.9223L7.19249 12.8098C6.50004 12.5528 5.84874 12.1963 5.25916 11.7514L4.16749 12.8448C4.01124 13.0012 3.79922 13.0892 3.57808 13.0894C3.35694 13.0895 3.1448 13.0018 2.98833 12.8456C2.83185 12.6893 2.74385 12.4773 2.7437 12.2562C2.74354 12.035 2.83124 11.8229 2.98749 11.6664L4.04999 10.6039C3.39666 9.82392 2.87499 8.87559 2.53999 7.75892L2.54166 7.75809Z" fill="#606368"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1291_3099">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                Hide Charts
              </button>
              <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clip-path="url(#clip0_1291_3106)">
                    <path d="M7.5 2.5C7.7124 2.50024 7.91669 2.58157 8.07114 2.72737C8.22559 2.87318 8.31853 3.07246 8.33098 3.2845C8.34342 3.49653 8.27444 3.70532 8.13811 3.86819C8.00179 4.03107 7.80841 4.13575 7.5975 4.16083L7.5 4.16667H4.16667V15.8333H15.8333V8.33333C15.8336 8.12093 15.9149 7.91664 16.0607 7.76219C16.2065 7.60775 16.4058 7.5148 16.6178 7.50236C16.8299 7.48991 17.0386 7.5589 17.2015 7.69522C17.3644 7.83155 17.4691 8.02492 17.4942 8.23583L17.5 8.33333V15.8333C17.5001 16.2538 17.3413 16.6588 17.0554 16.9671C16.7695 17.2754 16.3776 17.4643 15.9583 17.4958L15.8333 17.5H4.16667C3.74619 17.5001 3.34119 17.3413 3.03288 17.0554C2.72456 16.7695 2.5357 16.3776 2.50417 15.9583L2.5 15.8333V4.16667C2.49987 3.74619 2.65867 3.34119 2.94458 3.03288C3.23049 2.72456 3.62237 2.5357 4.04167 2.50417L4.16667 2.5H7.5ZM16.2608 2.5C16.7792 2.5 17.0808 2.89 17.1567 3.21333C17.2325 3.5375 17.1358 4.0225 16.6692 4.2525L16.3242 4.42833L16.1875 4.50167L15.885 4.66917L15.5475 4.86583L15.1817 5.09083C14.6133 5.44917 13.965 5.90417 13.3133 6.455C11.935 7.62083 10.5983 9.1725 9.9575 11.0967C9.88766 11.3064 9.73736 11.4798 9.53967 11.5787C9.34197 11.6777 9.11308 11.694 8.90333 11.6242C8.69359 11.5543 8.52018 11.404 8.42126 11.2063C8.32233 11.0086 8.30599 10.7797 8.37583 10.57C9.14917 8.25 10.7283 6.45917 12.2375 5.1825C12.5967 4.87833 12.9558 4.60083 13.3025 4.34917L13.5608 4.16667H11.6667C11.4543 4.16643 11.25 4.0851 11.0955 3.93929C10.9411 3.79349 10.8481 3.59421 10.8357 3.38217C10.8232 3.17014 10.8922 2.96135 11.0286 2.79847C11.1649 2.6356 11.3583 2.53092 11.5692 2.50583L11.6667 2.5H16.2608Z" fill="#111827"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1291_3106">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                Export
              </button>
              <button 
                className="inline-flex items-center gap-1 rounded-md bg-[#0A6C6D] px-2 py-2 text-white text-sm" 
                onClick={() => { setAccountForm({ bankName: '', accountNumber: '', type: 'savings', id: '', accountName: '', bankLogoUrl: '' }); setShowAddModal(true); 
              }}>
              {/* Plus-svg */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_1291_3113)">
                  <path d="M9.16667 16.6667C9.16667 16.8877 9.25446 17.0996 9.41074 17.2559C9.56702 17.4122 9.77899 17.5 10 17.5C10.221 17.5 10.433 17.4122 10.5893 17.2559C10.7455 17.0996 10.8333 16.8877 10.8333 16.6667V10.8333H16.6667C16.8877 10.8333 17.0996 10.7455 17.2559 10.5893C17.4122 10.433 17.5 10.221 17.5 10C17.5 9.77899 17.4122 9.56702 17.2559 9.41074C17.0996 9.25446 16.8877 9.16667 16.6667 9.16667H10.8333V3.33333C10.8333 3.11232 10.7455 2.90036 10.5893 2.74408C10.433 2.5878 10.221 2.5 10 2.5C9.77899 2.5 9.56702 2.5878 9.41074 2.74408C9.25446 2.90036 9.16667 3.11232 9.16667 3.33333V9.16667H3.33333C3.11232 9.16667 2.90036 9.25446 2.74408 9.41074C2.5878 9.56702 2.5 9.77899 2.5 10C2.5 10.221 2.5878 10.433 2.74408 10.5893C2.90036 10.7455 3.11232 10.8333 3.33333 10.8333H9.16667V16.6667Z" fill="white"/>
                </g>
                <defs>
                  <clipPath id="clip0_1291_3113">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
               Withdraw
              </button>
            </div>
          </div>



          {/* ============== E. REPORT BOXES (TOP CARDS) ============= 
        ======================================================== */}
          {/* Stats Cards */}
          <div className="flex w-[980px] bg-white rounded-xl border-t border-b border-1 border-[#E5E7EB]">


            {/* CARD 1 */}
            <div className="flex w-[312px] h-[124px] items-center justify-between px-[29px] py-[20px]">
              <div className="flex flex-col justify-center">
                <p className="text-[12px] text-gray-500">Total Earnings</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.totalEarnings ? `₦${stats.totalEarnings.toLocaleString()}` : "0.00"}</p>
                <div className="flex items-center text-xs mt-1">
                  <span className="mr-1 text-green-500">{stats.earningsVsLastYear || ""}↑ 12%</span>
                  <span className="text-gray-400">vs last year</span>
                </div>
              </div>
              <div className="flex-shrink-0">
              <div className="flex w-8 h-10 items-center justify-center rounded-md border border-[#4C98F1] bg-[#EFF6FF]">
                {/* Calendar SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clipPath="url(#clip0_993_747)">
                    <path
                      d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V12H21ZM16 3C16.2652 3 16.5196 3.10536 16.7071 3.29289C16.8946 3.48043 17 3.73478 17 4V5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V10H3V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H7V4C7 3.73478 7.10536 3.48043 7.29289 3.29289C7.48043 3.10536 7.73478 3 8 3C8.26522 3 8.51957 3.10536 8.70711 3.29289C8.89464 3.48043 9 3.73478 9 4V5H15V4C15 3.73478 15.1054 3.48043 15.2929 3.29289C15.4804 3.10536 15.7348 3 16 3Z"
                      fill="#4C98F1"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_993_747">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            </div>

            {/* Divider (centered vertically) */}
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="1" height="64" viewBox="0 0 1 64" fill="none">
                <path d="M1 0V64" stroke="#E5E7EB" strokeWidth="2" />
              </svg>
            </div>

            {/* CARD 2 */}
            <div className="flex w-[312px] h-[124px] items-center justify-between px-[29px] py-[20px]">
              <div className="flex flex-col justify-center">
                <p className="text-[12px] text-gray-500">Earnings this week</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.earningsThisWeek ? `₦${stats.earningsThisWeek.toLocaleString()}` : "0.00"}</p>
                <div className="flex items-center text-xs mt-1">
                  <span className="mr-1 text-green-500">↑ 8%</span>
                  <span className="text-gray-400">vs last week</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {/* Card SVG */}
                <div className="flex w-8 h-10 items-center justify-center rounded-md border border-[#06CD02] bg-[#ECF9EC]">
                {/* Calendar SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g clip-path="url(#clip0_993_767)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V8H22V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4H5ZM22 10H2V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H19C19.7956 20 20.5587 19.6839 21.1213 19.1213C21.6839 18.5587 22 17.7956 22 17V10ZM8 15C8 14.7348 8.10536 14.4804 8.29289 14.2929C8.48043 14.1054 8.73478 14 9 14H13.414L13.293 13.879C13.1054 13.6915 12.9999 13.4371 12.9998 13.1719C12.9997 12.9066 13.105 12.6521 13.2925 12.4645C13.48 12.2769 13.7344 12.1714 13.9996 12.1713C14.2649 12.1712 14.5194 12.2765 14.707 12.464L16.535 14.293C16.7225 14.4805 16.8278 14.7348 16.8278 15C16.8278 15.2652 16.7225 15.5195 16.535 15.707L14.707 17.535C14.6148 17.6305 14.5044 17.7067 14.3824 17.7591C14.2604 17.8115 14.1292 17.8391 13.9964 17.8403C13.8636 17.8414 13.7319 17.8161 13.609 17.7658C13.4861 17.7155 13.3745 17.6413 13.2806 17.5474C13.1867 17.4535 13.1125 17.3419 13.0622 17.219C13.0119 17.0961 12.9866 16.9644 12.9877 16.8316C12.9889 16.6988 13.0165 16.5676 13.0689 16.4456C13.1213 16.3236 13.1975 16.2132 13.293 16.121L13.414 16H9C8.73478 16 8.48043 15.8946 8.29289 15.7071C8.10536 15.5196 8 15.2652 8 15Z" fill="#06CD02"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_993_767">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            </div>

            {/* Divider */}
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="1" height="64" viewBox="0 0 1 64" fill="none">
                <path d="M1 0V64" stroke="#E5E7EB" strokeWidth="2" />
              </svg>
            </div>

            {/* CARD 3 */}
            <div className="flex w-[312px] h-[124px] items-center justify-between px-[29px] py-[20px]">
              <div className="flex flex-col justify-center">
                <p className="text-[12px] text-gray-500">Completed Payments</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.completedPayments ? `₦${stats.completedPayments.toLocaleString()}` : "0.00"}</p>
                <div className="flex items-center text-xs mt-1">
                  <span className="mr-1 text-green-500">↑ 8%</span>
                  <span className="text-gray-400">vs last week</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {/* Guests SVG */}
                <div className="flex w-8 h-10 items-center justify-center rounded-md border border-[#CD16C3] bg-[#FFD3FC]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clip-path="url(#clip0_1784_2652)">
                      <path d="M11.287 4.71716L11.594 4.58716C14.444 3.31916 17.274 3.35016 19.125 3.59116L19.535 3.64916L19.907 3.71216L20.24 3.77716L20.53 3.84016C21.394 4.03816 21.934 4.77716 21.994 5.57116L22 5.72116V17.3062C22 18.3332 21.024 19.0072 20.107 18.7962L19.827 18.7342L19.502 18.6722L19.137 18.6122C18.9323 18.5812 18.7269 18.5548 18.521 18.5332L18.068 18.4932C16.585 18.3892 14.654 18.4942 12.713 19.2832L12.406 19.4132C9.776 20.5832 7.162 20.6472 5.319 20.4602L4.875 20.4102L4.465 20.3502L4.093 20.2872C4.0356 20.2768 3.97827 20.2662 3.921 20.2552L3.471 20.1602C2.606 19.9622 2.066 19.2232 2.006 18.4292L2 18.2792V6.69416C2 5.66716 2.976 4.99216 3.893 5.20416L4.173 5.26616L4.498 5.32816L4.863 5.38816C6.399 5.61816 8.835 5.71416 11.287 4.71716ZM12 8.00016C10.9391 8.00016 9.92172 8.42158 9.17157 9.17173C8.42143 9.92188 8 10.9393 8 12.0002C8 13.061 8.42143 14.0784 9.17157 14.8286C9.92172 15.5787 10.9391 16.0002 12 16.0002C13.0609 16.0002 14.0783 15.5787 14.8284 14.8286C15.5786 14.0784 16 13.061 16 12.0002C16 10.9393 15.5786 9.92188 14.8284 9.17173C14.0783 8.42158 13.0609 8.00016 12 8.00016ZM12 10.0002C12.5304 10.0002 13.0391 10.2109 13.4142 10.5859C13.7893 10.961 14 11.4697 14 12.0002C14 12.5306 13.7893 13.0393 13.4142 13.4144C13.0391 13.7894 12.5304 14.0002 12 14.0002C11.4696 14.0002 10.9609 13.7894 10.5858 13.4144C10.2107 13.0393 10 12.5306 10 12.0002C10 11.4697 10.2107 10.961 10.5858 10.5859C10.9609 10.2109 11.4696 10.0002 12 10.0002Z" fill="#CD16C3"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_1784_2652">
                        <rect width="24" height="24" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="1" height="64" viewBox="0 0 1 64" fill="none">
                <path d="M1 0V64" stroke="#E5E7EB" strokeWidth="2" />
              </svg>
            </div>


            {/* CARD 4 */}
            <div className="flex w-[312px] h-[124px] items-center justify-between px-[29px] py-[20px]">
              <div className="flex flex-col justify-center">
                <p className="text-[12px] text-gray-500">Pending Payments</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.pendingPayments ? `₦${stats.pendingPayments.toLocaleString()}` : "0.00"}</p>
                <div className="flex items-center text-xs mt-1">
                  <span className="mr-1 text-red-500">↓ 5%</span>
                  <span className="text-gray-400">vs last week</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {/* Money SVG */}
                <div className="flex w-8 h-10 items-center justify-center rounded-md border border-[#E1B505] bg-[#FFF8DE]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <g clip-path="url(#clip0_993_807)">
                        <path d="M11.287 4.717L11.594 4.587C14.444 3.319 17.274 3.35 19.125 3.591L19.535 3.649L19.907 3.712L20.24 3.777L20.53 3.84C21.394 4.038 21.934 4.777 21.994 5.571L22 5.721V17.306C22 18.333 21.024 19.007 20.107 18.796L19.827 18.734L19.502 18.672L19.137 18.612C18.9323 18.581 18.7269 18.5547 18.521 18.533L18.068 18.493C16.585 18.389 14.654 18.494 12.713 19.283L12.406 19.413C9.776 20.583 7.162 20.647 5.319 20.46L4.875 20.41L4.465 20.35L4.093 20.287C4.0356 20.2767 3.97827 20.266 3.921 20.255L3.471 20.16C2.606 19.962 2.066 19.223 2.006 18.429L2 18.279V6.694C2 5.667 2.976 4.992 3.893 5.204L4.173 5.266L4.498 5.328L4.863 5.388C6.399 5.618 8.835 5.714 11.287 4.717ZM12 8C10.9391 8 9.92172 8.42143 9.17157 9.17158C8.42143 9.92172 8 10.9391 8 12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17158C14.0783 8.42143 13.0609 8 12 8ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10Z" fill="#E1B505"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_993_807">
                          <rect width="24" height="24" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                </div>
              </div>
            </div>
          </div>

            

          {/* FIRST CHARTS */}
          <div className="w-full self-stretch flex flex-wrap items-center justify-between gap-2 mt-7">


            {/* -------- first box: Available Balance --------
          --------------------------------------------------- */}
            <div className="w-[350px] h-[348px] flex-shrink-0 rounded-[12px] border border-[#E5E7EB] bg-[#FAFDFD]">
             
              <div className="w-[400px] h-[348px] flex-shrink-0 rounded-[12px] border border-[#E5E7EB] bg-[#FAFDFD] p-4 flex flex-col justify-between">
                {/* Available Balance + Withdraw */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Available Balance</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.availableBalance ? `₦${stats.availableBalance.toLocaleString()}` : "0.00"}</p>
                    {/* <p className="text-xs text-gray-500 mb-6">{stats.lastPaymentProcessed || "Last payment processed on.."}</p> */}
                  </div>

                  {accounts.map(account => <AccountCard key={account.id} account={account} />)}
                  <button 
                    onClick={() => { setAccountForm({ bankName: '', accountNumber: '', type: 'savings', id: '', accountName: '', bankLogoUrl: '' }); setShowAddModal(true); }}
                    className="flex items-center justify-center px-4 py-2.5 rounded-md bg-[#0A6C6D] text-white text-sm font-medium hover:bg-[#095859] transition gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <g clip-path="url(#clip0_1291_2891)">
                        <path d="M9.16667 16.6667C9.16667 16.8877 9.25446 17.0996 9.41074 17.2559C9.56702 17.4122 9.77899 17.5 10 17.5C10.221 17.5 10.433 17.4122 10.5893 17.2559C10.7455 17.0996 10.8333 16.8877 10.8333 16.6667V10.8333H16.6667C16.8877 10.8333 17.0996 10.7455 17.2559 10.5893C17.4122 10.433 17.5 10.221 17.5 10C17.5 9.77899 17.4122 9.56702 17.2559 9.41074C17.0996 9.25446 16.8877 9.16667 16.6667 9.16667H10.8333V3.33333C10.8333 3.11232 10.7455 2.90036 10.5893 2.74408C10.433 2.5878 10.221 2.5 10 2.5C9.77899 2.5 9.56702 2.5878 9.41074 2.74408C9.25446 2.90036 9.16667 3.11232 9.16667 3.33333V9.16667H3.33333C3.11232 9.16667 2.90036 9.25446 2.74408 9.41074C2.5878 9.56702 2.5 9.77899 2.5 10C2.5 10.221 2.5878 10.433 2.74408 10.5893C2.90036 10.7455 3.11232 10.8333 3.33333 10.8333H9.16667V16.6667Z" fill="white"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_1291_2891">
                          <rect width="20" height="20" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                     Withdraw
                  </button>
                </div>

                {/* Last Payment Processed */}
                <p className="text-xs text-gray-500 mt-2">
                  Last payment processed on May 31st, 2025
                </p>

                {/* Bank Accounts */}
                <div className="flex-1 flex flex-col justify-center items-center">
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <AccountCard key={account.id} account={account} />
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No accounts yet</p>
                  )}
                </div>

                {/* Add Account Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setAccountForm({
                        bankName: '',
                        accountNumber: '',
                        type: 'savings',
                        id: '',
                        accountName: '',
                        bankLogoUrl: '',
                      });
                      setShowAddModal(true);
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#0A6C6D] hover:bg-gray-50 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>




            
            {/* -------- Second box: Earning Trends --------
          --------------------------------------------------- */}
            {/* Earnings Trends Chart */}
            <div className="w-[550px] h-[348px] flex-shrink-0 rounded-[12px] border border-[#E5E7EB] bg-white">
              <CardHeader className="flex w-full px-5 py-3 flex-col items-start gap-2 border-b">
                <div className="w-full flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-[#111827]">
                    Earning Trends
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-1 text-sm font-small text-[#0A6C6D] hover:underline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.24415 14.7558C5.08793 14.5996 5.00016 14.3876 5.00016 14.1667C5.00016 13.9457 5.08793 13.7338 5.24415 13.5775L8.82165 9.99999L5.24415 6.42249C5.16456 6.34562 5.10108 6.25367 5.0574 6.152C5.01373 6.05033 4.99074 5.94098 4.98978 5.83033C4.98882 5.71968 5.0099 5.60995 5.0518 5.50753C5.0937 5.40512 5.15558 5.31208 5.23382 5.23383C5.31207 5.15559 5.40511 5.09371 5.50752 5.05181C5.60994 5.00991 5.71967 4.98882 5.83032 4.98979C5.94097 4.99075 6.05032 5.01374 6.15199 5.05741C6.25366 5.10108 6.34561 5.16457 6.42249 5.24416L10.5892 9.41083C10.7454 9.5671 10.8331 9.77902 10.8331 9.99999C10.8331 10.221 10.7454 10.4329 10.5892 10.5892L6.42249 14.7558C6.26621 14.9121 6.05429 14.9998 5.83332 14.9998C5.61235 14.9998 5.40043 14.9121 5.24415 14.7558ZM10.2442 14.7558C10.0879 14.5996 10.0002 14.3876 10.0002 14.1667C10.0002 13.9457 10.0879 13.7338 10.2442 13.5775L13.8217 9.99999L10.2442 6.42249C10.0924 6.26533 10.0084 6.05482 10.0103 5.83633C10.0122 5.61783 10.0998 5.40882 10.2543 5.25431C10.4088 5.09981 10.6178 5.01216 10.8363 5.01027C11.0548 5.00837 11.2653 5.09236 11.4225 5.24416L15.5892 9.41083C15.7454 9.5671 15.8331 9.77902 15.8331 9.99999C15.8331 10.221 15.7454 10.4329 15.5892 10.5892L11.4225 14.7558C11.2662 14.9121 11.0543 14.9998 10.8333 14.9998C10.6123 14.9998 10.4004 14.9121 10.2442 14.7558Z" fill="#0A6C6D"/>
                      </svg>
                      View All
                    </button>

                    {/* <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50">
                      Weekly
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M5 8l5 5 5-5" stroke="currentColor" />
                      </svg>
                    </button> */}
                    <select className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50">
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M5 8l5 5 5-5" stroke="currentColor" />
                      </svg>
                    </select>
                  </div>
                </div>
              </CardHeader>


              {/* content top row */}
            <div className="px-5 pt-4">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-semibold text-gray-900">104</span>
                  <span className="mr-1 text-[#37703F] text-sm font-medium">↑ 8%</span>
                  <span className="text-xs text-gray-500">vs last week</span>
                </div>

                {/* legend */}
                <div className="flex items-center gap-4 text-xs text-gray-600 mt-[-15px]">
                  {/* <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-gray-800" />
                    This week
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-[#0A6C6D]" />
                    Last week
                  </span> */}
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="week"
                      defaultChecked
                      className="form-radio text-[#0A6C6D] focus:ring-0"
                    />
                    <span className="text-gray-700">This week</span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="week"
                    className="form-radio text-gray-400 focus:ring-0"
                  />
                  <span className="text-gray-500">Last week</span>
                </label>
                </div>
              </div>
            </div>


              {/* barchart */}
              <div className="h-[220px] w-full px-4">
                <Line data={data} options={options} />
              </div>

            </div>
          </div>








          {/* Transaction History */}
          <Card className="mt-10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[14px] font-medium">Transaction History</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search transactions" className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-8 py-2 text-xs text-gray-700 hover:bg-gray-50" />
                  </div>
                  
                  <select className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      <option>Date</option>
                      {/* <option>Monthly</option> */}
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M5 8l5 5 5-5" stroke="currentColor" />
                      </svg>
                  </select>

                  <select className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      <option>Status</option>
                      <option>Paid</option>
                      <option>Partly-paid</option>
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M5 8l5 5 5-5" stroke="currentColor" />
                      </svg>
                  </select>

                   <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      {/* <option>Status</option> */}
                       Advanced Filter
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clip-path="url(#clip0_1291_2951)">
                          <path d="M11.6667 14.1665C11.8791 14.1667 12.0834 14.2481 12.2378 14.3939C12.3923 14.5397 12.4852 14.739 12.4976 14.951C12.5101 15.163 12.4411 15.3718 12.3048 15.5347C12.1685 15.6976 11.9751 15.8023 11.7642 15.8273L11.6667 15.8332H8.33333C8.12093 15.8329 7.91664 15.7516 7.76219 15.6058C7.60775 15.46 7.5148 15.2607 7.50236 15.0487C7.48991 14.8366 7.5589 14.6279 7.69522 14.465C7.83155 14.3021 8.02492 14.1974 8.23583 14.1723L8.33333 14.1665H11.6667ZM14.1667 9.1665C14.3877 9.1665 14.5996 9.2543 14.7559 9.41058C14.9122 9.56686 15 9.77882 15 9.99984C15 10.2209 14.9122 10.4328 14.7559 10.5891C14.5996 10.7454 14.3877 10.8332 14.1667 10.8332H5.83333C5.61232 10.8332 5.40036 10.7454 5.24408 10.5891C5.0878 10.4328 5 10.2209 5 9.99984C5 9.77882 5.0878 9.56686 5.24408 9.41058C5.40036 9.2543 5.61232 9.1665 5.83333 9.1665H14.1667ZM16.6667 4.1665C16.8877 4.1665 17.0996 4.2543 17.2559 4.41058C17.4122 4.56686 17.5 4.77882 17.5 4.99984C17.5 5.22085 17.4122 5.43281 17.2559 5.58909C17.0996 5.74537 16.8877 5.83317 16.6667 5.83317H3.33333C3.11232 5.83317 2.90036 5.74537 2.74408 5.58909C2.5878 5.43281 2.5 5.22085 2.5 4.99984C2.5 4.77882 2.5878 4.56686 2.74408 4.41058C2.90036 4.2543 3.11232 4.1665 3.33333 4.1665H16.6667Z" fill="#606368"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_1291_2951">
                            <rect width="20" height="20" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                  </button>
                </div>
              </div>
            </CardHeader>

            {/* <CardContent>
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{transaction.date}</TableCell>
                        <TableCell>{transaction.transactionId}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">EJ</AvatarFallback>
                            </Avatar>
                            <span>{transaction.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.branch}</TableCell>
                        <TableCell>{transaction.method}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent> */}
            <CardContent className="w-full bg-[#E6F2F2] px-2 py-4 mt-5">
            <div className="">
              <table className="w-full text-sm">
                <TableHeader className="">
                  <TableRow>
                    <TableHead className="font-medium text-gray-600">Date</TableHead>
                    <TableHead className="font-medium text-gray-600">Transaction ID</TableHead>
                    <TableHead className="font-medium text-gray-600">Customer Name</TableHead>
                    <TableHead className="font-medium text-gray-600">Branch</TableHead>
                    <TableHead className="font-medium text-gray-600">Payment Method</TableHead>
                    <TableHead className="font-medium text-gray-600">Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {transactions.map((transaction, index: number) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Date */}
                      <TableCell className="font-medium text-gray-700">
                        {transaction.date}
                      </TableCell>

                      {/* Transaction ID */}
                      <TableCell className="text-gray-600">
                        {transaction.transactionId}
                      </TableCell>

                      {/* Customer with Avatar */}
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8 border">
                            {transaction.avatar ? (
                              <AvatarImage src={transaction.avatar} alt={transaction.customer} />
                            ) : (
                              <AvatarFallback className="text-xs font-medium">
                                {transaction.customer
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="text-gray-700">{transaction.customer}</span>
                        </div>
                      </TableCell>

                      {/* Branch */}
                      <TableCell className="text-gray-600">{transaction.branch}</TableCell>

                      {/* Payment Method */}
                      <TableCell className="text-gray-600">{transaction.method}</TableCell>

                      {/* Status with badge + dot */}
                      <TableCell>
                        <div
                          className={`flex items-center w-fit px-3 py-1 rounded-full text-xs font-medium 
                            ${
                              transaction.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : transaction.status === "Partly-paid"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full mr-2 ${
                              transaction.status === "Paid"
                                ? "bg-green-500"
                                : transaction.status === "Partly-paid"
                                ? "bg-yellow-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          {transaction.status}
                        </div>
                      </TableCell>

                      {/* Action button */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-gray-100 rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </table>
            </div>
          </CardContent>

          </Card>
          <AccountModal open={showEditModal} onClose={() => setShowEditModal(false)} isEdit={true} />
          <AccountModal open={showAddModal} onClose={() => setShowAddModal(false)} isEdit={false} />
        </main>
      </div>
    </div>
  );
}
