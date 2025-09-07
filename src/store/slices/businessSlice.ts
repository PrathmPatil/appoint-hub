import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string; // 'manager' | 'therapist' | 'doctor' | 'stylist' | 'technician'
  specialties: string[];
  experience: number; // years
  rating: number;
  avatar?: string;
  businessId: string;
  isActive: boolean;
  workingHours: {
    [key: string]: {
      // day of week
      start: string; // "09:00"
      end: string; // "18:00"
      isWorking: boolean;
    };
  };
  bookedSlots: string[]; // ISO datetime strings
  createdAt: string;
}

export interface Facility {
  id: string;
  name: string;
  type: "room" | "equipment" | "area"; // 'Treatment Room', 'Massage Chair', 'Gym Area'
  businessId: string;
  capacity: number;
  amenities: string[];
  isActive: boolean;
  bookings: {
    date: string;
    timeSlots: string[]; // ["09:00-10:00", "10:00-11:00"]
  }[];
  createdAt: string;
}

export interface Business {
  id: string;
  name: string;
  type: "spa" | "clinic" | "salon" | "fitness" | "dental" | "hospital";
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  ownerId: string; // service_provider user id
  staffCount: number;
  facilityCount: number;
  rating: number;
  totalBookings: number;
  operatingHours: {
    [key: string]: {
      // day of week
      start: string;
      end: string;
      isOpen: boolean;
      breaks?: { start: string; end: string }[];
    };
  };
  services: string[]; // service ids
  amenities: string[];
  images: string[];
  verified: boolean;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  businessId: string;
  serviceId: string;
  staffId: string;
  facilityId?: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
  duration: number; // minutes
}

export interface BusinessBooking {
  id: string;
  businessId: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  facilityId?: string;
  facilityName?: string;
  userId: string;
  userName: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: number;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  notes?: string;
  createdAt: string;
}

interface BusinessState {
  businesses: Business[];
  staff: StaffMember[];
  facilities: Facility[];
  timeSlots: TimeSlot[];
  businessBookings: BusinessBooking[];
  currentBusiness: Business | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  businesses: [],
  staff: [],
  facilities: [],
  timeSlots: [],
  businessBookings: [],
  currentBusiness: null,
  isLoading: false,
  error: null,
};

// Mock data generators
const generateMockBusinesses = (userId?: string): Business[] => {
  const businesses = [
    {
      id: "business-1",
      name: "Serenity Spa & Wellness",
      type: "spa" as const,
      description: "Luxury spa offering massage, facial, and wellness treatments",
      address: "123 Wellness Street, Spa District, Mumbai",
      phone: "+91 9876543210",
      email: "info@serenityspa.com",
      website: "https://serenityspa.com",
      ownerId: userId || "provider-1",
      staffCount: 5,
      facilityCount: 6,
      rating: 4.8,
      totalBookings: 1250,
      operatingHours: {
        monday: { start: "09:00", end: "20:00", isOpen: true, breaks: [{ start: "13:00", end: "14:00" }] },
        tuesday: { start: "09:00", end: "20:00", isOpen: true, breaks: [{ start: "13:00", end: "14:00" }] },
        wednesday: { start: "09:00", end: "20:00", isOpen: true, breaks: [{ start: "13:00", end: "14:00" }] },
        thursday: { start: "09:00", end: "20:00", isOpen: true, breaks: [{ start: "13:00", end: "14:00" }] },
        friday: { start: "09:00", end: "21:00", isOpen: true, breaks: [{ start: "13:00", end: "14:00" }] },
        saturday: { start: "08:00", end: "21:00", isOpen: true },
        sunday: { start: "10:00", end: "18:00", isOpen: true },
      },
      services: ["service-1", "service-2"],
      amenities: ["WiFi", "Parking", "Locker Room", "Steam Room", "Sauna", "Towels", "Reception"],
      images: [],
      verified: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "business-2",
      name: "HealthCare Plus Clinic",
      type: "clinic" as const,
      description: "Modern healthcare clinic with specialist doctors",
      address: "456 Medical Avenue, Health City, Mumbai",
      phone: "+91 9876543211",
      email: "contact@healthcareplus.com",
      website: "https://healthcareplus.com",
      ownerId: "provider-2",
      staffCount: 12,
      facilityCount: 8,
      rating: 4.9,
      totalBookings: 2100,
      operatingHours: {
        monday: { start: "08:00", end: "18:00", isOpen: true },
        tuesday: { start: "08:00", end: "18:00", isOpen: true },
        wednesday: { start: "08:00", end: "18:00", isOpen: true },
        thursday: { start: "08:00", end: "18:00", isOpen: true },
        friday: { start: "08:00", end: "18:00", isOpen: true },
        saturday: { start: "09:00", end: "15:00", isOpen: true },
        sunday: { start: "10:00", end: "14:00", isOpen: false },
      },
      services: ["service-3", "service-4"],
      amenities: ["WiFi", "Parking", "Wheelchair Access", "Pharmacy", "Lab", "Emergency Care"],
      images: [],
      verified: true,
      createdAt: "2024-01-02T00:00:00Z",
    },
  ];

  return businesses;
};

const generateMockStaff = (businessId?: string): StaffMember[] => {
  const allStaff = [
    {
      id: "staff-1",
      name: "Dr. Sarah Johnson",
      email: "sarah@serenityspa.com",
      phone: "+91 9876543212",
      role: "therapist",
      specialties: ["Deep Tissue Massage", "Aromatherapy", "Hot Stone", "Swedish Massage"],
      experience: 8,
      rating: 4.9,
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=sarah",
      businessId: businessId || "business-1",
      isActive: true,
      workingHours: {
        monday: { start: "09:00", end: "17:00", isWorking: true },
        tuesday: { start: "09:00", end: "17:00", isWorking: true },
        wednesday: { start: "09:00", end: "17:00", isWorking: true },
        thursday: { start: "09:00", end: "17:00", isWorking: true },
        friday: { start: "09:00", end: "17:00", isWorking: true },
        saturday: { start: "10:00", end: "16:00", isWorking: true },
        sunday: { start: "10:00", end: "14:00", isWorking: false },
      },
      bookedSlots: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "staff-2",
      name: "Emily Rodriguez",
      email: "emily@serenityspa.com",
      phone: "+91 9876543213",
      role: "aesthetician",
      specialties: ["Facial Treatment", "Skin Care", "Anti-Aging", "Microdermabrasion"],
      experience: 5,
      rating: 4.7,
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=emily",
      businessId: businessId || "business-1",
      isActive: true,
      workingHours: {
        monday: { start: "10:00", end: "18:00", isWorking: true },
        tuesday: { start: "10:00", end: "18:00", isWorking: true },
        wednesday: { start: "10:00", end: "18:00", isWorking: true },
        thursday: { start: "10:00", end: "18:00", isWorking: true },
        friday: { start: "10:00", end: "18:00", isWorking: true },
        saturday: { start: "09:00", end: "17:00", isWorking: true },
        sunday: { start: "11:00", end: "15:00", isWorking: true },
      },
      bookedSlots: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "staff-3",
      name: "Maria Santos",
      email: "maria@serenityspa.com",
      phone: "+91 9876543215",
      role: "manager",
      specialties: ["Business Management", "Customer Service", "Operations"],
      experience: 10,
      rating: 4.8,
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=maria",
      businessId: businessId || "business-1",
      isActive: true,
      workingHours: {
        monday: { start: "08:00", end: "18:00", isWorking: true },
        tuesday: { start: "08:00", end: "18:00", isWorking: true },
        wednesday: { start: "08:00", end: "18:00", isWorking: true },
        thursday: { start: "08:00", end: "18:00", isWorking: true },
        friday: { start: "08:00", end: "18:00", isWorking: true },
        saturday: { start: "09:00", end: "16:00", isWorking: true },
        sunday: { start: "10:00", end: "14:00", isWorking: false },
      },
      bookedSlots: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "staff-4",
      name: "James Wilson",
      email: "james@serenityspa.com",
      phone: "+91 9876543216",
      role: "therapist",
      specialties: ["Sports Massage", "Reflexology", "Trigger Point Therapy"],
      experience: 6,
      rating: 4.6,
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=james",
      businessId: businessId || "business-1",
      isActive: true,
      workingHours: {
        monday: { start: "12:00", end: "20:00", isWorking: true },
        tuesday: { start: "12:00", end: "20:00", isWorking: true },
        wednesday: { start: "12:00", end: "20:00", isWorking: true },
        thursday: { start: "12:00", end: "20:00", isWorking: true },
        friday: { start: "12:00", end: "20:00", isWorking: true },
        saturday: { start: "10:00", end: "18:00", isWorking: true },
        sunday: { start: "12:00", end: "16:00", isWorking: true },
      },
      bookedSlots: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "staff-5",
      name: "Lisa Chen",
      email: "lisa@serenityspa.com",
      phone: "+91 9876543217",
      role: "aesthetician",
      specialties: ["Chemical Peels", "Laser Treatment", "Acne Treatment"],
      experience: 7,
      rating: 4.8,
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=lisa",
      businessId: businessId || "business-1",
      isActive: true,
      workingHours: {
        monday: { start: "09:00", end: "17:00", isWorking: true },
        tuesday: { start: "09:00", end: "17:00", isWorking: true },
        wednesday: { start: "09:00", end: "17:00", isWorking: false },
        thursday: { start: "09:00", end: "17:00", isWorking: true },
        friday: { start: "09:00", end: "17:00", isWorking: true },
        saturday: { start: "10:00", end: "16:00", isWorking: true },
        sunday: { start: "11:00", end: "15:00", isWorking: false },
      },
      bookedSlots: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
  ];

  return allStaff;
};

const generateMockFacilities = (businessId?: string): Facility[] => {
  const allFacilities = [
    {
      id: "facility-1",
      name: "Relaxation Room 1",
      type: "room" as const,
      businessId: businessId || "business-1",
      capacity: 1,
      amenities: ["Massage Table", "Sound System", "Aromatherapy", "Dimmer Lights", "Heating"],
      isActive: true,
      bookings: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "facility-2",
      name: "Facial Treatment Room",
      type: "room" as const,
      businessId: businessId || "business-1",
      capacity: 1,
      amenities: ["Facial Bed", "Steamer", "LED Light Therapy", "Magnifying Lamp", "Storage"],
      isActive: true,
      bookings: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "facility-3",
      name: "VIP Suite",
      type: "room" as const,
      businessId: businessId || "business-1",
      capacity: 2,
      amenities: ["Two Massage Tables", "Private Bathroom", "Jacuzzi", "Sound System", "Mini Bar"],
      isActive: true,
      bookings: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "facility-4",
      name: "Steam Room",
      type: "area" as const,
      businessId: businessId || "business-1",
      capacity: 8,
      amenities: ["Steam Generator", "Bench Seating", "Temperature Control", "Safety Features"],
      isActive: true,
      bookings: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "facility-5",
      name: "Sauna",
      type: "area" as const,
      businessId: businessId || "business-1",
      capacity: 6,
      amenities: ["Electric Heater", "Wooden Benches", "Temperature Control", "Ventilation"],
      isActive: true,
      bookings: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "facility-6",
      name: "Reception Area",
      type: "area" as const,
      businessId: businessId || "business-1",
      capacity: 20,
      amenities: ["Comfortable Seating", "Reception Desk", "WiFi", "Refreshments", "Magazines"],
      isActive: true,
      bookings: [],
      createdAt: "2024-01-01T00:00:00Z",
    },
  ];

  return allFacilities;
};

const generateMockBusinessBookings = (businessId?: string): BusinessBooking[] => {
  const bookings: BusinessBooking[] = [
    {
      id: "booking-1",
      businessId: businessId || "business-1",
      serviceId: "service-1",
      serviceName: "Deep Tissue Massage",
      staffId: "staff-1",
      staffName: "Dr. Sarah Johnson",
      facilityId: "facility-1",
      facilityName: "Relaxation Room 1",
      userId: "user-1",
      userName: "Alice Williams",
      customerPhone: "+91 9000000001",
      customerEmail: "alice@example.com",
      date: "2024-01-20",
      startTime: "10:00",
      endTime: "11:00",
      duration: 60,
      amount: 2500,
      status: "confirmed",
      paymentStatus: "completed",
      notes: "Prefers medium pressure",
      createdAt: "2024-01-18T00:00:00Z",
    },
    {
      id: "booking-2",
      businessId: businessId || "business-1",
      serviceId: "service-2",
      serviceName: "Facial Treatment",
      staffId: "staff-2",
      staffName: "Emily Rodriguez",
      facilityId: "facility-2",
      facilityName: "Facial Treatment Room",
      userId: "user-2",
      userName: "Bob Smith",
      customerPhone: "+91 9000000002",
      customerEmail: "bob@example.com",
      date: "2024-01-20",
      startTime: "14:00",
      endTime: "15:30",
      duration: 90,
      amount: 3500,
      status: "pending",
      paymentStatus: "pending",
      notes: "First time customer",
      createdAt: "2024-01-19T00:00:00Z",
    },
    {
      id: "booking-3",
      businessId: businessId || "business-1",
      serviceId: "service-1",
      serviceName: "Hot Stone Massage",
      staffId: "staff-1",
      staffName: "Dr. Sarah Johnson",
      facilityId: "facility-3",
      facilityName: "VIP Suite",
      userId: "user-3",
      userName: "Carol Johnson",
      customerPhone: "+91 9000000003",
      customerEmail: "carol@example.com",
      date: "2024-01-21",
      startTime: "16:00",
      endTime: "17:30",
      duration: 90,
      amount: 4500,
      status: "confirmed",
      paymentStatus: "completed",
      notes: "Anniversary celebration",
      createdAt: "2024-01-19T00:00:00Z",
    },
  ];

  return bookings;
};

// Async thunks
export const fetchBusinesses = createAsyncThunk(
  "business/fetchBusinesses",
  async (userId?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return generateMockBusinesses(userId);
  },
);

export const createBusiness = createAsyncThunk(
  "business/createBusiness",
  async (businessData: Omit<Business, 'id' | 'createdAt' | 'staffCount' | 'facilityCount' | 'rating' | 'totalBookings' | 'services' | 'images' | 'verified'>) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newBusiness: Business = {
      id: `business-${Date.now()}`,
      ...businessData,
      staffCount: 0,
      facilityCount: 0,
      rating: 0,
      totalBookings: 0,
      operatingHours: {
        monday: { start: "09:00", end: "18:00", isOpen: true },
        tuesday: { start: "09:00", end: "18:00", isOpen: true },
        wednesday: { start: "09:00", end: "18:00", isOpen: true },
        thursday: { start: "09:00", end: "18:00", isOpen: true },
        friday: { start: "09:00", end: "18:00", isOpen: true },
        saturday: { start: "09:00", end: "16:00", isOpen: true },
        sunday: { start: "10:00", end: "14:00", isOpen: false },
      },
      services: [],
      amenities: ["WiFi", "Parking"],
      images: [],
      verified: false,
      createdAt: new Date().toISOString(),
    };

    return newBusiness;
  },
);

export const fetchStaff = createAsyncThunk(
  "business/fetchStaff",
  async (businessId?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const allStaff = generateMockStaff(businessId);
    return businessId
      ? allStaff.filter((s) => s.businessId === businessId)
      : allStaff;
  },
);

export const fetchFacilities = createAsyncThunk(
  "business/fetchFacilities",
  async (businessId?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const allFacilities = generateMockFacilities(businessId);
    return businessId
      ? allFacilities.filter((f) => f.businessId === businessId)
      : allFacilities;
  },
);

export const fetchBusinessBookings = createAsyncThunk(
  "business/fetchBusinessBookings",
  async (businessId?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const allBookings = generateMockBusinessBookings(businessId);
    return businessId
      ? allBookings.filter((b) => b.businessId === businessId)
      : allBookings;
  },
);

export const fetchAvailableTimeSlots = createAsyncThunk(
  "business/fetchAvailableTimeSlots",
  async ({
    businessId,
    serviceId,
    date,
  }: {
    businessId: string;
    serviceId: string;
    date: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock time slot generation
    const timeSlots: TimeSlot[] = [];
    const staff = generateMockStaff().filter(
      (s) => s.businessId === businessId,
    );
    const startHour = 9;
    const endHour = 17;

    staff.forEach((staffMember) => {
      for (let hour = startHour; hour < endHour; hour++) {
        timeSlots.push({
          id: `slot-${staffMember.id}-${hour}`,
          businessId,
          serviceId,
          staffId: staffMember.id,
          facilityId: "facility-1", // Mock facility assignment
          date,
          startTime: `${hour.toString().padStart(2, "0")}:00`,
          endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
          isAvailable: Math.random() > 0.3, // 70% availability
          price: 1500,
          duration: 60,
        });
      }
    });

    return timeSlots;
  },
);

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBusiness: (state, action: PayloadAction<Business>) => {
      state.currentBusiness = action.payload;
    },
    updateStaffAvailability: (
      state,
      action: PayloadAction<{ staffId: string; bookedSlots: string[] }>,
    ) => {
      const staff = state.staff.find((s) => s.id === action.payload.staffId);
      if (staff) {
        staff.bookedSlots = action.payload.bookedSlots;
      }
    },
    addBusinessBooking: (state, action: PayloadAction<BusinessBooking>) => {
      state.businessBookings.unshift(action.payload);
    },
    updateBookingStatus: (
      state,
      action: PayloadAction<{ id: string; status: BusinessBooking["status"] }>,
    ) => {
      const booking = state.businessBookings.find(
        (b) => b.id === action.payload.id,
      );
      if (booking) {
        booking.status = action.payload.status;
      }
    },
    addStaffMember: (state, action: PayloadAction<StaffMember>) => {
      state.staff.push(action.payload);
      const biz = state.businesses.find((b) => b.id === action.payload.businessId);
      if (biz) biz.staffCount += 1;
      if (state.currentBusiness?.id === action.payload.businessId && state.currentBusiness) {
        state.currentBusiness.staffCount += 1;
      }
    },
    updateStaffMember: (
      state,
      action: PayloadAction<Partial<StaffMember> & { id: string }>,
    ) => {
      const staffIndex = state.staff.findIndex(
        (s) => s.id === action.payload.id,
      );
      if (staffIndex !== -1) {
        state.staff[staffIndex] = {
          ...state.staff[staffIndex],
          ...action.payload,
        };
      }
    },
    addFacility: (state, action: PayloadAction<Facility>) => {
      state.facilities.push(action.payload);
      const biz = state.businesses.find((b) => b.id === action.payload.businessId);
      if (biz) biz.facilityCount += 1;
      if (state.currentBusiness?.id === action.payload.businessId && state.currentBusiness) {
        state.currentBusiness.facilityCount += 1;
      }
    },
    updateFacility: (
      state,
      action: PayloadAction<Partial<Facility> & { id: string }>,
    ) => {
      const facilityIndex = state.facilities.findIndex(
        (f) => f.id === action.payload.id,
      );
      if (facilityIndex !== -1) {
        state.facilities[facilityIndex] = {
          ...state.facilities[facilityIndex],
          ...action.payload,
        };
      }
    },
    addBusiness: (state, action: PayloadAction<Business>) => {
      state.businesses.push(action.payload);
      state.currentBusiness = action.payload;
    },
    updateBusiness: (
      state,
      action: PayloadAction<Partial<Business> & { id: string }>,
    ) => {
      const businessIndex = state.businesses.findIndex(
        (b) => b.id === action.payload.id,
      );
      if (businessIndex !== -1) {
        state.businesses[businessIndex] = {
          ...state.businesses[businessIndex],
          ...action.payload,
        };
        if (state.currentBusiness?.id === action.payload.id) {
          state.currentBusiness = state.businesses[businessIndex];
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Businesses
      .addCase(fetchBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch businesses";
      })
      // Staff
      .addCase(fetchStaff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staff = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch staff";
      })
      // Facilities
      .addCase(fetchFacilities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFacilities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.facilities = action.payload;
      })
      .addCase(fetchFacilities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch facilities";
      })
      // Time Slots
      .addCase(fetchAvailableTimeSlots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTimeSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timeSlots = action.payload;
      })
      .addCase(fetchAvailableTimeSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch time slots";
      })
      // Create Business
      .addCase(createBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses.push(action.payload);
        state.currentBusiness = action.payload;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create business";
      })
      // Business Bookings
      .addCase(fetchBusinessBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businessBookings = action.payload;
      })
      .addCase(fetchBusinessBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch business bookings";
      });
  },
});

export const {
  clearError,
  setCurrentBusiness,
  updateStaffAvailability,
  addBusinessBooking,
  updateBookingStatus,
  addStaffMember,
  updateStaffMember,
  addFacility,
  updateFacility,
  addBusiness,
  updateBusiness,
} = businessSlice.actions;

export default businessSlice.reducer;
