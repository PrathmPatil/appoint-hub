import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBookings } from "@/store/slices/dashboardSlice";
import { useAuth } from "@/hooks/useAuthRedux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  CreditCard,
  Clock,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const ProviderEarnings = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { bookings, isLoading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Filter bookings for current provider
  const myBookings = bookings.filter(
    (booking) => booking.providerId === user?.id,
  );

  const getEarningsData = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const completedBookings = myBookings.filter(
      (b) => b.status === "completed",
    );

    const totalEarnings = completedBookings.reduce(
      (sum, b) => sum + b.amount,
      0,
    );
    const thisMonthEarnings = completedBookings
      .filter((b) => {
        const bookingDate = new Date(b.date);
        return (
          bookingDate.getMonth() === thisMonth &&
          bookingDate.getFullYear() === thisYear
        );
      })
      .reduce((sum, b) => sum + b.amount, 0);

    const lastMonthEarnings = completedBookings
      .filter((b) => {
        const bookingDate = new Date(b.date);
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const year = thisMonth === 0 ? thisYear - 1 : thisYear;
        return (
          bookingDate.getMonth() === lastMonth &&
          bookingDate.getFullYear() === year
        );
      })
      .reduce((sum, b) => sum + b.amount, 0);

    const pendingEarnings = myBookings
      .filter((b) => b.status === "confirmed" && b.paymentStatus === "pending")
      .reduce((sum, b) => sum + b.amount, 0);

    const avgBookingValue = totalEarnings / completedBookings.length || 0;
    const growthRate =
      lastMonthEarnings > 0
        ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
        : 0;

    return {
      totalEarnings,
      thisMonthEarnings,
      lastMonthEarnings,
      pendingEarnings,
      avgBookingValue,
      growthRate,
      completedBookings: completedBookings.length,
      totalBookings: myBookings.length,
    };
  };

  const earningsData = getEarningsData();

  // Mock monthly earnings data
  const monthlyEarnings = [
    { month: "Jan", earnings: 12000, bookings: 24 },
    { month: "Feb", earnings: 15000, bookings: 30 },
    { month: "Mar", earnings: 18000, bookings: 36 },
    { month: "Apr", earnings: 14000, bookings: 28 },
    { month: "May", earnings: 22000, bookings: 44 },
    {
      month: "Jun",
      earnings: earningsData.thisMonthEarnings,
      bookings: earningsData.completedBookings,
    },
  ];

  // Service-wise earnings
  const serviceEarnings = myBookings
    .filter((b) => b.status === "completed")
    .reduce(
      (acc, booking) => {
        acc[booking.serviceName] =
          (acc[booking.serviceName] || 0) + booking.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

  const serviceEarningsData = Object.entries(serviceEarnings).map(
    ([name, amount]) => ({
      name,
      amount,
    }),
  );

  // Payment status distribution
  const paymentStatusData = [
    {
      name: "Completed",
      value: myBookings.filter((b) => b.paymentStatus === "completed").length,
      color: "#10B981",
    },
    {
      name: "Pending",
      value: myBookings.filter((b) => b.paymentStatus === "pending").length,
      color: "#F59E0B",
    },
    {
      name: "Failed",
      value: myBookings.filter((b) => b.paymentStatus === "failed").length,
      color: "#EF4444",
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Earnings & Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Track your income and financial performance
            </p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{earningsData.totalEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From {earningsData.completedBookings} completed bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{earningsData.thisMonthEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                {earningsData.growthRate >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span
                  className={
                    earningsData.growthRate >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {Math.abs(earningsData.growthRate).toFixed(1)}%
                </span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Earnings
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ₹{earningsData.pendingEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From confirmed bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Booking Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{earningsData.avgBookingValue.toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Average per completed booking
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Earnings Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Earnings Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `₹${value.toLocaleString()}`,
                      "Earnings",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Service-wise Earnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Service-wise Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceEarningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `₹${value.toLocaleString()}`,
                    "Earnings",
                  ]}
                />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myBookings
                .filter((b) => b.paymentStatus === "completed")
                .slice(0, 5)
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{booking.serviceName}</p>
                      <p className="text-sm text-gray-600">
                        {booking.userName} • {booking.date} at {booking.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        +₹{booking.amount}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Paid
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Payout Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payout Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Next Payout</p>
                <p className="text-2xl font-bold">
                  ₹{earningsData.thisMonthEarnings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Expected on 1st of next month
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Payout Method
                </p>
                <p className="text-lg font-medium">Bank Transfer</p>
                <p className="text-sm text-gray-500">XXXX-XXXX-XXXX-1234</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  Processing Fee
                </p>
                <p className="text-lg font-medium">2.5%</p>
                <p className="text-sm text-gray-500">Deducted from earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProviderEarnings;
