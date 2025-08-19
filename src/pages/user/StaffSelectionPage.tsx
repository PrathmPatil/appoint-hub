import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchBusinesses,
  fetchStaff,
  fetchAvailableTimeSlots,
} from "@/store/slices/businessSlice";
import type { StaffMember } from "@/store/slices/businessSlice";
import {
  Calendar as CalendarIcon,
  Clock,
  Star,
  Users,
  Building2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  User,
  Phone,
  Mail,
} from "lucide-react";

const StaffSelectionPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { businesses, staff, timeSlots, isLoading } = useAppSelector(
    (state) => state.business,
  );

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [viewMode, setViewMode] = useState<"staff" | "schedule">("staff");

  useEffect(() => {
    if (businessId) {
      dispatch(fetchBusinesses());
      dispatch(fetchStaff(businessId));
    }
  }, [businessId, dispatch]);

  const business = businesses.find((b) => b.id === businessId);
  const businessStaff = staff.filter(
    (s) => s.businessId === businessId && s.isActive,
  );

  // Mock function to calculate staff availability
  const calculateStaffAvailability = (staffMember: StaffMember) => {
    const totalHours = 8; // 8 hour work day
    const bookedHours =
      staffMember.bookedSlots?.length || Math.floor(Math.random() * 6);
    const busyPercentage = Math.min((bookedHours / totalHours) * 100, 100);
    return {
      busy: Math.round(busyPercentage),
      available: Math.round(100 - busyPercentage),
      bookedSlots: bookedHours,
      totalSlots: totalHours,
    };
  };

  // Mock function to get today's appointments
  const getTodayAppointments = (staffId: string) => {
    const appointments = [
      { time: "09:00", client: "John D.", service: "Consultation" },
      { time: "11:00", client: "Sarah M.", service: "Treatment" },
      { time: "14:00", client: "Mike R.", service: "Follow-up" },
      { time: "16:00", client: "Emma L.", service: "Therapy" },
    ];

    // Randomly assign some appointments
    return appointments.filter(() => Math.random() > 0.6);
  };

  const getAvailabilityStatus = (percentage: number) => {
    if (percentage <= 30)
      return {
        label: "Highly Available",
        color: "text-green-600 bg-green-100",
        progressColor: "bg-green-500",
      };
    if (percentage <= 60)
      return {
        label: "Moderately Busy",
        color: "text-yellow-600 bg-yellow-100",
        progressColor: "bg-yellow-500",
      };
    return {
      label: "Very Busy",
      color: "text-red-600 bg-red-100",
      progressColor: "bg-red-500",
    };
  };

  const handleStaffSelect = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setViewMode("schedule");
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && selectedStaff && businessId) {
      setSelectedDate(date);
      const dateString = date.toISOString().split("T")[0];
      dispatch(
        fetchAvailableTimeSlots({
          businessId,
          serviceId: "service-1", // Mock service ID
          date: dateString,
        }),
      );
    }
  };

  const handleBookAppointment = () => {
    if (selectedStaff && selectedDate) {
      navigate(`/business-booking/${businessId}`, {
        state: {
          preSelectedStaff: selectedStaff,
          preSelectedDate: selectedDate,
        },
      });
    }
  };

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
            <Button onClick={() => navigate("/explore")}>
              Back to Explore
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {business.name}
              </h1>
              <p className="text-gray-600">{business.description}</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4 text-sm">
            <div
              className={`flex items-center gap-2 ${viewMode === "staff" ? "text-blue-600" : "text-gray-500"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${viewMode === "staff" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                1
              </div>
              <span>Select Provider</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div
              className={`flex items-center gap-2 ${viewMode === "schedule" ? "text-blue-600" : "text-gray-500"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${viewMode === "schedule" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                2
              </div>
              <span>Choose Date & Time</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Staff Selection View */}
        {viewMode === "staff" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Service Provider
              </h2>
              <p className="text-gray-600">
                Select from {businessStaff.length} available professionals • See
                real-time availability
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {businessStaff.map((staffMember) => {
                const availability = calculateStaffAvailability(staffMember);
                const status = getAvailabilityStatus(availability.busy);
                const todayAppointments = getTodayAppointments(staffMember.id);

                return (
                  <Card
                    key={staffMember.id}
                    className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500"
                    onClick={() => handleStaffSelect(staffMember)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Staff Avatar */}
                        <div className="relative">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-lg font-medium">
                              {staffMember.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {/* Availability indicator */}
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                              availability.busy <= 30
                                ? "bg-green-500"
                                : availability.busy <= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                        </div>

                        {/* Staff Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {staffMember.name}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="capitalize">
                                  {staffMember.role}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="font-medium">
                                    {staffMember.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {staffMember.experience} years experience
                              </p>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                            >
                              {status.label}
                            </div>
                          </div>

                          {/* Availability Progress */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Today's Availability
                              </span>
                              <span className="text-sm text-gray-600">
                                {availability.available}% Available
                              </span>
                            </div>
                            <Progress
                              value={availability.busy}
                              className="h-2 mb-1"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                {availability.bookedSlots}/
                                {availability.totalSlots} slots booked
                              </span>
                              <span>{availability.busy}% busy</span>
                            </div>
                          </div>

                          {/* Specialties */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Specialties:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {staffMember.specialties.map((specialty) => (
                                <Badge
                                  key={specialty}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Today's Schedule Preview */}
                          {todayAppointments.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Today's Appointments:
                              </p>
                              <div className="space-y-1">
                                {todayAppointments
                                  .slice(0, 2)
                                  .map((appointment, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-xs text-gray-600"
                                    >
                                      <Clock className="h-3 w-3" />
                                      <span>{appointment.time}</span>
                                      <span>•</span>
                                      <span>{appointment.service}</span>
                                    </div>
                                  ))}
                                {todayAppointments.length > 2 && (
                                  <p className="text-xs text-gray-500">
                                    +{todayAppointments.length - 2} more
                                    appointments
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Contact Info */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{staffMember.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{staffMember.email}</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <Button
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStaffSelect(staffMember);
                            }}
                          >
                            Select {staffMember.name}
                            {availability.busy <= 30 && (
                              <Zap className="h-4 w-4 ml-2" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Schedule Selection View */}
        {viewMode === "schedule" && selectedStaff && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => setViewMode("staff")}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Book with {selectedStaff.name}
                </h2>
                <p className="text-gray-600">
                  Choose your preferred date and time
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Selected Staff Info */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Provider</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {selectedStaff.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{selectedStaff.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {selectedStaff.role}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm">
                            {selectedStaff.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Experience
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedStaff.experience} years
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Specialties
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedStaff.specialties
                            .slice(0, 2)
                            .map((specialty) => (
                              <Badge
                                key={specialty}
                                variant="outline"
                                className="text-xs"
                              >
                                {specialty}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => setViewMode("staff")}
                    >
                      Change Provider
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Calendar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
              </div>

              {/* Time Slots */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Available Times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedDate ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 mb-4">
                          {selectedDate.toDateString()}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "09:00",
                            "10:00",
                            "11:00",
                            "14:00",
                            "15:00",
                            "16:00",
                          ].map((time) => {
                            const isAvailable = Math.random() > 0.3;
                            return (
                              <Button
                                key={time}
                                variant={isAvailable ? "outline" : "secondary"}
                                disabled={!isAvailable}
                                className="h-auto p-3"
                              >
                                <div className="text-center">
                                  <div className="font-medium">{time}</div>
                                  <div className="text-xs text-gray-500">
                                    {isAvailable ? "Available" : "Booked"}
                                  </div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          className="w-full mt-4"
                          onClick={handleBookAppointment}
                        >
                          Continue to Booking
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Please select a date first
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffSelectionPage;
