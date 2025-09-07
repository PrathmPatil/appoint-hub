import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Search,
  Bell,
  Filter,
  ChevronRight,
  Target,
  Heart,
  History,
  Bookmark,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Navigation,
  Zap,
  Award,
  Activity,
} from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  totalSpent: number;
  pendingPayments: number;
  averageRating: number;
  favoriteCategory: string;
  memberSince: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  action?: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const EnhancedUserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { bookings, isLoading } = useAppSelector((state) => state.dashboard);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchBookings());
    loadDashboardData();
    loadNotifications();
  }, [dispatch]);

  const loadDashboardData = () => {
    // Enhanced dummy data for stats
    setStats({
      totalBookings: 47,
      upcomingBookings: 8,
      completedBookings: 39,
      totalSpent: 78450,
      pendingPayments: 2,
      averageRating: 4.9,
      favoriteCategory: "Healthcare & Wellness",
      memberSince: "2022",
    });

    // Enhanced recent activity with more realistic data
    setRecentActivity([
      {
        id: "1",
        type: "booking",
        title: "Dermatology Consultation Confirmed",
        description: "Dr. Priya Sharma - Tomorrow 3:00 PM",
        time: "45 minutes ago",
        status: "confirmed",
        amount: 1800
      },
      {
        id: "2",
        type: "payment",
        title: "Payment Successful",
        description: "House Cleaning Service - Maya Cleaning Co.",
        time: "3 hours ago",
        status: "completed",
        amount: 2400
      },
      {
        id: "3",
        type: "review",
        title: "Review Submitted",
        description: "⭐⭐⭐⭐⭐ Excellent physiotherapy session",
        time: "1 day ago",
        status: "completed",
        provider: "Dr. Amit Patel"
      },
      {
        id: "4",
        type: "booking",
        title: "Car Service Completed",
        description: "Premium wash & interior cleaning",
        time: "2 days ago",
        status: "completed",
        amount: 1200
      },
      {
        id: "5",
        type: "reminder",
        title: "Appointment Reminder",
        description: "Legal consultation tomorrow at 10:00 AM",
        time: "3 days ago",
        status: "info"
      },
      {
        id: "6",
        type: "booking",
        title: "Yoga Session Scheduled",
        description: "Personal trainer - Fitness Plus Studio",
        time: "5 days ago",
        status: "confirmed",
        amount: 800
      }
    ]);
  };

  const loadNotifications = () => {
    setNotifications([
      {
        id: "1",
        title: "Appointment Tomorrow",
        message: "Dermatology consultation with Dr. Priya Sharma at 3:00 PM. Please arrive 15 minutes early.",
        type: "info",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        read: false,
        actionUrl: "/dashboard/bookings"
      },
      {
        id: "2",
        title: "Payment Confirmed",
        message: "₹2,400 payment for house cleaning service has been processed. Receipt sent via email.",
        type: "success",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        read: false,
      },
      {
        id: "3",
        title: "Booking Confirmed",
        message: "Your legal consultation appointment has been confirmed for January 20th at 10:00 AM.",
        type: "success",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        read: false,
        actionUrl: "/dashboard/bookings"
      },
      {
        id: "4",
        title: "Review Request",
        message: "How was your physiotherapy session with Dr. Amit Patel? Your feedback helps others.",
        type: "info",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
        actionUrl: "/dashboard/bookings"
      },
      {
        id: "5",
        title: "Service Reminder",
        message: "Due for your monthly car service. Book now to maintain your vehicle's warranty.",
        type: "warning",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        read: true,
        actionUrl: "/explore?category=automotive"
      },
      {
        id: "6",
        title: "New Provider Available",
        message: "Elite Cleaning Services now available in your area with 4.9★ rating!",
        type: "info",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
        read: true,
        actionUrl: "/explore?category=home_services"
      }
    ]);
  };

  const quickActions: QuickAction[] = [
    {
      id: "book",
      title: "Book Service",
      description: "Find and book any service",
      icon: Plus,
      href: "/explore",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "emergency",
      title: "Emergency Services",
      description: "24/7 urgent services",
      icon: Phone,
      href: "/explore?urgent=true",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      id: "search",
      title: "Search Services",
      description: "Explore all categories",
      icon: Search,
      href: "/dashboard/search",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "history",
      title: "Booking History",
      description: "View all appointments",
      icon: History,
      href: "/dashboard/bookings",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      id: "payments",
      title: "Payments",
      description: "Manage payments & bills",
      icon: CreditCard,
      href: "/dashboard/payments",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      id: "favorites",
      title: "Favorites",
      description: "Your saved providers",
      icon: Heart,
      href: "/dashboard/favorites",
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      id: "repeat",
      title: "Repeat Booking",
      description: "Book your last service again",
      icon: RefreshCw,
      href: "/dashboard/repeat-booking",
      color: "bg-cyan-500 hover:bg-cyan-600",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Account & preferences",
      icon: Settings,
      href: "/dashboard/settings",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ];

  const serviceCategories = [
    { name: "Healthcare & Wellness", icon: "🏥", count: 347, color: "bg-blue-100 text-blue-700", trending: "+12%" },
    { name: "Beauty & Personal Care", icon: "💄", count: 289, color: "bg-pink-100 text-pink-700", trending: "+8%" },
    { name: "Home Services", icon: "🏠", count: 234, color: "bg-orange-100 text-orange-700", trending: "+15%" },
    { name: "Legal & Financial", icon: "⚖️", count: 156, color: "bg-yellow-100 text-yellow-700", trending: "+5%" },
    { name: "Automotive Services", icon: "🚗", count: 145, color: "bg-green-100 text-green-700", trending: "+18%" },
    { name: "Education & Coaching", icon: "📚", count: 98, color: "bg-purple-100 text-purple-700", trending: "+22%" },
    { name: "Business & Corporate", icon: "💼", count: 87, color: "bg-indigo-100 text-indigo-700", trending: "+9%" },
    { name: "Property & Real Estate", icon: "🏢", count: 76, color: "bg-gray-100 text-gray-700", trending: "+6%" },
    { name: "Travel & Documentation", icon: "✈️", count: 54, color: "bg-cyan-100 text-cyan-700", trending: "+11%" },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickBook = (category: string) => {
    navigate(`/explore?category=${category.toLowerCase().replace(' ', '_')}`);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
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
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your bookings and services today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/explore')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Book Service
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/search')}>
              <Search className="h-4 w-4 mr-2" />
              Search All
            </Button>
          </div>
        </div>

        {/* Quick Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for any service, provider, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
              <Button variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Bookings"
              value={stats.totalBookings.toString()}
              description="All time appointments"
              icon={Calendar}
              trend={`+12% this month`}
            />
            <StatsCard
              title="Upcoming"
              value={stats.upcomingBookings.toString()}
              description="Confirmed appointments"
              icon={Clock}
              trend={`${stats.upcomingBookings} this week`}
            />
            <StatsCard
              title="Total Spent"
              value={`₹${stats.totalSpent.toLocaleString()}`}
              description="Lifetime spending"
              icon={CreditCard}
              trend="+8% from last month"
            />
            <StatsCard
              title="Avg. Rating"
              value={stats.averageRating.toString()}
              description="Your reviews average"
              icon={Star}
              trend="⭐ Excellent"
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Access your most used features instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.id}
                      to={action.href}
                      className="group block"
                    >
                      <div className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 group-hover:scale-105 shadow-sm`}>
                        <action.icon className="h-8 w-8 mb-3" />
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs opacity-90 mt-1">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Browse by Category
                </CardTitle>
                <CardDescription>
                  Quick access to all service categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {serviceCategories.map((category) => (
                    <div
                      key={category.name}
                      onClick={() => handleQuickBook(category.name)}
                      className="cursor-pointer p-4 rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{category.name}</h3>
                            <p className="text-xs text-gray-500">{category.count} providers</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          {category.trending}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        activity.status === 'confirmed' ? 'bg-green-500' :
                        activity.status === 'completed' ? 'bg-blue-500' :
                        activity.status === 'info' ? 'bg-cyan-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">{activity.time}</p>
                          {activity.amount && (
                            <span className="text-xs font-medium text-green-600">₹{activity.amount}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant={activity.status === 'completed' ? 'default' : activity.status === 'confirmed' ? 'default' : 'outline'} className={activity.status === 'completed' ? 'bg-blue-500' : activity.status === 'confirmed' ? 'bg-green-500' : ''}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-500" />
                  Notifications
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge className="bg-red-500">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 4).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                      }`}
                      onClick={() => {
                        markNotificationAsRead(notification.id);
                        if (notification.actionUrl) {
                          navigate(notification.actionUrl);
                        }
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                        {notification.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />}
                        {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                        {notification.type === 'error' && <XCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-sm" onClick={() => navigate('/dashboard/notifications')}>
                    View All Notifications ({notifications.length})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Add profile photo to complete</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Reviews Given</span>
                      <span>34/39</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Help others by reviewing your experiences</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Loyalty Points</span>
                      <span>2,850</span>
                    </div>
                    <Progress value={57} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">1,150 points to next reward tier</p>
                  </div>
                  <div className="pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Member since</span>
                      <span className="text-sm font-medium">{stats?.memberSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Favorite category</span>
                      <span className="text-sm font-medium">{stats?.favoriteCategory}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Shortcuts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Shortcuts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/bookings')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  My Appointments
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/payments')}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment History
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/favorites')}>
                  <Heart className="h-4 w-4 mr-2" />
                  Saved Providers
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/help')}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Get Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Contact Banner */}
        <Alert>
          <Phone className="h-4 w-4" />
          <AlertDescription>
            Need immediate assistance? Call our 24/7 support line: 
            <strong className="ml-1">+1-800-APPOINT</strong> or 
            <Button variant="link" className="p-0 h-auto ml-1" onClick={() => navigate('/help')}>
              contact us online
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedUserDashboard;
