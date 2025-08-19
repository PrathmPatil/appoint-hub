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
    { month: "Jan", users: 1200, providers: 150, revenue: 45000 },
    { month: "Feb", users: 1350, providers: 165, revenue: 52000 },
    { month: "Mar", users: 1480, providers: 180, revenue: 58000 },
    { month: "Apr", users: 1620, providers: 200, revenue: 67000 },
    { month: "May", users: 1780, providers: 225, revenue: 78000 },
    { month: "Jun", users: 1950, providers: 250, revenue: 89000 },
  ];

  const serviceCategories = [
    { name: "Home Cleaning", value: 35, color: "#3b82f6" },
    { name: "Plumbing", value: 25, color: "#10b981" },
    { name: "Electrical", value: 20, color: "#f59e0b" },
    { name: "Garden Care", value: 15, color: "#ef4444" },
    { name: "Others", value: 5, color: "#8b5cf6" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user_signup",
      user: "John Doe",
      action: "New user registration",
      time: "2 minutes ago",
      status: "info",
    },
    {
      id: 2,
      type: "provider_signup",
      user: "CleanPro LLC",
      action: "Service provider application",
      time: "15 minutes ago",
      status: "warning",
    },
    {
      id: 3,
      type: "payment",
      user: "Sarah Johnson",
      action: "Payment processed - $120",
      time: "32 minutes ago",
      status: "success",
    },
    {
      id: 4,
      type: "issue",
      user: "Mike Davis",
      action: "Reported service issue",
      time: "1 hour ago",
      status: "error",
    },
    {
      id: 5,
      type: "review",
      user: "Emily Chen",
      action: "Left 5-star review",
      time: "2 hours ago",
      status: "success",
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
            value="1,950"
            change="+12% from last month"
            changeType="positive"
            icon={Users}
            description="Active customers"
          />
          <StatsCard
            title="Service Providers"
            value="250"
            change="+8% from last month"
            changeType="positive"
            icon={Building}
            description="Verified providers"
          />
          <StatsCard
            title="Monthly Revenue"
            value="$89,000"
            change="+23% from last month"
            changeType="positive"
            icon={DollarSign}
            description="Platform earnings"
          />
          <StatsCard
            title="Active Bookings"
            value="432"
            change="+15% from last week"
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
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
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
                        <Tooltip
                          formatter={(value) => [
                            `$${value.toLocaleString()}`,
                            "Revenue",
                          ]}
                        />
                        <Bar
                          dataKey="revenue"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">
                View and moderate user accounts
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
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
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <h3 className="font-medium">System Alerts</h3>
              <p className="text-sm text-gray-600 mt-1">
                Monitor platform health
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
