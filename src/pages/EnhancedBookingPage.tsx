import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Star,
  Users,
  Building2,
  Check,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/hooks/useAuthRedux";
import {
  fetchBusinesses,
  fetchStaff,
  fetchFacilities,
  fetchAvailableTimeSlots,
  addBusinessBooking,
} from "@/store/slices/businessSlice";
import { fetchServices } from "@/store/slices/dashboardSlice";
import type {
  StaffMember,
  Facility,
  TimeSlot,
  BusinessBooking,
} from "@/store/slices/businessSlice";

const EnhancedBookingPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const { businesses, staff, facilities, timeSlots, isLoading } =
    useAppSelector((state) => state.business);
  const { services } = useAppSelector((state) => state.dashboard);

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchServices());
  }, [dispatch]);

  // Find the business by providerId
  const business = businesses.find((b) => b.id === providerId);

  useEffect(() => {
    if (business) {
      dispatch(fetchStaff(business.id));
      dispatch(fetchFacilities(business.id));
    }
  }, [business, dispatch]);

  // Filter data for current business
  const businessStaff = staff.filter(
    (s) => s.businessId === business?.id && s.isActive,
  );
  const businessFacilities = facilities.filter(
    (f) => f.businessId === business?.id && f.isActive,
  );
  const businessServices = services.filter((s) =>
    business?.services.includes(s.id),
  );

  useEffect(() => {
    if (selectedDate && selectedService && business) {
      const dateString = selectedDate.toISOString().split("T")[0];
      dispatch(
        fetchAvailableTimeSlots({
          businessId: business.id,
          serviceId: selectedService,
          date: dateString,
        }),
      );
    }
  }, [selectedDate, selectedService, business, dispatch]);

  const availableSlots = timeSlots.filter((slot) => {
    if (!selectedStaff) return true;
    return slot.staffId === selectedStaff.id && slot.isAvailable;
  });

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setSelectedStaff(null);
    setSelectedFacility(null);
    setSelectedTimeSlot(null);
    setCurrentStep(2);
  };

  const handleStaffSelect = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setSelectedFacility(null);
    setSelectedTimeSlot(null);
    setCurrentStep(3);
  };

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
    setSelectedTimeSlot(null);
    setCurrentStep(4);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    if (date) setCurrentStep(5);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setCurrentStep(6);
  };

  const handleBooking = () => {
    if (
      !selectedService ||
      !selectedStaff ||
      !selectedDate ||
      !selectedTimeSlot ||
      !business ||
      !user
    ) {
      console.log("Missing required data for booking:", {
        selectedService: !!selectedService,
        selectedStaff: !!selectedStaff,
        selectedDate: !!selectedDate,
        selectedTimeSlot: !!selectedTimeSlot,
        business: !!business,
        user: !!user,
      });
      alert("Please complete all required steps before confirming booking.");
      return;
    }

    const service = businessServices.find((s) => s.id === selectedService);

    const booking: BusinessBooking = {
      id: `booking-${Date.now()}`,
      businessId: business.id,
      serviceId: selectedService,
      serviceName: service?.name || "Service",
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      facilityId: selectedFacility?.id,
      facilityName: selectedFacility?.name,
      userId: user.id,
      userName: user.name,
      date: selectedDate.toISOString().split("T")[0],
      startTime: selectedTimeSlot.startTime,
      endTime: selectedTimeSlot.endTime,
      duration: selectedTimeSlot.duration,
      amount: selectedTimeSlot.price,
      status: "pending",
      paymentStatus: "pending",
      notes,
      createdAt: new Date().toISOString(),
    };

    console.log("Creating booking:", booking);
    dispatch(addBusinessBooking(booking));

    navigate("/booking-confirmation", {
      state: { booking },
    });
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);

      // Reset selections based on the step we're going back to
      if (newStep === 1) {
        setSelectedService("");
        setSelectedStaff(null);
        setSelectedFacility(null);
        setSelectedDate(undefined);
        setSelectedTimeSlot(null);
      } else if (newStep === 2) {
        setSelectedStaff(null);
        setSelectedFacility(null);
        setSelectedDate(undefined);
        setSelectedTimeSlot(null);
      } else if (newStep === 3) {
        setSelectedFacility(null);
        setSelectedDate(undefined);
        setSelectedTimeSlot(null);
      } else if (newStep === 4) {
        setSelectedDate(undefined);
        setSelectedTimeSlot(null);
      } else if (newStep === 5) {
        setSelectedTimeSlot(null);
      }
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const getTotalPrice = () => {
    return selectedTimeSlot?.price || 0;
  };

  const steps = [
    { number: 1, title: "Select Service", completed: !!selectedService },
    { number: 2, title: "Choose Staff", completed: !!selectedStaff },
    {
      number: 3,
      title: "Select Facility",
      completed: !!selectedFacility || businessFacilities.length === 0,
    },
    { number: 4, title: "Pick Date", completed: !!selectedDate },
    { number: 5, title: "Choose Time", completed: !!selectedTimeSlot },
    { number: 6, title: "Confirm Booking", completed: false },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Business Not Found</h3>
            <p className="text-gray-600 mb-4">
              The requested business could not be found.
            </p>
            <Button onClick={() => navigate("/explore")}>
              Back to Explore
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {business.name}
              </h1>
              <p className="text-gray-600">{business.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {business.address}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{business.rating}</span>
                </div>
                <Badge className="capitalize">{business.type}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.completed
                      ? "bg-blue-600 border-blue-600 text-white"
                      : currentStep === step.number
                        ? "border-blue-600 text-blue-600"
                        : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step.completed ? <Check className="h-4 w-4" /> : step.number}
                </div>
                <span
                  className={`ml-2 text-sm hidden md:block ${
                    step.completed || currentStep === step.number
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      step.completed ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Service Selection */}
            {currentStep >= 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">
                      1
                    </span>
                    Select Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {businessServices.map((service) => (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-500">
                                Duration: {service.duration}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-sm">
                                  {service.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              ₹{service.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Staff Selection */}
            {currentStep >= 2 && selectedService && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">
                      2
                    </span>
                    Choose Staff Member
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {businessStaff.map((staffMember) => {
                      const isAvailableToday = new Date().getDay() <= 5; // Simple availability check
                      const todaySchedule = isAvailableToday ? "9:00 AM - 5:00 PM" : "Not working today";

                      return (
                        <div
                          key={staffMember.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all relative ${
                            selectedStaff?.id === staffMember.id
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                          onClick={() => handleStaffSelect(staffMember)}
                        >
                          {/* Header with Avatar and Basic Info */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                  {staffMember.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              {/* Availability indicator */}
                              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                isAvailableToday ? "bg-green-500" : "bg-gray-400"
                              }`}></div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{staffMember.name}</h3>
                                {selectedStaff?.id === staffMember.id && (
                                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 capitalize font-medium">
                                {staffMember.role}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="text-sm font-medium">
                                    {staffMember.rating}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    (120+ reviews)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Experience and Availability */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600">{staffMember.experience} years experience</span>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isAvailableToday
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                {isAvailableToday ? "Available today" : "Not available"}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Today: {todaySchedule}
                            </div>
                          </div>

                          {/* Specialties */}
                          <div className="mb-3">
                            <div className="text-xs text-gray-600 mb-1 font-medium">Specializations:</div>
                            <div className="flex flex-wrap gap-1">
                              {staffMember.specialties.map((specialty, index) => (
                                <Badge
                                  key={specialty}
                                  variant="outline"
                                  className={`text-xs ${
                                    index < 2
                                      ? "bg-blue-50 border-blue-200 text-blue-700"
                                      : "bg-gray-50 border-gray-200 text-gray-600"
                                  }`}
                                >
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Staff Highlights */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600">Preferred by 85% clients</span>
                              </div>
                            </div>
                            {selectedStaff?.id === staffMember.id && (
                              <Badge className="bg-blue-600 text-white text-xs">
                                Selected
                              </Badge>
                            )}
                          </div>

                          {/* Selection overlay */}
                          {selectedStaff?.id === staffMember.id && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-5 rounded-lg pointer-events-none"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Facility Selection (Optional) */}
            {currentStep >= 3 &&
              selectedStaff &&
              businessFacilities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">
                        3
                      </span>
                      Select Facility (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {businessFacilities.map((facility) => (
                        <div
                          key={facility.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedFacility?.id === facility.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleFacilitySelect(facility)}
                        >
                          <h3 className="font-medium">{facility.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {facility.type}
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <Users className="h-3 w-3" />
                              <span>Capacity: {facility.capacity}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {facility.amenities.slice(0, 3).map((amenity) => (
                                <Badge
                                  key={amenity}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedFacility(null);
                          setCurrentStep(4);
                        }}
                      >
                        Skip Facility Selection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Step 4: Date Selection */}
            {currentStep >= 4 && selectedStaff && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">
                      4
                    </span>
                    Pick Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) =>
                        date < new Date() ||
                        date < new Date(Date.now() - 86400000)
                      }
                      className="rounded-md border"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Time Slot Selection */}
            {currentStep >= 5 && selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">
                      5
                    </span>
                    Choose Time Slot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={
                          selectedTimeSlot?.id === slot.id
                            ? "default"
                            : "outline"
                        }
                        className="h-auto p-3"
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        <div className="text-center">
                          <div className="font-medium">{slot.startTime}</div>
                          <div className="text-xs text-gray-500">
                            ₹{slot.price}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                  {availableSlots.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No available time slots for this date. Please select a
                      different date.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 6: Additional Notes */}
            {currentStep >= 6 && selectedTimeSlot && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">
                      6
                    </span>
                    Additional Notes (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="notes">Special requests or notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requirements or notes for your appointment..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedService && (
                  <div>
                    <h4 className="font-medium">Service</h4>
                    <p className="text-sm text-gray-600">
                      {
                        businessServices.find((s) => s.id === selectedService)
                          ?.name
                      }
                    </p>
                  </div>
                )}

                {selectedStaff && (
                  <div>
                    <h4 className="font-medium">Staff Member</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {selectedStaff.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">
                        {selectedStaff.name}
                      </span>
                    </div>
                  </div>
                )}

                {selectedFacility && (
                  <div>
                    <h4 className="font-medium">Facility</h4>
                    <p className="text-sm text-gray-600">
                      {selectedFacility.name}
                    </p>
                  </div>
                )}

                {selectedDate && (
                  <div>
                    <h4 className="font-medium">Date & Time</h4>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {selectedDate.toDateString()}
                      </div>
                      {selectedTimeSlot && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {selectedTimeSlot.startTime} -{" "}
                          {selectedTimeSlot.endTime}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedTimeSlot && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount</span>
                      <span className="text-lg font-bold text-blue-600">
                        ₹{getTotalPrice()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleGoBack}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go Back
                    </Button>
                  )}

                  <Button
                    className="w-full"
                    disabled={!selectedTimeSlot}
                    onClick={handleBooking}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBookingPage;
