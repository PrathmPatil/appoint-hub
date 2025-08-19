import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Building2,
  Shield,
  Calendar,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const RoutingGuide = () => {
  const routes = [
    {
      category: "Admin Access",
      icon: Shield,
      color: "bg-red-100 text-red-600",
      badgeColor: "bg-red-600",
      account: {
        email: "admin@example.com",
        password: "admin123",
      },
      paths: [
        {
          path: "/dashboard",
          description: "Admin Dashboard with platform analytics",
        },
        {
          path: "/dashboard/analytics",
          description: "Comprehensive platform analytics",
        },
        { path: "/dashboard/users", description: "User management system" },
        {
          path: "/dashboard/providers",
          description: "Service provider management",
        },
      ],
    },
    {
      category: "Individual Provider",
      icon: User,
      color: "bg-blue-100 text-blue-600",
      badgeColor: "bg-blue-600",
      account: {
        email: "provider@example.com",
        password: "provider123",
      },
      paths: [
        { path: "/dashboard", description: "Individual provider dashboard" },
        {
          path: "/dashboard/services",
          description: "Personal service management",
        },
        {
          path: "/dashboard/bookings",
          description: "Personal booking management",
        },
        {
          path: "/dashboard/earnings",
          description: "Personal earnings tracking",
        },
      ],
    },
    {
      category: "Business Provider",
      icon: Building2,
      color: "bg-green-100 text-green-600",
      badgeColor: "bg-green-600",
      account: {
        email: "business@example.com",
        password: "business123",
      },
      paths: [
        {
          path: "/dashboard",
          description: "Business dashboard (redirects to business management)",
        },
        {
          path: "/dashboard/business",
          description: "Complete business management system",
        },
        {
          path: "/dashboard/business",
          description: "↳ Overview: Business profile, stats, hours",
        },
        {
          path: "/dashboard/business",
          description: "↳ Staff: Manage therapists, doctors, stylists",
        },
        {
          path: "/dashboard/business",
          description: "↳ Facilities: Manage rooms, equipment, areas",
        },
        {
          path: "/dashboard/business",
          description: "↳ Settings: Business configuration",
        },
      ],
    },
    {
      category: "Customer Access - NEW USER FLOW",
      icon: User,
      color: "bg-purple-100 text-purple-600",
      badgeColor: "bg-purple-600",
      account: {
        email: "user@example.com",
        password: "user123",
      },
      paths: [
        {
          path: "/services",
          description: "🔥 NEW: Service Discovery (START HERE)",
        },
        {
          path: "/staff/business-1",
          description: "🔥 Staff Selection with Availability",
        },
        {
          path: "/business-booking/business-1",
          description: "Complete Business Booking",
        },
        { path: "/dashboard", description: "User dashboard with bookings" },
        { path: "/explore", description: "Browse individual providers" },
        { path: "/dashboard/bookings", description: "View booking history" },
        {
          path: "/dashboard/payments",
          description: "Payment history & methods",
        },
      ],
    },
  ];

  const businessExamples = [
    {
      name: "Serenity Spa & Wellness",
      id: "business-1",
      type: "Spa",
      staff: "8 staff members",
      facilities: "6 treatment rooms",
      bookingPath: "/business-booking/business-1",
    },
    {
      name: "HealthCare Plus Clinic",
      id: "business-2",
      type: "Medical Clinic",
      staff: "12 medical professionals",
      facilities: "8 consultation rooms",
      bookingPath: "/business-booking/business-2",
    },
  ];

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AppointHub Business System - Testing Guide
          </h1>
          <p className="text-lg text-gray-600">
            Complete paths and demo accounts for testing business-level
            functionality
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Card key={route.category} className="text-center">
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${route.color} mb-3`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{route.category}</CardTitle>
                  <Badge className={route.badgeColor}>Demo Account</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Email:</strong> {route.account.email}
                    </div>
                    <div>
                      <strong>Password:</strong> {route.account.password}
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    size="sm"
                    onClick={() => handleNavigate("/login")}
                  >
                    Login & Test
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Routes by Category */}
        <div className="space-y-8">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Card key={route.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${route.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {route.category} - Available Paths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {route.paths.map((pathInfo, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {pathInfo.path}
                          </code>
                          <p className="text-sm text-gray-600 mt-1">
                            {pathInfo.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleNavigate(pathInfo.path)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Business Booking Examples */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-green-600" />
              Test Business-Level Booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Experience the complete business booking flow with staff and
              facility selection:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businessExamples.map((business) => (
                <Card
                  key={business.id}
                  className="border-2 border-dashed border-gray-300"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {business.name}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>Type: {business.type}</div>
                      <div>Staff: {business.staff}</div>
                      <div>Facilities: {business.facilities}</div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleNavigate(business.bookingPath)}
                    >
                      Test Business Booking
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Differences */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">
              Key Differences: Individual vs Business
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 mb-3">
                  Individual Provider
                </h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Direct service booking</li>
                  <li>• Personal calendar management</li>
                  <li>• Individual earnings tracking</li>
                  <li>• Simple service portfolio</li>
                  <li>
                    • Path: <code>/booking/:providerId</code>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-3">
                  Business Provider
                </h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Staff & facility selection</li>
                  <li>• Complex availability management</li>
                  <li>• Business analytics & reporting</li>
                  <li>• Multi-level booking system</li>
                  <li>
                    • Path: <code>/business-booking/:businessId</code>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoutingGuide;
