import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuthRedux";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBookings } from "@/store/slices/dashboardSlice";
import {
  Calendar,
  CreditCard,
  Star,
  Clock,
  Plus,
  MapPin,
  Phone,
  MessageCircle,
  TrendingUp,
  User,
  Settings,
} from "lucide-react";

const UserDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { bookings, isLoading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Filter bookings for current user
  const myBookings = bookings.filter((booking) => booking.userId === user?.id);

  const upcomingBookings = myBookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "pending",
  );
  const completedBookings = myBookings.filter(
    (booking) => booking.status === "completed",
  );
  const totalSpent = completedBookings.reduce(
    (sum, booking) => sum + booking.amount,
    0,
  );
  const pendingPayments = myBookings.filter(
    (booking) => booking.paymentStatus === "pending",
  ).length;

  const stats = [
    {
      title: "Total Bookings",
      value: myBookings.length.toString(),
      description: "All time bookings",
      icon: Calendar,
      trend: "+12% from last month",
    },
    {
      title: "Upcoming Services",
      value: upcomingBookings.length.toString(),
      description: "Confirmed & pending",
      icon: Clock,
      trend: `${upcomingBookings.length} this month`,
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent.toLocaleString()}`,
      description: "Lifetime spending",
      icon: CreditCard,
      trend: "+8% from last month",
    },
    {
      title: "Pending Payments",
      value: pendingPayments.toString(),
      description: "Awaiting payment",
      icon: CreditCard,
      trend: pendingPayments > 0 ? "Action required" : "All clear",
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
        {/* Welcome Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your bookings today.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Book Service
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Bookings</CardTitle>
                  <CardDescription>
                    Your confirmed and pending appointments
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{booking.serviceName}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <User className="h-3 w-3" />
                            {booking.providerName}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {booking.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {booking.time}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : "outline"
                            }
                            className={
                              booking.status === "confirmed"
                                ? "bg-green-600"
                                : ""
                            }
                          >
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">
                            ₹{booking.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No upcoming bookings
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Book a service to see your appointments here.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Explore Services
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Book New Service
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Bookings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Payment History</span>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {booking.serviceName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Completed on {booking.date}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Rate
                      </Badge>
                    </div>
                  ))}
                  {completedBookings.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member since</span>
                    <span className="text-sm font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).getFullYear()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Total bookings
                    </span>
                    <span className="text-sm font-medium">
                      {myBookings.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Favorite category
                    </span>
                    <span className="text-sm font-medium">Home Services</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
