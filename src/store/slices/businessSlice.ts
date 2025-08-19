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
const generateMockBusinesses = (): Business[] => [
  {
    id: "business-1",
    name: "Serenity Spa & Wellness",
    type: "spa",
    description: "Luxury spa offering massage, facial, and wellness treatments",
    address: "123 Wellness Street, Spa District",
    phone: "+91 9876543210",
    email: "info@serenityspa.com",
    ownerId: "provider-1",
    staffCount: 8,
    facilityCount: 6,
    rating: 4.8,
    totalBookings: 1250,
    operatingHours: {
      monday: { start: "09:00", end: "20:00", isOpen: true },
      tuesday: { start: "09:00", end: "20:00", isOpen: true },
      wednesday: { start: "09:00", end: "20:00", isOpen: true },
      thursday: { start: "09:00", end: "20:00", isOpen: true },
      friday: { start: "09:00", end: "21:00", isOpen: true },
      saturday: { start: "08:00", end: "21:00", isOpen: true },
      sunday: { start: "10:00", end: "18:00", isOpen: true },
    },
    services: ["service-1", "service-2"],
    amenities: ["WiFi", "Parking", "Locker Room", "Steam Room", "Sauna"],
    images: [],
    verified: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "business-2",
    name: "HealthCare Plus Clinic",
    type: "clinic",
    description: "Modern healthcare clinic with specialist doctors",
    address: "456 Medical Avenue, Health City",
    phone: "+91 9876543211",
    email: "contact@healthcareplus.com",
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
    amenities: ["WiFi", "Parking", "Wheelchair Access", "Pharmacy", "Lab"],
    images: [],
    verified: true,
    createdAt: "2024-01-02T00:00:00Z",
  },
];

const generateMockStaff = (): StaffMember[] => [
  {
    id: "staff-1",
    name: "Dr. Sarah Johnson",
    email: "sarah@serenityspa.com",
    phone: "+91 9876543212",
    role: "therapist",
    specialties: ["Deep Tissue Massage", "Aromatherapy", "Hot Stone"],
    experience: 8,
    rating: 4.9,
    businessId: "business-1",
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
    specialties: ["Facial Treatment", "Skin Care", "Anti-Aging"],
    experience: 5,
    rating: 4.7,
    businessId: "business-1",
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
    name: "Dr. Michael Chen",
    email: "michael@healthcareplus.com",
    phone: "+91 9876543214",
    role: "doctor",
    specialties: ["General Medicine", "Cardiology", "Preventive Care"],
    experience: 12,
    rating: 4.9,
    businessId: "business-2",
    isActive: true,
    workingHours: {
      monday: { start: "08:00", end: "16:00", isWorking: true },
      tuesday: { start: "08:00", end: "16:00", isWorking: true },
      wednesday: { start: "08:00", end: "16:00", isWorking: true },
      thursday: { start: "08:00", end: "16:00", isWorking: true },
      friday: { start: "08:00", end: "16:00", isWorking: true },
      saturday: { start: "09:00", end: "13:00", isWorking: true },
      sunday: { start: "10:00", end: "12:00", isWorking: false },
    },
    bookedSlots: [],
    createdAt: "2024-01-02T00:00:00Z",
  },
];

const generateMockFacilities = (): Facility[] => [
  {
    id: "facility-1",
    name: "Relaxation Room 1",
    type: "room",
    businessId: "business-1",
    capacity: 1,
    amenities: ["Massage Table", "Sound System", "Aromatherapy"],
    isActive: true,
    bookings: [],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "facility-2",
    name: "Facial Treatment Room",
    type: "room",
    businessId: "business-1",
    capacity: 1,
    amenities: ["Facial Bed", "Steamer", "LED Light Therapy"],
    isActive: true,
    bookings: [],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "facility-3",
    name: "Consultation Room A",
    type: "room",
    businessId: "business-2",
    capacity: 1,
    amenities: ["Examination Table", "Medical Equipment", "Computer"],
    isActive: true,
    bookings: [],
    createdAt: "2024-01-02T00:00:00Z",
  },
];

// Async thunks
export const fetchBusinesses = createAsyncThunk(
  "business/fetchBusinesses",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateMockBusinesses();
  },
);

export const fetchStaff = createAsyncThunk(
  "business/fetchStaff",
  async (businessId?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const allStaff = generateMockStaff();
    return businessId
      ? allStaff.filter((s) => s.businessId === businessId)
      : allStaff;
  },
);

export const fetchFacilities = createAsyncThunk(
  "business/fetchFacilities",
  async (businessId?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const allFacilities = generateMockFacilities();
    return businessId
      ? allFacilities.filter((f) => f.businessId === businessId)
      : allFacilities;
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
} = businessSlice.actions;

export default businessSlice.reducer;
