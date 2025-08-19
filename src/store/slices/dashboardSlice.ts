import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  userId: string;
  userName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  providerId: string;
  providerName: string;
  rating: number;
  reviews: number;
  availability: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "service_provider" | "admin";
  phone?: string;
  address?: string;
  avatar?: string;
  verified: boolean;
  rating?: number;
  totalBookings: number;
  createdAt: string;
  lastActive: string;
}

export interface Analytics {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  bookingsByStatus: Record<string, number>;
  topServices: Array<{ name: string; bookings: number }>;
  userGrowth: number;
  revenueGrowth: number;
}

interface DashboardState {
  bookings: Booking[];
  services: Service[];
  users: User[];
  analytics: Analytics | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  bookings: [],
  services: [],
  users: [],
  analytics: null,
  isLoading: false,
  error: null,
};

// Mock data generators
const generateMockBookings = (): Booking[] => [
  {
    id: "1",
    serviceId: "service-1",
    serviceName: "Home Cleaning",
    providerId: "provider-1",
    providerName: "CleanPro Services",
    userId: "user-1",
    userName: "John Doe",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "confirmed",
    amount: 500,
    paymentStatus: "completed",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    serviceId: "service-2",
    serviceName: "Hair Salon",
    providerId: "provider-2",
    providerName: "Beauty Hub",
    userId: "user-2",
    userName: "Jane Smith",
    date: "2024-01-16",
    time: "2:00 PM",
    status: "pending",
    amount: 1200,
    paymentStatus: "pending",
    createdAt: "2024-01-11T14:00:00Z",
  },
];

const generateMockServices = (): Service[] => [
  {
    id: "service-1",
    name: "Professional Home Cleaning",
    description: "Complete home cleaning service including all rooms",
    category: "Home Services",
    price: 500,
    duration: "3 hours",
    providerId: "provider-1",
    providerName: "CleanPro Services",
    rating: 4.8,
    reviews: 150,
    availability: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "service-2",
    name: "Hair Cut & Styling",
    description: "Professional hair cutting and styling service",
    category: "Beauty & Personal Care",
    price: 1200,
    duration: "2 hours",
    providerId: "provider-2",
    providerName: "Beauty Hub",
    rating: 4.9,
    reviews: 200,
    availability: true,
    createdAt: "2024-01-02T00:00:00Z",
  },
];

const generateMockUsers = (): User[] => [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    phone: "+91 9876543210",
    verified: true,
    totalBookings: 5,
    createdAt: "2024-01-01T00:00:00Z",
    lastActive: "2024-01-14T10:00:00Z",
  },
  {
    id: "provider-1",
    name: "CleanPro Services",
    email: "provider@example.com",
    role: "service_provider",
    phone: "+91 9876543211",
    verified: true,
    rating: 4.8,
    totalBookings: 150,
    createdAt: "2024-01-01T00:00:00Z",
    lastActive: "2024-01-14T15:00:00Z",
  },
];

const generateMockAnalytics = (): Analytics => ({
  totalUsers: 1250,
  totalProviders: 85,
  totalBookings: 3420,
  totalRevenue: 1850000,
  monthlyRevenue: [120000, 135000, 158000, 142000, 167000, 185000],
  bookingsByStatus: {
    pending: 45,
    confirmed: 120,
    completed: 280,
    cancelled: 15,
  },
  topServices: [
    { name: "Home Cleaning", bookings: 450 },
    { name: "Hair Salon", bookings: 380 },
    { name: "Plumbing", bookings: 320 },
  ],
  userGrowth: 12.5,
  revenueGrowth: 18.3,
});

// Async thunks
export const fetchBookings = createAsyncThunk(
  "dashboard/fetchBookings",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateMockBookings();
  },
);

export const fetchServices = createAsyncThunk(
  "dashboard/fetchServices",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateMockServices();
  },
);

export const fetchUsers = createAsyncThunk("dashboard/fetchUsers", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateMockUsers();
});

export const fetchAnalytics = createAsyncThunk(
  "dashboard/fetchAnalytics",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateMockAnalytics();
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBookingStatus: (
      state,
      action: PayloadAction<{ id: string; status: Booking["status"] }>,
    ) => {
      const booking = state.bookings.find((b) => b.id === action.payload.id);
      if (booking) {
        booking.status = action.payload.status;
      }
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.unshift(action.payload);
    },
    updateService: (
      state,
      action: PayloadAction<Partial<Service> & { id: string }>,
    ) => {
      const serviceIndex = state.services.findIndex(
        (s) => s.id === action.payload.id,
      );
      if (serviceIndex !== -1) {
        state.services[serviceIndex] = {
          ...state.services[serviceIndex],
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch bookings";
      })
      // Services
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch services";
      })
      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      // Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch analytics";
      });
  },
});

export const { clearError, updateBookingStatus, addBooking, updateService } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
