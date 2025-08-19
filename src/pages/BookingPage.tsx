import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  Star,
  Phone,
  Mail,
  Verified,
  Check,
  X,
} from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
  duration: string;
}

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
}

interface BookingData {
  provider: any;
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  selectedService: ServiceOption | null;
  notes: string;
}

const BookingPage = () => {
  const { providerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Get provider data from location state or fetch it
  const provider = location.state?.provider || {
    id: providerId,
    name: "Dr. Rajesh Kumar",
    specialization: "General Physician",
    category: "healthcare",
    rating: 4.8,
    reviewCount: 232,
    location: "Andheri West",
    distance: 4.2,
    profileImage: "https://api.dicebear.com/7.x/personas/svg?seed=1",
    isVerified: true,
    workingHours: "9 AM - 6 PM",
    tags: ["Experienced", "Insurance Accepted", "Emergency Available"],
  };

  // Mock services for the provider
  const services: ServiceOption[] = [
    {
      id: "1",
      name: "General Consultation",
      description: "Basic health checkup and consultation",
      duration: "30 min",
      price: 500,
    },
    {
      id: "2",
      name: "Detailed Consultation",
      description: "Comprehensive health assessment",
      duration: "45 min",
      price: 800,
    },
    {
      id: "3",
      name: "Follow-up Consultation",
      description: "Follow-up visit for existing patients",
      duration: "20 min",
      price: 300,
    },
  ];

  // Generate time slots for selected date
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const isAvailable = Math.random() > 0.3; // Random availability

        slots.push({
          time: timeString,
          available: isAvailable,
          price: selectedService?.price || 500,
          duration: selectedService?.duration || "30 min",
        });
      }
    }

    return slots;
  };

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate));
      setSelectedSlot(null); // Reset selected slot when date changes
    }
  }, [selectedDate, selectedService]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !selectedService) {
      alert("Please select a date, time slot, and service");
      return;
    }

    setLoading(true);

    // Simulate booking process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const bookingData = {
      provider,
      date: selectedDate,
      time: selectedSlot.time,
      service: selectedService,
      notes,
      totalAmount: selectedSlot.price,
    };

    navigate("/payment", {
      state: {
        booking: bookingData,
        provider,
      },
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    const dayOfWeek = date.getDay();
    // Disable Sundays and past dates
    return date >= today && dayOfWeek !== 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Search
            </Button>
            <h1 className="text-xl font-semibold ml-4">Book Appointment</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Provider Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <img
                    src={provider.profileImage}
                    alt={provider.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <h2 className="text-xl font-semibold">{provider.name}</h2>
                    {provider.isVerified && (
                      <Verified className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">
                    {provider.specialization}
                  </p>

                  <div className="flex items-center justify-center space-x-4 text-sm mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-gray-500 ml-1">
                        ({provider.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{provider.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {provider.tags?.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Working Hours: {provider.workingHours}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span>
                      contact@
                      {provider.name
                        .toLowerCase()
                        .replace(/\s+/g, "")
                        .replace(/\./g, "")}
                      .com
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-3">Consultation Fee</h3>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{selectedService?.price || "500"}
                    <span className="text-sm font-normal text-gray-600">
                      /{selectedService?.duration || "30 min"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Selection */}
            <Card>
              <CardHeader>
                <CardTitle>1. Select Service</CardTitle>
                <CardDescription>
                  Choose the type of consultation you need
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all text-center ${
                        selectedService?.id === service.id
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                      }`}
                      onClick={() => setSelectedService(service)}
                    >
                      <h4 className="font-semibold text-lg mb-2">
                        {service.name}
                      </h4>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ₹{service.price}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        {service.duration}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {service.description}
                      </p>
                      {selectedService?.id === service.id && (
                        <div className="flex items-center justify-center text-blue-600">
                          <Check className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle>2. Select Date</CardTitle>
                <CardDescription>
                  Choose your preferred appointment date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Calendar on Left */}
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => !isDateAvailable(date)}
                      className="rounded-md border w-full"
                    />
                  </div>

                  {/* Selected Date Info on Right */}
                  <div className="space-y-4">
                    {selectedDate ? (
                      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center mb-4">
                          <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-lg font-semibold text-blue-800">
                            Selected Date
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900 mb-2">
                          {formatDate(selectedDate)}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          Available time slots will be shown below
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span>Available</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                            <span>Unavailable</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-center">
                          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Select a Date
                          </h3>
                          <p className="text-gray-600">
                            Choose a date from the calendar to see available
                            time slots
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Time Slot Selection */}
            <Card>
              <CardHeader>
                <CardTitle>3. Select Time Slot</CardTitle>
                <CardDescription>
                  Available time slots for{" "}
                  {selectedDate ? formatDate(selectedDate) : "selected date"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={
                          selectedSlot?.time === slot.time
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`h-12 ${
                          !slot.available
                            ? "opacity-50 cursor-not-allowed"
                            : slot.time === selectedSlot?.time
                              ? "bg-blue-600 text-white"
                              : "hover:bg-blue-50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-medium">{slot.time}</div>
                          {!slot.available && (
                            <div className="text-xs text-gray-500">
                              <X className="h-3 w-3 mx-auto" />
                            </div>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Please select a date first
                  </p>
                )}

                {selectedSlot && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium">
                        {selectedSlot.time} (
                        {selectedService?.duration || "30 min"})
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>4. Additional Information (Optional)</CardTitle>
                <CardDescription>
                  Any specific requirements or symptoms you'd like to mention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your symptoms, concerns, or any specific requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Payment Buttons */}
            {selectedDate && selectedSlot && selectedService && (
              <Card>
                <CardContent className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-3">Booking Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Service:</span>
                        <p className="font-medium">{selectedService.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Date & Time:</span>
                        <p className="font-medium">
                          {selectedDate.toLocaleDateString()} at{" "}
                          {selectedSlot.time}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">
                          {selectedService.duration}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Amount:</span>
                        <p className="text-xl font-bold text-green-600">
                          ₹{selectedService.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        // Handle Pay Later
                        navigate("/booking-confirmation", {
                          state: {
                            booking: {
                              provider,
                              date: selectedDate,
                              time: selectedSlot.time,
                              service: selectedService,
                              notes,
                              totalAmount: selectedSlot.price,
                              paymentStatus: "pending",
                            },
                          },
                        });
                      }}
                      disabled={loading}
                      className="h-12"
                    >
                      Pay Later
                    </Button>

                    <Button
                      size="lg"
                      onClick={handleBooking}
                      disabled={loading}
                      className="h-12 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        `Pay Now - ₹${selectedService.price}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
