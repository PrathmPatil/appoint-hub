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
    serviceName: "Professional House Cleaning",
    providerId: "provider-1",
    providerName: "Elite Cleaning Services",
    userId: "user-1",
    userName: "Rahul Sharma",
    date: "2024-01-20",
    time: "10:00 AM",
    status: "confirmed",
    amount: 2400,
    paymentStatus: "completed",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    serviceId: "service-2",
    serviceName: "Dermatology Consultation",
    providerId: "provider-2",
    providerName: "Dr. Priya Sharma",
    userId: "user-1",
    userName: "Rahul Sharma",
    date: "2024-01-22",
    time: "3:00 PM",
    status: "confirmed",
    amount: 1800,
    paymentStatus: "completed",
    createdAt: "2024-01-18T14:00:00Z",
  },
  {
    id: "3",
    serviceId: "service-3",
    serviceName: "Car Premium Wash",
    providerId: "provider-3",
    providerName: "AutoCare Pro",
    userId: "user-1",
    userName: "Rahul Sharma",
    date: "2024-01-18",
    time: "2:00 PM",
    status: "completed",
    amount: 1200,
    paymentStatus: "completed",
    createdAt: "2024-01-16T11:00:00Z",
  },
  {
    id: "4",
    serviceId: "service-4",
    serviceName: "Legal Consultation",
    providerId: "provider-4",
    providerName: "Advocate Ravi Kumar",
    userId: "user-1",
    userName: "Rahul Sharma",
    date: "2024-01-25",
    time: "4:00 PM",
    status: "pending",
    amount: 2500,
    paymentStatus: "pending",
    createdAt: "2024-01-19T16:00:00Z",
  },
  {
    id: "5",
    serviceId: "service-5",
    serviceName: "Physiotherapy Session",
    providerId: "provider-5",
    providerName: "Dr. Amit Patel",
    userId: "user-2",
    userName: "Priya Patel",
    date: "2024-01-15",
    time: "11:00 AM",
    status: "completed",
    amount: 1500,
    paymentStatus: "completed",
    createdAt: "2024-01-12T09:00:00Z",
  },
  {
    id: "6",
    serviceId: "service-6",
    serviceName: "Hair Cut & Styling",
    providerId: "provider-6",
    providerName: "Style Studio",
    userId: "user-2",
    userName: "Priya Patel",
    date: "2024-01-21",
    time: "6:00 PM",
    status: "confirmed",
    amount: 800,
    paymentStatus: "completed",
    createdAt: "2024-01-17T18:00:00Z",
  },
  {
    id: "7",
    serviceId: "service-7",
    serviceName: "Dental Cleaning",
    providerId: "provider-7",
    providerName: "Dental Care Clinic",
    userId: "user-3",
    userName: "Amit Kumar",
    date: "2024-01-19",
    time: "9:00 AM",
    status: "completed",
    amount: 1200,
    paymentStatus: "completed",
    createdAt: "2024-01-14T08:00:00Z",
  },
  {
    id: "8",
    serviceId: "service-8",
    serviceName: "AC Repair Service",
    providerId: "provider-8",
    providerName: "CoolTech Services",
    userId: "user-3",
    userName: "Amit Kumar",
    date: "2024-01-23",
    time: "11:00 AM",
    status: "pending",
    amount: 1800,
    paymentStatus: "pending",
    createdAt: "2024-01-20T10:00:00Z",
  },
];

const generateMockServices = (): Service[] => [
  {
    id: "service-1",
    name: "Professional House Cleaning",
    description: "Complete 3BHK house cleaning with eco-friendly products. Includes kitchen, bathrooms, bedrooms, and common areas.",
    category: "Home Services",
    price: 2400,
    duration: "3 hours",
    providerId: "provider-1",
    providerName: "Elite Cleaning Services",
    rating: 4.9,
    reviews: 287,
    availability: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "service-2",
    name: "Dermatology Consultation",
    description: "Comprehensive skin consultation with dermatologist. Includes skin analysis and treatment recommendations.",
    category: "Healthcare & Wellness",
    price: 1800,
    duration: "45 minutes",
    providerId: "provider-2",
    providerName: "Dr. Priya Sharma",
    rating: 4.8,
    reviews: 156,
    availability: true,
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "service-3",
    name: "Car Premium Wash",
    description: "Complete car washing with interior cleaning, wax polish, and tire shine. Includes pickup and delivery.",
    category: "Automotive Services",
    price: 1200,
    duration: "2 hours",
    providerId: "provider-3",
    providerName: "AutoCare Pro",
    rating: 4.7,
    reviews: 203,
    availability: true,
    createdAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "service-4",
    name: "Legal Consultation",
    description: "Professional legal advice for civil, criminal, and property matters. Includes document review and strategy planning.",
    category: "Legal & Financial",
    price: 2500,
    duration: "60 minutes",
    providerId: "provider-4",
    providerName: "Advocate Ravi Kumar",
    rating: 4.9,
    reviews: 142,
    availability: true,
    createdAt: "2024-01-04T00:00:00Z",
  },
  {
    id: "service-5",
    name: "Physiotherapy Session",
    description: "Professional physiotherapy treatment for muscle pain, joint issues, and rehabilitation. Includes assessment and therapy.",
    category: "Healthcare & Wellness",
    price: 1500,
    duration: "60 minutes",
    providerId: "provider-5",
    providerName: "Dr. Amit Patel",
    rating: 4.8,
    reviews: 189,
    availability: true,
    createdAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "service-6",
    name: "Hair Cut & Styling",
    description: "Professional haircut with styling, wash, and blow dry. Includes consultation for best style based on face shape.",
    category: "Beauty & Personal Care",
    price: 800,
    duration: "90 minutes",
    providerId: "provider-6",
    providerName: "Style Studio",
    rating: 4.6,
    reviews: 234,
    availability: true,
    createdAt: "2024-01-06T00:00:00Z",
  },
  {
    id: "service-7",
    name: "Dental Cleaning",
    description: "Professional dental scaling and polishing with oral health checkup. Includes fluoride treatment.",
    category: "Healthcare & Wellness",
    price: 1200,
    duration: "45 minutes",
    providerId: "provider-7",
    providerName: "Dental Care Clinic",
    rating: 4.7,
    reviews: 178,
    availability: true,
    createdAt: "2024-01-07T00:00:00Z",
  },
  {
    id: "service-8",
    name: "AC Repair & Service",
    description: "Complete AC maintenance including gas filling, filter cleaning, and performance optimization. Includes warranty.",
    category: "Home Services",
    price: 1800,
    duration: "2 hours",
    providerId: "provider-8",
    providerName: "CoolTech Services",
    rating: 4.5,
    reviews: 167,
    availability: true,
    createdAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "service-9",
    name: "Yoga Personal Training",
    description: "One-on-one yoga session with certified instructor. Includes meditation and breathing exercises.",
    category: "Education & Coaching",
    price: 1000,
    duration: "75 minutes",
    providerId: "provider-9",
    providerName: "Wellness Yoga Studio",
    rating: 4.9,
    reviews: 145,
    availability: true,
    createdAt: "2024-01-09T00:00:00Z",
  },
  {
    id: "service-10",
    name: "Apartment Interior Design",
    description: "Complete interior design consultation for 2-3 BHK apartments. Includes 3D visualization and material selection.",
    category: "Property & Real Estate",
    price: 5000,
    duration: "3 hours",
    providerId: "provider-10",
    providerName: "Design Masters",
    rating: 4.8,
    reviews: 98,
    availability: true,
    createdAt: "2024-01-10T00:00:00Z",
  },
];

const generateMockUsers = (): User[] => [
  {
    id: "user-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "user",
    phone: "+91 9876543210",
    address: "Bandra West, Mumbai",
    verified: true,
    rating: 4.9,
    totalBookings: 23,
    createdAt: "2022-03-15T00:00:00Z",
    lastActive: "2024-01-19T10:00:00Z",
  },
  {
    id: "user-2",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "user",
    phone: "+91 9876543211",
    address: "Andheri East, Mumbai",
    verified: true,
    rating: 4.8,
    totalBookings: 18,
    createdAt: "2022-05-20T00:00:00Z",
    lastActive: "2024-01-18T14:00:00Z",
  },
  {
    id: "user-3",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    role: "user",
    phone: "+91 9876543212",
    address: "Powai, Mumbai",
    verified: true,
    rating: 4.7,
    totalBookings: 15,
    createdAt: "2023-01-10T00:00:00Z",
    lastActive: "2024-01-17T16:00:00Z",
  },
  {
    id: "provider-1",
    name: "Elite Cleaning Services",
    email: "elite.cleaning@example.com",
    role: "service_provider",
    phone: "+91 9876540001",
    address: "Malad West, Mumbai",
    verified: true,
    rating: 4.9,
    totalBookings: 287,
    createdAt: "2023-02-01T00:00:00Z",
    lastActive: "2024-01-19T15:00:00Z",
  },
  {
    id: "provider-2",
    name: "Dr. Priya Sharma",
    email: "dr.priya@example.com",
    role: "service_provider",
    phone: "+91 9876540002",
    address: "Bandra East, Mumbai",
    verified: true,
    rating: 4.8,
    totalBookings: 156,
    createdAt: "2023-03-15T00:00:00Z",
    lastActive: "2024-01-19T12:00:00Z",
  },
  {
    id: "provider-3",
    name: "AutoCare Pro",
    email: "autocare.pro@example.com",
    role: "service_provider",
    phone: "+91 9876540003",
    address: "Goregaon West, Mumbai",
    verified: true,
    rating: 4.7,
    totalBookings: 203,
    createdAt: "2023-04-10T00:00:00Z",
    lastActive: "2024-01-18T18:00:00Z",
  },
];

const generateMockAnalytics = (): Analytics => ({
  totalUsers: 3650,
  totalProviders: 425,
  totalBookings: 8420,
  totalRevenue: 4850000,
  monthlyRevenue: [320000, 365000, 398000, 442000, 467000, 485000],
  bookingsByStatus: {
    pending: 145,
    confirmed: 320,
    completed: 1580,
    cancelled: 75,
  },
  topServices: [
    { name: "Healthcare & Wellness", bookings: 1450 },
    { name: "Home Services", bookings: 1280 },
    { name: "Beauty & Personal Care", bookings: 980 },
    { name: "Automotive Services", bookings: 780 },
    { name: "Legal & Financial", bookings: 650 },
  ],
  userGrowth: 19.8,
  revenueGrowth: 24.7,
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
