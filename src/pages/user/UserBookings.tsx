import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchBookings,
  updateBookingStatus,
} from "@/store/slices/dashboardSlice";
import { useAuth } from "@/hooks/useAuthRedux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  MessageCircle,
  CreditCard,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserBookings = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { bookings, isLoading } = useAppSelector((state) => state.dashboard);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Enhanced dummy bookings for current user
  const myBookings = [
    {
      id: "1",
      serviceId: "service-1",
      serviceName: "Professional House Cleaning",
      providerId: "provider-1",
      providerName: "Elite Cleaning Services",
      userId: user?.id || "user-1",
      userName: user?.name || "User",
      date: "2024-01-22",
      time: "10:00 AM",
      status: "confirmed" as const,
      amount: 2400,
      paymentStatus: "completed" as const,
      createdAt: "2024-01-18T10:00:00Z",
    },
    {
      id: "2",
      serviceId: "service-2",
      serviceName: "Dermatology Consultation",
      providerId: "provider-2",
      providerName: "Dr. Priya Sharma",
      userId: user?.id || "user-1",
      userName: user?.name || "User",
      date: "2024-01-25",
      time: "3:00 PM",
      status: "confirmed" as const,
      amount: 1800,
      paymentStatus: "completed" as const,
      createdAt: "2024-01-20T14:00:00Z",
    },
    {
      id: "3",
      serviceId: "service-3",
      serviceName: "Car Premium Wash",
      providerId: "provider-3",
      providerName: "AutoCare Pro",
      userId: user?.id || "user-1",
      userName: user?.name || "User",
      date: "2024-01-18",
      time: "2:00 PM",
      status: "completed" as const,
      amount: 1200,
      paymentStatus: "completed" as const,
      createdAt: "2024-01-15T11:00:00Z",
    },
    {
      id: "4",
      serviceId: "service-4",
      serviceName: "Legal Consultation",
      providerId: "provider-4",
      providerName: "Advocate Ravi Kumar",
      userId: user?.id || "user-1",
      userName: user?.name || "User",
      date: "2024-01-28",
      time: "4:00 PM",
      status: "pending" as const,
      amount: 2500,
      paymentStatus: "pending" as const,
      createdAt: "2024-01-22T16:00:00Z",
    },
    {
      id: "5",
      serviceId: "service-5",
      serviceName: "Physiotherapy Session",
      providerId: "provider-5",
      providerName: "Dr. Amit Patel",
      userId: user?.id || "user-1",
      userName: user?.name || "User",
      date: "2024-01-15",
      time: "11:00 AM",
      status: "completed" as const,
      amount: 1500,
      paymentStatus: "completed" as const,
      createdAt: "2024-01-12T09:00:00Z",
    },
    {
      id: "6",
      serviceId: "service-6",
      serviceName: "Hair Cut & Styling",
      providerId: "provider-6",
      providerName: "Style Studio",
      userId: user?.id || "user-1",
      userName: user?.name || "User",
      date: "2024-01-30",
      time: "6:00 PM",
      status: "confirmed" as const,
      amount: 800,
      paymentStatus: "completed" as const,
      createdAt: "2024-01-25T18:00:00Z",
    },
    {
      id: "7",
      serviceId: "service-7",
      serviceName: "Dental Cleaning",
      providerId: "provider-7",
      providerName: "Dental Care Clinic",
      userId: user?.id || "user-1",
      userName: user?.name || "User",
      date: "2024-01-12",
      time: "9:00 AM",
      status: "completed" as const,
      amount: 1200,
      paymentStatus: "completed" as const,
      createdAt: "2024-01-08T08:00:00Z",
    },
    {
      id: "8",
      serviceId: "service-8",
      serviceName: "AC Repair Service",
      providerId: "provider-8",
      providerName: "CoolTech Services",
      userId: user?.id || "user-1",
      userName: user?.name || "User",
      date: "2024-02-02",
      time: "11:00 AM",
      status: "pending" as const,
      amount: 1800,
      paymentStatus: "pending" as const,
      createdAt: "2024-01-28T10:00:00Z",
    },
    {
      id: "9",
      serviceId: "service-9",
      serviceName: "Yoga Personal Training",
      providerId: "provider-9",
      providerName: "Wellness Yoga Studio",
      userId: user?.id || "user-1",
      userName: user?.name || "User",
      date: "2024-01-08",
      time: "7:00 AM",
      status: "completed" as const,
      amount: 1000,
      paymentStatus: "completed" as const,
      createdAt: "2024-01-05T06:00:00Z",
    },
    {
      id: "10",
      serviceId: "service-10",
      serviceName: "Plumbing Repair",
      providerId: "provider-10",
      providerName: "AquaFix Services",
      userId: user?.id || "user-1",
      userName: user?.name || "User",
      date: "2024-01-05",
      time: "3:00 PM",
      status: "cancelled" as const,
      amount: 900,
      paymentStatus: "failed" as const,
      createdAt: "2024-01-02T14:00:00Z",
    },
  ];

  const filteredBookings = myBookings.filter((booking) => {
    if (statusFilter === "all") return true;
    return booking.status === statusFilter;
  });

  const getBookingStats = () => {
    return {
      total: myBookings.length,
      pending: myBookings.filter((b) => b.status === "pending").length,
      confirmed: myBookings.filter((b) => b.status === "confirmed").length,
      completed: myBookings.filter((b) => b.status === "completed").length,
      cancelled: myBookings.filter((b) => b.status === "cancelled").length,
    };
  };

  const stats = getBookingStats();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-600">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleBookingAction = (bookingId: string, action: string) => {
    switch (action) {
      case "cancel":
        dispatch(updateBookingStatus({ id: bookingId, status: "cancelled" }));
        break;
      case "reschedule":
        // In real app, open reschedule dialog
        console.log("Reschedule booking:", bookingId);
        break;
      case "contact":
        // In real app, open chat/call
        console.log("Contact provider for booking:", bookingId);
        break;
      case "review":
        // In real app, open review dialog
        console.log("Review booking:", bookingId);
        break;
      default:
        console.log("Unknown action:", action);
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
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">
              Track and manage your service bookings
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/explore'}>
              <Plus className="h-4 w-4 mr-2" />
              Book New Service
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule View
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.confirmed}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Filter Bookings</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Service Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {booking.serviceName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {booking.providerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">
                            {booking.providerName}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(booking.status)}
                        {getPaymentStatusBadge(booking.paymentStatus)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{booking.date}</p>
                          <p className="text-xs text-gray-500">Appointment Date</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{booking.time}</p>
                          <p className="text-xs text-gray-500">Time Slot</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-green-600">₹{booking.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Service Amount</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">Home Service</p>
                          <p className="text-xs text-gray-500">Location</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {booking.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleBookingAction(booking.id, "cancel")
                        }
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}

                    {(booking.status === "confirmed" ||
                      booking.status === "pending") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleBookingAction(booking.id, "reschedule")
                        }
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                    )}

                    {booking.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleBookingAction(booking.id, "review")
                        }
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleBookingAction(booking.id, "contact")
                          }
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact Provider
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleBookingAction(booking.id, "details")
                          }
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleBookingAction(booking.id, "receipt")
                          }
                        >
                          Download Receipt
                        </DropdownMenuItem>
                        {booking.status === "pending" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleBookingAction(booking.id, "cancel")
                            }
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Booking
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {statusFilter === "all"
                  ? "No bookings yet"
                  : `No ${statusFilter} bookings`}
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {statusFilter === "all"
                  ? "Start by exploring services and making your first booking."
                  : `You don't have any ${statusFilter} bookings at the moment.`}
              </p>
              {statusFilter === "all" && (
                <Button onClick={() => (window.location.href = "/explore")}>
                  Explore Services
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserBookings;
