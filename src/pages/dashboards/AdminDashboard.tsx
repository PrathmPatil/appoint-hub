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
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  Building,
  AlertTriangle,
  Eye,
  MessageSquare,
  BarChart3,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const platformGrowthData = [
    { month: "Jul", users: 2100, providers: 267, revenue: 125000, transactions: 1580, disputes: 12 },
    { month: "Aug", users: 2350, providers: 289, revenue: 142000, transactions: 1820, disputes: 8 },
    { month: "Sep", users: 2580, providers: 312, revenue: 156000, transactions: 2010, disputes: 15 },
    { month: "Oct", users: 2890, providers: 341, revenue: 178000, transactions: 2280, disputes: 6 },
    { month: "Nov", users: 3200, providers: 378, revenue: 195000, transactions: 2540, disputes: 9 },
    { month: "Dec", users: 3650, providers: 425, revenue: 234000, transactions: 2890, disputes: 4 },
  ];

  const serviceCategories = [
    { name: "Healthcare & Wellness", value: 28, color: "#3b82f6", providers: 125, bookings: 2890 },
    { name: "Home Services", value: 22, color: "#10b981", providers: 98, bookings: 2340 },
    { name: "Beauty & Personal Care", value: 18, color: "#f59e0b", providers: 87, bookings: 1890 },
    { name: "Legal & Financial", value: 12, color: "#ef4444", providers: 56, bookings: 1200 },
    { name: "Automotive Services", value: 10, color: "#8b5cf6", providers: 45, bookings: 980 },
    { name: "Education & Coaching", value: 6, color: "#06b6d4", providers: 32, bookings: 650 },
    { name: "Others", value: 4, color: "#6b7280", providers: 28, bookings: 420 },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user_signup",
      user: "Rahul Sharma",
      action: "New user registration from Mumbai",
      time: "3 minutes ago",
      status: "info",
      details: "Email verified, profile 85% complete",
    },
    {
      id: 2,
      type: "provider_signup",
      user: "Elite Cleaning Services",
      action: "Business provider application submitted",
      time: "12 minutes ago",
      status: "warning",
      details: "Verification documents pending review",
    },
    {
      id: 3,
      type: "payment",
      user: "Priya Patel",
      action: "High-value payment processed - ₹15,500",
      time: "28 minutes ago",
      status: "success",
      details: "Corporate cleaning service booking",
    },
    {
      id: 4,
      type: "dispute",
      user: "Vikram Singh",
      action: "Service quality dispute raised",
      time: "45 minutes ago",
      status: "error",
      details: "Auto-escalated to senior support team",
    },
    {
      id: 5,
      type: "review",
      user: "Anjali Desai",
      action: "Left detailed 5-star review with photos",
      time: "1 hour ago",
      status: "success",
      details: "Healthcare consultation service",
    },
    {
      id: 6,
      type: "verification",
      user: "Dr. Amit Kumar",
      action: "Professional verification completed",
      time: "1.5 hours ago",
      status: "success",
      details: "Medical license and certificates approved",
    },
    {
      id: 7,
      type: "security",
      user: "System Alert",
      action: "Suspicious login attempt blocked",
      time: "2 hours ago",
      status: "warning",
      details: "Multiple failed attempts from foreign IP",
    },
    {
      id: 8,
      type: "milestone",
      user: "Platform Stats",
      action: "Monthly target achieved - 3000+ bookings",
      time: "3 hours ago",
      status: "success",
      details: "15% ahead of projected growth",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_signup":
        return <UserCheck className="h-4 w-4" />;
      case "provider_signup":
        return <Building className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      case "issue":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Master Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Complete platform analytics and management
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value="3,650"
            change="+14% from last month"
            changeType="positive"
            icon={Users}
            description="Active customers"
          />
          <StatsCard
            title="Service Providers"
            value="425"
            change="+12% from last month"
            changeType="positive"
            icon={Building}
            description="Verified providers"
          />
          <StatsCard
            title="Monthly Revenue"
            value="₹2,34,000"
            change="+20% from last month"
            changeType="positive"
            icon={DollarSign}
            description="Platform commission"
          />
          <StatsCard
            title="Active Bookings"
            value="587"
            change="+18% from last week"
            changeType="positive"
            icon={Activity}
            description="Currently in progress"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Platform Growth
              </CardTitle>
              <CardDescription>
                Users, providers, and revenue over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={platformGrowthData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      axisLine={true}
                      tickLine={true}
                      tick={true}
                    />
                    <YAxis axisLine={true} tickLine={true} tick={true} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="providers"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Providers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Service Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
              <CardDescription>
                Distribution of services by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceCategories}
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
                      {serviceCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Breakdown</CardTitle>
            <CardDescription>
              Platform revenue growth over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
            <CardDescription>
              Latest user actions and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 border rounded-lg"
                >
                  <div
                    className={`p-2 rounded-full ${getActivityColor(activity.status)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Management Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center relative">
              <Badge className="absolute top-2 right-2 bg-blue-500">142</Badge>
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">
                View and moderate user accounts
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center relative">
              <Badge className="absolute top-2 right-2 bg-orange-500">8</Badge>
              <Building className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium">Provider Applications</h3>
              <p className="text-sm text-gray-600 mt-1">
                Review pending applications
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <h3 className="font-medium">Financial Reports</h3>
              <p className="text-sm text-gray-600 mt-1">
                Detailed revenue analytics
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center relative">
              <Badge className="absolute top-2 right-2 bg-red-500">3</Badge>
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <h3 className="font-medium">System Alerts</h3>
              <p className="text-sm text-gray-600 mt-1">
                Monitor platform health
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center relative">
              <Badge className="absolute top-2 right-2 bg-purple-500">12</Badge>
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium">Support Tickets</h3>
              <p className="text-sm text-gray-600 mt-1">
                Customer support queue
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
              <h3 className="font-medium">Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">
                Platform performance metrics
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center relative">
              <Badge className="absolute top-2 right-2 bg-green-500">24</Badge>
              <UserCheck className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium">Verifications</h3>
              <p className="text-sm text-gray-600 mt-1">
                ID and document verification
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
              <h3 className="font-medium">Growth Insights</h3>
              <p className="text-sm text-gray-600 mt-1">
                Market trends and opportunities
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
