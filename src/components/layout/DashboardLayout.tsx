import { useAuth } from "@/hooks/useAuthRedux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  BarChart3,
  Menu,
  Home,
  Building2,
  Search,
  X,
  LogOut,
  Clock,
  Heart,
  History,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ChatBot } from "@/components/chat/ChatBot";
import { NotificationSystem } from "@/components/notifications/NotificationSystem";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open on desktop
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if mobile view and handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Auto close on mobile
      } else {
        setSidebarOpen(true); // Auto open on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getNavItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ];

    switch (user?.role) {
      case "admin":
        return [
          ...baseItems,
          { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
          { href: "/dashboard/users", label: "Users", icon: Users },
          { href: "/dashboard/providers", label: "Providers", icon: Users },
          { href: "/dashboard/settings", label: "Settings", icon: Settings },
        ];
      case "service_provider":
        return [
          ...baseItems,
          { href: "/dashboard/business", label: "Business", icon: Building2 },
          { href: "/dashboard/services", label: "My Services", icon: Settings },
          { href: "/dashboard/bookings", label: "Bookings", icon: Users },
          { href: "/dashboard/earnings", label: "Earnings", icon: CreditCard },
        ];
      case "user":
        return [
          ...baseItems,
          { href: "/dashboard/search", label: "Search Services", icon: Search },
          { href: "/dashboard/bookings", label: "My Bookings", icon: Users },
          { href: "/dashboard/history", label: "Booking History", icon: History },
          { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
          { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
          { href: "/dashboard/settings", label: "Settings", icon: Settings },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`
        ${isMobile ? "fixed" : "relative"}
        inset-y-0 left-0 z-50
        ${sidebarOpen ? "w-64" : "w-0"}
        bg-white shadow-lg
        transition-all duration-300 ease-in-out
        ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
        overflow-hidden
      `}
      >
        <div className="flex flex-col h-full w-64">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b bg-white flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">AH</span>
              </div>
              <h2 className="text-xl font-bold text-blue-600">AppointHub</h2>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="p-1"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-6 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    if (isMobile) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b z-40 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="mr-2 p-2"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? (
                  <Menu className="h-5 w-5" />
                ) : (
                  <Home className="h-5 w-5" />
                )}
              </Button>

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationSystem />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user?.role?.replace("_", " ")}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ChatBot */}
      <ChatBot userId={user?.id} />
    </div>
  );
};
