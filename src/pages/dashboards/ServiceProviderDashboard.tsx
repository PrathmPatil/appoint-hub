import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuthRedux";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import {
  DollarSign,
  Users,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Check,
  X,
  Plus,
  Edit,
  Settings,
  BookOpen,
  CreditCard,
  UserCog,
  Briefcase,
  Building2,
  User,
  ChevronRight,
  Eye,
  MessageSquare,
  AlertCircle,
  ThumbsUp,
  Activity,
  Package,
  CheckCircle,
} from "lucide-react";
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
} from "recharts";
import { Link } from "react-router-dom";

const ServiceProviderDashboard = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Form states
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    availability: true,
    serviceType: user?.providerType === "business" ? "business" : "individual",
    location: "",
    tags: [] as string[],
    workingHours: "",
    responseTime: "",
    specialization: "",
    experience: "",
    certification: "",
    languages: [] as string[],
    serviceAreas: [] as string[],
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    specialization: "",
    bio: "",
    experience: "",
    certification: "",
    languages: [] as string[],
    responseTime: "",
    workingHours: "",
    serviceAreas: [] as string[],
    tags: [] as string[],
    businessName: "",
    businessAddress: "",
    businessDescription: "",
    businessLicense: "",
    businessType: "",
    teamSize: "",
    operatingHours: "",
    amenities: [] as string[],
    emergencyAvailable: false,
    homeService: false,
    onlineConsultation: false,
  });

  // Mock data
  const earningsData = [
    { month: "Jan", earnings: 1200, bookings: 15 },
    { month: "Feb", earnings: 1500, bookings: 18 },
    { month: "Mar", earnings: 1800, bookings: 22 },
    { month: "Apr", earnings: 2200, bookings: 28 },
    { month: "May", earnings: 2800, bookings: 35 },
    { month: "Jun", earnings: 3200, bookings: 42 },
  ];

  const upcomingBookings = [
    {
      id: 1,
      customer: "Sarah Johnson",
      customerPhone: "+91 98765 43210",
      service: "Home Cleaning",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "123 Oak Street, Mumbai",
      price: 1200,
      duration: "3 hours",
      status: "confirmed",
      customerAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=sarah",
      notes: "Please bring eco-friendly cleaning supplies",
    },
    {
      id: 2,
      customer: "Mike Davis",
      customerPhone: "+91 98765 43211",
      service: "Deep Cleaning",
      date: "2024-01-16",
      time: "2:00 PM",
      location: "456 Pine Avenue, Delhi",
      price: 1800,
      duration: "4 hours",
      status: "pending",
      customerAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=mike",
      notes: "Focus on kitchen and bathrooms",
    },
    {
      id: 3,
      customer: "Emily Chen",
      customerPhone: "+91 98765 43212",
      service: "Office Cleaning",
      date: "2024-01-17",
      time: "6:00 PM",
      location: "789 Business Park, Bangalore",
      price: 2500,
      duration: "5 hours",
      status: "confirmed",
      customerAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=emily",
      notes: "After office hours cleaning required",
    },
    {
      id: 4,
      customer: "John Smith",
      customerPhone: "+91 98765 43213",
      service: "Car Wash",
      date: "2024-01-18",
      time: "9:00 AM",
      location: "321 Residential Complex, Pune",
      price: 800,
      duration: "2 hours",
      status: "pending",
      customerAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=john",
      notes: "Premium wash with interior cleaning",
    },
  ];

  const myServices = [
    {
      id: "1",
      name: "Professional House Cleaning",
      description: "Complete home cleaning service with eco-friendly products",
      category: "Home Services",
      price: 1200,
      duration: "3 hours",
      availability: true,
      rating: 4.8,
      reviews: 45,
      bookings: 120,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Deep Cleaning Service",
      description:
        "Intensive cleaning for kitchens, bathrooms, and high-traffic areas",
      category: "Home Services",
      price: 1800,
      duration: "4 hours",
      availability: true,
      rating: 4.9,
      reviews: 32,
      bookings: 85,
      createdAt: "2024-01-05",
    },
    {
      id: "3",
      name: "Office Cleaning",
      description: "Professional office and commercial space cleaning",
      category: "Business Services",
      price: 2500,
      duration: "5 hours",
      availability: false,
      rating: 4.7,
      reviews: 28,
      bookings: 60,
      createdAt: "2024-01-10",
    },
  ];

  const recentPayments = [
    {
      id: 1,
      customer: "Sarah Johnson",
      amount: 1200,
      date: "2024-01-10",
      status: "completed",
      method: "UPI",
    },
    {
      id: 2,
      customer: "Mike Davis",
      amount: 1800,
      date: "2024-01-09",
      status: "completed",
      method: "Card",
    },
    {
      id: 3,
      customer: "Emily Chen",
      amount: 2500,
      date: "2024-01-08",
      status: "pending",
      method: "Bank Transfer",
    },
    {
      id: 4,
      customer: "John Smith",
      amount: 800,
      date: "2024-01-07",
      status: "completed",
      method: "Cash",
    },
  ];

  const categories = [
    "Home Services",
    "Healthcare & Wellness",
    "Beauty & Personal Care",
    "Legal & Financial",
    "Real Estate & Property",
    "Education & Coaching",
    "Automotive Services",
    "Business & Corporate",
    "Travel & Documentation",
  ];

  // Calculate stats
  const totalEarnings = recentPayments.reduce(
    (sum, payment) =>
      payment.status === "completed" ? sum + payment.amount : sum,
    0,
  );
  const pendingBookings = upcomingBookings.filter(
    (b) => b.status === "pending",
  ).length;
  const confirmedBookings = upcomingBookings.filter(
    (b) => b.status === "confirmed",
  ).length;
  const activeServices = myServices.filter((s) => s.availability).length;
  const averageRating =
    myServices.reduce((sum, s) => sum + s.rating, 0) / myServices.length;

  // Quick Actions
  const quickActions = [
    {
      title: "Create New Service",
      description: "Add a new service offering",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => setIsCreateServiceOpen(true),
    },
    {
      title: "View All Bookings",
      description: "Manage your appointments",
      icon: Calendar,
      color: "bg-green-500 hover:bg-green-600",
      action: () => setActiveTab("bookings"),
    },
    {
      title: "Payment History",
      description: "View earnings and transactions",
      icon: CreditCard,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => setActiveTab("payments"),
    },
    {
      title: "Account Settings",
      description: "Update your profile",
      icon: Settings,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => setIsProfileEditOpen(true),
    },
  ];

  // Handle service creation
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would dispatch to Redux store
    console.log("Creating service:", serviceForm);
    setIsCreateServiceOpen(false);
    setServiceForm({
      name: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      availability: true,
      serviceType:
        user?.providerType === "business" ? "business" : "individual",
      location: "",
      tags: [],
      workingHours: "",
      responseTime: "",
      specialization: "",
      experience: "",
      certification: "",
      languages: [],
      serviceAreas: [],
    });
  };

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: profileForm.name,
        email: profileForm.email,
      }),
    );
    setIsProfileEditOpen(false);
  };

  // Handle booking actions
  const handleBookingAction = (
    bookingId: number,
    action: "accept" | "decline",
  ) => {
    console.log(`${action} booking ${bookingId}`);
    // In a real app, this would update the booking status
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.providerType === "business" ? "Business" : "Provider"}{" "}
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.name}! Manage your services and bookings.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center">
              {user?.providerType === "business" ? (
                <Building2 className="h-3 w-3 mr-1" />
              ) : (
                <User className="h-3 w-3 mr-1" />
              )}
              {user?.providerType === "business"
                ? "Business Account"
                : "Individual Provider"}
            </Badge>
            <Button
              variant="outline"
              onClick={() => setIsProfileEditOpen(true)}
            >
              <UserCog className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used actions to manage your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
                    onClick={action.action}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-gray-500">
                        {action.description}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Monthly Earnings"
                value={`₹${totalEarnings.toLocaleString()}`}
                change="+18% from last month"
                changeType="positive"
                icon={DollarSign}
              />
              <StatsCard
                title="Active Services"
                value={activeServices.toString()}
                change={`${myServices.length} total services`}
                changeType="positive"
                icon={Package}
              />
              <StatsCard
                title="Pending Bookings"
                value={pendingBookings.toString()}
                change={`${confirmedBookings} confirmed`}
                changeType="positive"
                icon={Calendar}
              />
              <StatsCard
                title="Average Rating"
                value={averageRating.toFixed(1)}
                change="Based on recent reviews"
                changeType="positive"
                icon={Star}
              />
            </div>

            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Earnings Overview
                </CardTitle>
                <CardDescription>
                  Your earnings and booking trends over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "earnings" ? `₹${value}` : value,
                          name === "earnings" ? "Earnings" : "Bookings",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>
                    Latest booking requests and confirmations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <img
                          src={booking.customerAvatar}
                          alt={booking.customer}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {booking.customer}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.service}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.date} at {booking.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            ₹{booking.price}
                          </p>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setActiveTab("bookings")}
                  >
                    View All Bookings
                  </Button>
                </CardContent>
              </Card>

              {/* Service Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Services</CardTitle>
                  <CardDescription>
                    Your most popular service offerings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myServices.slice(0, 3).map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{service.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="text-xs">{service.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              {service.bookings} bookings
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            ₹{service.price}
                          </p>
                          <Badge
                            variant={
                              service.availability ? "default" : "secondary"
                            }
                          >
                            {service.availability ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setActiveTab("services")}
                  >
                    Manage Services
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">My Services</h2>
                <p className="text-gray-600">
                  Manage your service offerings and pricing
                </p>
              </div>
              <Button onClick={() => setIsCreateServiceOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myServices.map((service) => (
                <Card
                  key={service.id}
                  className={!service.availability ? "opacity-60" : ""}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={service.availability}
                          onCheckedChange={(checked) =>
                            console.log("Toggle service", service.id, checked)
                          }
                        />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant="outline">{service.category}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">₹{service.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">
                          {service.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({service.reviews})
                        </span>
                      </div>
                      <Badge
                        variant={service.availability ? "default" : "secondary"}
                      >
                        {service.availability ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Total Bookings</span>
                        <span className="font-medium">{service.bookings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Upcoming Bookings</h2>
              <p className="text-gray-600">Manage your appointment schedule</p>
            </div>

            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={booking.customerAvatar}
                          alt={booking.customer}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-lg">
                              {booking.customer}
                            </h4>
                            <Badge
                              variant={
                                booking.status === "confirmed"
                                  ? "default"
                                  : booking.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-gray-600 font-medium">
                                Service
                              </p>
                              <p>{booking.service}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">
                                Date & Time
                              </p>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {booking.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {booking.time} ({booking.duration})
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">
                                Location
                              </p>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.location}
                              </div>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="mb-4">
                              <p className="text-gray-600 font-medium mb-1">
                                Special Notes
                              </p>
                              <p className="text-sm bg-gray-50 p-2 rounded">
                                {booking.notes}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-green-600">
                              ₹{booking.price}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4 mr-1" />
                                {booking.customerPhone}
                              </Button>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {booking.status === "pending" && (
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleBookingAction(booking.id, "accept")
                            }
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() =>
                              handleBookingAction(booking.id, "decline")
                            }
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">Payment History</h2>
                <p className="text-gray-600">
                  Track your earnings and payment status
                </p>
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Manage Bank Account
              </Button>
            </div>

            {/* Bank Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                    Bank Account Details
                  </span>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Where your earnings will be transferred
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Bank Name
                    </p>
                    <p className="text-sm text-gray-600">HDFC Bank</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Account Number
                    </p>
                    <p className="text-sm text-gray-600">****-****-****-1234</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      IFSC Code
                    </p>
                    <p className="text-sm text-gray-600">HDFC0001234</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Account Holder
                    </p>
                    <p className="text-sm text-gray-600">{user?.name}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">
                      Account verified and active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹{totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Pending Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ₹
                    {recentPayments
                      .filter((p) => p.status === "pending")
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Awaiting payment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    Growth Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">+18%</p>
                  <p className="text-sm text-gray-500">From last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            payment.status === "completed"
                              ? "bg-green-100"
                              : "bg-yellow-100"
                          }`}
                        >
                          {payment.status === "completed" ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{payment.customer}</p>
                          <p className="text-sm text-gray-500">
                            {payment.date} • {payment.method}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{payment.amount}</p>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Analytics & Insights</h2>
              <p className="text-gray-600">
                Detailed performance metrics and trends
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>
                  Bookings and earnings comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
                      <Bar
                        dataKey="earnings"
                        fill="#10b981"
                        name="Earnings (₹)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Service Dialog */}
        <Dialog
          open={isCreateServiceOpen}
          onOpenChange={setIsCreateServiceOpen}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Add a new service offering to attract more customers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateService} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceName">Service Name</Label>
                  <Input
                    id="serviceName"
                    value={serviceForm.name}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, name: e.target.value })
                    }
                    placeholder="e.g., Professional House Cleaning"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={serviceForm.category}
                    onValueChange={(value) =>
                      setServiceForm({ ...serviceForm, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your service in detail..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, price: e.target.value })
                    }
                    placeholder="1200"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={serviceForm.duration}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        duration: e.target.value,
                      })
                    }
                    placeholder="3 hours"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="availability"
                  checked={serviceForm.availability}
                  onCheckedChange={(checked) =>
                    setServiceForm({ ...serviceForm, availability: checked })
                  }
                />
                <Label htmlFor="availability">Available for booking</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateServiceOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Service</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your{" "}
                {user?.providerType === "business" ? "business" : "personal"}{" "}
                information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileForm.city}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, city: e.target.value })
                      }
                      placeholder="Mumbai"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileForm.address}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        address: e.target.value,
                      })
                    }
                    placeholder="Complete address"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProfileEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Profile</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ServiceProviderDashboard;
