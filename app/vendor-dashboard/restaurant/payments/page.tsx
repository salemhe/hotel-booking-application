"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
 import { AuthService } from "@/app/lib/api/services/auth.service";
import { useVendorDashboardSocket } from "@/hooks/useVendorDashboardSocket";

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
  const { accounts, stats, transactions, loading } = useVendorDashboardSocket(process.env.NEXT_PUBLIC_API_URL || 'https://hotel-booking-app-backend-30q1.onrender.com', process.env.NEXT_PUBLIC_SOCKET_URL || 'https://hotel-booking-app-backend-30q1.onrender.com');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vendor, setVendor] = useState<{ businessName?: string; role?: string; profileImage?: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [accountForm, setAccountForm] = useState<Account>({ bankName: '', accountNumber: '', type: 'savings', id: '', accountName: '', bankLogoUrl: '' });
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const id = await AuthService.getId();
          if (id) {
            const profile = await AuthService.fetchMyProfile(id);
            setVendor({
              businessName: (profile as any)?.businessName || (profile as any)?.name,
              role: (profile as any)?.role || (profile as any)?.businessType || 'Vendor',
              profileImage: (profile as any)?.profileImage
            });
          }
        }
      } catch {
        setVendor(null);
      }
    };
    fetchVendor();
  }, []);

  useEffect(() => {
    if (stats.chartData) {
      setChartData(stats.chartData);
    }
  }, [stats]);

  const verifyAccount = async (accountNumber: string) => {
    setVerifying(true);
    setVerifyError('');
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token2 = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${BASE_URL}/api/vendors/accounts/verify`, {
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
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
    } catch {}
  };

  const AccountCard = ({ account }: { account: Account }) => (
    <Card className="relative overflow-hidden mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {account.bankLogoUrl && <img src={account.bankLogoUrl} alt={account.bankName} className="w-10 h-10 rounded" />}
            <div>
              <div className="font-semibold text-lg">{account.accountName}</div>
              <div className="text-sm text-gray-400">{account.bankName} ({account.type})</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setAccountForm(account); setShowEditModal(true); }}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setAccountForm({ bankName: '', accountNumber: '', type: 'savings', id: '', accountName: '', bankLogoUrl: '' }); setShowAddModal(true); }}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-mono mb-1">••••••{account.accountNumber.slice(-4)}</div>
        <div className="text-xs text-gray-500">{account.accountNumber}</div>
      </CardContent>
    </Card>
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

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search" className="pl-10 w-80" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={vendor?.profileImage || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback>{vendor?.businessName?.[0] || "V"}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{vendor?.businessName || "Vendor Name"}</div>
                  <div className="text-gray-500">{vendor?.role || "Vendor"}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header> */}
        <main className="flex-1 overflow-auto mt-20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Payments & Earnings</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Hide charts
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => { setAccountForm({ bankName: '', accountNumber: '', type: 'savings', id: '', accountName: '', bankLogoUrl: '' }); setShowAddModal(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
              </Button>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalEarnings ? `₦${stats.totalEarnings.toLocaleString()}` : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.earningsVsLastYear || "-"}</p>
              </CardContent>
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Earnings this Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.earningsThisWeek ? `₦${stats.earningsThisWeek.toLocaleString()}` : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.earningsVsLastWeek || "-"}</p>
              </CardContent>
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.completedPayments ? `₦${stats.completedPayments.toLocaleString()}` : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.completedVsLastWeek || "-"}</p>
              </CardContent>
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.pendingPayments ? `₦${stats.pendingPayments.toLocaleString()}` : "-"}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.pendingVsLastWeek || "-"}</p>
              </CardContent>
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Available Balance Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-4">{stats.availableBalance ? `₦${stats.availableBalance.toLocaleString()}` : "-"}</div>
                <p className="text-sm text-gray-500 mb-6">{stats.lastPaymentProcessed || "-"}</p>
                {/* Account Cards */}
                {accounts.map(account => <AccountCard key={account.id} account={account} />)}
                <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700" onClick={() => { setAccountForm({ bankName: '', accountNumber: '', type: 'savings', id: '', accountName: '', bankLogoUrl: '' }); setShowAddModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </CardContent>
            </Card>
            {/* Earnings Trends Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Earnings Trends</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Weekly <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Daily</DropdownMenuItem>
                        <DropdownMenuItem>Weekly</DropdownMenuItem>
                        <DropdownMenuItem>Monthly</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="text-2xl font-bold">{chartData.length}</div>
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    ↗ 8% vs last week
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                      <YAxis hide />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        dot={false}
                        fill="url(#colorGradient)"
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Transaction History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search transactions" className="pl-10 w-64" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Date <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Today</DropdownMenuItem>
                      <DropdownMenuItem>This Week</DropdownMenuItem>
                      <DropdownMenuItem>This Month</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Status <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All</DropdownMenuItem>
                      <DropdownMenuItem>Paid</DropdownMenuItem>
                      <DropdownMenuItem>Pending</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          <AccountModal open={showEditModal} onClose={() => setShowEditModal(false)} isEdit={true} />
          <AccountModal open={showAddModal} onClose={() => setShowAddModal(false)} isEdit={false} />
        </main>
      </div>
    </div>
  );
}
