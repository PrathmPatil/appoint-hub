import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDashboard from "./pages/dashboards/EnhancedUserDashboard";
import ServiceProviderDashboard from "./pages/dashboards/ServiceProviderDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

// Admin pages
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminVerification from "./pages/admin/AdminVerification";

// Provider pages
import ProviderServices from "./pages/provider/ProviderServices";
import ProviderEarnings from "./pages/provider/ProviderEarnings";
import BusinessManagement from "./pages/provider/BusinessManagement";

// User pages
import UserBookings from "./pages/user/UserBookings";
import UserPayments from "./pages/user/UserPayments";
import BookingHistory from "./pages/user/BookingHistory";
import ServiceSearchDashboard from "./pages/user/ServiceSearchDashboard";

// Provider type selector
import ProviderTypeSelector from "./pages/ProviderTypeSelector";
import RoutingGuide from "./pages/RoutingGuide";
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentError from "./pages/payment/PaymentError";
import HelpCenter from "./pages/HelpCenter";
import Explore from "./pages/Explore";
import BookingPage from "./pages/BookingPage";
import EnhancedBookingPage from "./pages/EnhancedBookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";

// User flow pages
import ServiceDiscovery from "./pages/user/ServiceDiscovery";
import StaffSelectionPage from "./pages/user/StaffSelectionPage";

// Verification pages
import VerificationSettings from "./pages/VerificationSettings";

// Provider pages
import ProviderDetails from "./pages/ProviderDetails";
import IndividualBookingPage from "./pages/IndividualBookingPage";

const queryClient = new QueryClient();

// Dashboard router component to redirect based on user role
const DashboardRouter = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "service_provider":
      // Check if provider type is set
      if (!user.providerType) {
        return <ProviderTypeSelector />;
      }
      // Route based on provider type
      if (user.providerType === "business") {
        return <Navigate to="/dashboard/business" replace />;
      } else {
        return <ServiceProviderDashboard />;
      }
    case "user":
      return <UserDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/explore" element={<ServiceDiscovery />} />
            <Route path="/services" element={<ServiceDiscovery />} />
            <Route path="/staff/:businessId" element={<StaffSelectionPage />} />
            <Route path="/provider/:providerId" element={<ProviderDetails />} />
            <Route path="/guide" element={<RoutingGuide />} />
            <Route path="/booking/:providerId" element={<IndividualBookingPage />} />
            <Route
              path="/business-booking/:providerId"
              element={<EnhancedBookingPage />}
            />
            <Route
              path="/booking-confirmation"
              element={<BookingConfirmation />}
            />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/dashboard/analytics"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/providers"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminProviders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/verification"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminVerification />
                </ProtectedRoute>
              }
            />

            {/* Service Provider Routes */}
            <Route
              path="/dashboard/services"
              element={
                <ProtectedRoute requiredRole="service_provider">
                  <ProviderServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/bookings"
              element={
                <ProtectedRoute>
                  <UserBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/earnings"
              element={
                <ProtectedRoute requiredRole="service_provider">
                  <ProviderEarnings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/business"
              element={
                <ProtectedRoute requiredRole="service_provider">
                  <BusinessManagement />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/dashboard/payments"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/history"
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/search"
              element={
                <ProtectedRoute>
                  <ServiceSearchDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/favorites"
              element={
                <ProtectedRoute>
                  <ServiceSearchDashboard />
                </ProtectedRoute>
              }
            />

            {/* Payment Routes */}
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/error"
              element={
                <ProtectedRoute>
                  <PaymentError />
                </ProtectedRoute>
              }
            />

            {/* Settings Route (available to all authenticated users) */}
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings/verification"
              element={
                <ProtectedRoute>
                  <VerificationSettings />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
