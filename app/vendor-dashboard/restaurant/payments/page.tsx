"use client";

import { useState, useEffect, JSX, Fragment } from "react";
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
  Filter,
  EyeClosed,
  ArrowUpRightFromSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [accountForm, setAccountForm] = useState<Account>({
    bankName: "",
    accountNumber: "",
    type: "savings",
    id: "",
    accountName: "",
    bankLogoUrl: "",
  });
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [stats, setStats] = useState<Stats>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);
  const fetchAll = async () => {
    try {
      const [accRes, statsRes, transRes] = await Promise.all([
        fetch("/api/vendor/accounts").then((r) => r.json()),
        fetch("/api/vendor/payments/stats").then((r) => r.json()),
        fetch("/api/vendor/payments/transactions").then((r) => r.json()),
      ]);
      setAccounts(accRes);
      setStats(statsRes);
      setTransactions(transRes);
      setChartData(statsRes.chartData || []);
    } catch {}
  };

  const verifyAccount = async (accountNumber: string) => {
    setVerifying(true);
    setVerifyError("");
    try {
      const res = await fetch("/api/vendor/accounts/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber }),
      });
      const data = await res.json();
      if (data.accountName) {
        setAccountForm((f) => ({
          ...f,
          accountName: data.accountName,
          bankLogoUrl: data.bankLogoUrl,
        }));
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
    try {
      if (accountForm.id) {
        await fetch(`/api/vendor/accounts/${accountForm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(accountForm),
        });
      } else {
        await fetch(`/api/vendor/accounts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(accountForm),
        });
      }
      setShowEditModal(false);
      setShowAddModal(false);
      setAccountForm({
        bankName: "",
        accountNumber: "",
        type: "savings",
        id: "",
        accountName: "",
        bankLogoUrl: "",
      });
      fetchAll();
    } catch {}
  };

  const statsData: {
    name: string;
    value: number;
    description: string;
    icon: JSX.Element;
    background: string;
  }[] = [
    {
      name: "Total Earnings",
      value: stats.totalEarnings || 0,
      description: stats.earningsVsLastYear || "-",
      icon: <DollarSign className="h-4 w-4 text-blue-600" />,
      background: "bg-blue-100",
    },
    {
      name: "Earnings This Week",
      value: stats.earningsThisWeek || 0,
      description: stats.earningsVsLastWeek || "-",
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
      background: "bg-green-100",
    },
    {
      name: "Completed Payments",
      value: stats.completedPayments || 0,
      description: stats.completedVsLastWeek || "-",
      icon: <CheckCircle className="h-4 w-4 text-purple-600" />,
      background: "bg-purple-100",
    },
    {
      name: "Pending Payments",
      value: stats.pendingPayments || 0,
      description: stats.pendingVsLastWeek || "-",
      icon: <Clock className="h-4 w-4 text-yellow-600" />,
      background: "bg-yellow-100",
    },
  ];

  const AccountCard = ({ account }: { account: Account }) => (
    <Card className="relative overflow-hidden mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 relative">
            {account.bankLogoUrl && (
              <Image
                src={account.bankLogoUrl}
                alt={account.bankName}
                fill
                className="w-10 h-10 rounded"
              />
            )}
            <div>
              <div className="font-semibold text-lg">{account.accountName}</div>
              <div className="text-sm text-gray-400">
                {account.bankName} ({account.type})
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAccountForm(account);
                setShowEditModal(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
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
      </CardHeader>
      <CardContent>
        <div className="text-lg font-mono mb-1">
          ••••••{account.accountNumber.slice(-4)}
        </div>
        <div className="text-xs text-gray-500">{account.accountNumber}</div>
      </CardContent>
    </Card>
  );

  const AccountModal = ({
    open,
    onClose,
    isEdit,
  }: {
    open: boolean;
    onClose: () => void;
    isEdit: boolean;
  }) =>
    open ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4">
            {isEdit ? "Edit Account" : "Add Account"}
          </h2>
          <div className="space-y-4">
            <Input
              placeholder="Bank Name"
              value={accountForm.bankName}
              onChange={(e) =>
                setAccountForm((f) => ({ ...f, bankName: e.target.value }))
              }
            />
            {/* <Input placeholder="Bank Code" value={accountForm.bankCode} onChange={e => setAccountForm(f => ({ ...f, bankCode: e.target.value }))} /> */}
            <Input
              placeholder="Account Number"
              value={accountForm.accountNumber}
              onChange={(e) =>
                setAccountForm((f) => ({ ...f, accountNumber: e.target.value }))
              }
            />
            <Button
              onClick={() => verifyAccount(accountForm.accountNumber)}
              disabled={verifying}
            >
              {verifying ? "Verifying..." : "Verify Account"}
            </Button>
            {accountForm.accountName && (
              <div className="text-green-600 font-semibold">
                {accountForm.accountName}
              </div>
            )}
            {verifyError && <div className="text-red-600">{verifyError}</div>}
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700"
              onClick={saveAccount}
            >
              {isEdit ? "Save Changes" : "Add Account"}
            </Button>
          </div>
        </div>
      </div>
    ) : null;

  const rightNav = [
    {
      icon: <EyeClosed className="text-[#606368] size-5" />,
      title: "Hide Charts",
      variance: "white",
      onclick: () => {},
    },
    {
      icon: <ArrowUpRightFromSquare className="size-5" />,
      title: "Export",
      variance: "white",
      onclick: () => {},
    },
    {
      icon: <Plus className="size-5" />,
      title: "Withdraw",
      variance: "green",
      onclick: () => {
        setAccountForm({
          bankName: "",
          accountNumber: "",
          type: "savings",
          id: "",
          accountName: "",
          bankLogoUrl: "",
        });
        setShowAddModal(true);
      },
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
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
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JE</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">Vendor Name</div>
                  <div className="text-gray-500">Vendor</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto w-full p-6">
          <div className="md:flex w-full space-y-6 items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Payments & Earnings
            </h1>
            <div className="flex flex-col md:flex-row space-y-4 items-center gap-4">
              {rightNav.map((item, i) => (
                <button
                  key={i}
                  onClick={item.onclick}
                  className={`flex items-center gap-2 py-2.5 px-3 border rounded-xl text-sm w-full md:w-auto font-medium cursor-pointer mb-0 ${
                    item.variance === "white"
                      ? "text-[#111827] border-[#E5E7EB] bg-white"
                      : "text-white border-transparent bg-[#0A6C6D]"
                  }`}
                >
                  {item.icon}
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide divide-black border rounded-xl p-2 bg-white lg:grid-cols-4 mb-8">
            {statsData.map((stat, i) => (
              <div key={i} className="">
                <div className="relative overflow-hidden p-4">
                  <div className="pb-2">
                    <h2 className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </h2>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value ? `₦${stat.value.toLocaleString()}` : "-"}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.description || "-"}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-8 h-8 ${stat.background} rounded-lg flex items-center justify-center`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </div>
                {i < statsData.length - 1 && (
                  <>
                    {/* Vertical divider for horizontal layout */}
                    <div className="hidden sm:block w-px h-[90%] bg-gray-300"></div>
                    {/* Horizontal divider for vertical layout */}
                    <div className="block sm:hidden h-px w-[90%] bg-gray-300"></div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Available Balance Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Available Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {stats.availableBalance
                    ? `₦${stats.availableBalance.toLocaleString()}`
                    : "-"}
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  {stats.lastPaymentProcessed || "-"}
                </p>
                {/* Account Cards */}
                {accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
                <Button
                  className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
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
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </CardContent>
            </Card>
            {/* Earnings Trends Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Earnings Trends
                  </CardTitle>
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
                  <Badge
                    variant="secondary"
                    className="text-green-600 bg-green-50"
                  >
                    ↗ 8% vs last week
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#666" }}
                      />
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
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#14b8a6"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#14b8a6"
                            stopOpacity={0}
                          />
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
                <CardTitle className="text-lg font-semibold">
                  Transaction History
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search transactions"
                      className="pl-10 w-64"
                    />
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
                        <TableCell className="font-medium">
                          {transaction.date}
                        </TableCell>
                        <TableCell>{transaction.transactionId}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                EJ
                              </AvatarFallback>
                            </Avatar>
                            <span>{transaction.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.branch}</TableCell>
                        <TableCell>{transaction.method}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
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
          <AccountModal
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            isEdit={true}
          />
          <AccountModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            isEdit={false}
          />
        </main>
      </div>
    </div>
  );
}
