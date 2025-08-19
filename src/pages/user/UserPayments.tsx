import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBookings } from "@/store/slices/dashboardSlice";
import { useAuth } from "@/hooks/useAuthRedux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const UserPayments = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { bookings, isLoading } = useAppSelector((state) => state.dashboard);
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Filter bookings for current user
  const myBookings = bookings.filter((booking) => booking.userId === user?.id);

  const filteredBookings = myBookings.filter((booking) => {
    const statusMatch =
      statusFilter === "all" || booking.paymentStatus === statusFilter;

    let monthMatch = true;
    if (monthFilter !== "all") {
      const bookingMonth = new Date(booking.date).getMonth();
      const currentMonth = new Date().getMonth();

      if (monthFilter === "current") {
        monthMatch = bookingMonth === currentMonth;
      } else if (monthFilter === "last") {
        monthMatch =
          bookingMonth === (currentMonth === 0 ? 11 : currentMonth - 1);
      }
    }

    return statusMatch && monthMatch;
  });

  const getPaymentStats = () => {
    const totalAmount = myBookings.reduce((sum, b) => sum + b.amount, 0);
    const paidAmount = myBookings
      .filter((b) => b.paymentStatus === "completed")
      .reduce((sum, b) => sum + b.amount, 0);
    const pendingAmount = myBookings
      .filter((b) => b.paymentStatus === "pending")
      .reduce((sum, b) => sum + b.amount, 0);

    return {
      totalTransactions: myBookings.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      completedPayments: myBookings.filter(
        (b) => b.paymentStatus === "completed",
      ).length,
      pendingPayments: myBookings.filter((b) => b.paymentStatus === "pending")
        .length,
      failedPayments: myBookings.filter((b) => b.paymentStatus === "failed")
        .length,
    };
  };

  const stats = getPaymentStats();

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-600">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDownloadReceipt = (bookingId: string) => {
    // In real app, generate and download receipt
    console.log("Download receipt for booking:", bookingId);

    // Mock receipt download
    const booking = myBookings.find((b) => b.id === bookingId);
    if (booking) {
      const receiptContent = `
APPOINT HUB - PAYMENT RECEIPT
============================

Transaction ID: TXN-${bookingId.toUpperCase()}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Service: ${booking.serviceName}
Provider: ${booking.providerName}
Date: ${booking.date}
Time: ${booking.time}

Amount: ₹${booking.amount}
Status: ${booking.paymentStatus}

Thank you for using AppointHub!
      `;

      const blob = new Blob([receiptContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${bookingId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleRetryPayment = (bookingId: string) => {
    // In real app, redirect to payment page
    console.log("Retry payment for booking:", bookingId);
    const booking = myBookings.find((b) => b.id === bookingId);
    if (booking) {
      window.location.href = `/payment?booking=${bookingId}`;
    }
  };

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
              Payment History
            </h1>
            <p className="text-gray-600 mt-2">
              Track your payments and transactions
            </p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.totalAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From {stats.totalTransactions} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{stats.paidAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.completedPayments} completed payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Amount
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ₹{stats.pendingAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingPayments} pending payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Payments
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.failedPayments}
              </div>
              <p className="text-xs text-muted-foreground">
                Failed transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="current">Current Month</SelectItem>
                  <SelectItem value="last">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Payment Transactions ({filteredBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.serviceName}</div>
                        <div className="text-sm text-gray-500">
                          {booking.date} at {booking.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.providerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ₹{booking.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {booking.paymentStatus === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReceipt(booking.id)}
                          >
                            <Receipt className="h-4 w-4 mr-1" />
                            Receipt
                          </Button>
                        )}
                        {(booking.paymentStatus === "pending" ||
                          booking.paymentStatus === "failed") && (
                          <Button
                            size="sm"
                            onClick={() => handleRetryPayment(booking.id)}
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No payment transactions found
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {statusFilter === "all"
                  ? "You haven't made any payments yet."
                  : `No ${statusFilter} payments found for the selected period.`}
              </p>
              {statusFilter === "all" && (
                <Button onClick={() => (window.location.href = "/explore")}>
                  Explore Services
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Saved Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 1234</p>
                    <p className="text-sm text-gray-500">Visa ending in 1234</p>
                  </div>
                </div>
                <Badge variant="outline">Default</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">G</span>
                  </div>
                  <div>
                    <p className="font-medium">Google Pay</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>

              <Button variant="outline" className="w-full">
                + Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserPayments;
