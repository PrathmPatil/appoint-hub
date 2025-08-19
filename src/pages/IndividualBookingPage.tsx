import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VerificationBadge, TrustScoreBadge } from "@/components/ui/verification-badge";
import { useAuth } from "@/hooks/useAuthRedux";
import {
  ArrowLeft,
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  Star,
  Phone,
  Mail,
  Check,
  CreditCard,
  User,
  MessageSquare,
  Info,
  CheckCircle,
  AlertCircle,
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
  category: string;
}

interface BookingFormData {
  selectedDate: Date | null;
  selectedTime: string;
  selectedService: ServiceOption | null;
  notes: string;
  contactPhone: string;
  emergencyContact: string;
  preferredLanguage: string;
  isHomeService: boolean;
  address: string;
}

const IndividualBookingPage = () => {
  const { providerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [provider, setProvider] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Service, 2: DateTime, 3: Details, 4: Confirmation
  
  const [formData, setFormData] = useState<BookingFormData>({
    selectedDate: null,
    selectedTime: "",
    selectedService: null,
    notes: "",
    contactPhone: "",
    emergencyContact: "",
    preferredLanguage: "English",
    isHomeService: false,
    address: "",
  });

  // Get provider data from state or fetch
  useEffect(() => {
    const stateProvider = location.state?.provider;
    const stateService = location.state?.selectedService;
    
    if (stateProvider) {
      setProvider(enhanceProviderData(stateProvider));
      if (stateService) {
        setSelectedService(stateService);
        setFormData(prev => ({ ...prev, selectedService: stateService }));
        setStep(2); // Skip to date/time selection
      }
    } else {
      // Fetch provider data
      fetchProviderData();
    }
  }, [providerId, location.state]);

  // Generate time slots when date is selected
  useEffect(() => {
    if (formData.selectedDate) {
      generateTimeSlots();
    }
  }, [formData.selectedDate, selectedService]);

  const enhanceProviderData = (basicProvider: any) => {
    return {
      ...basicProvider,
      services: basicProvider.services || generateServices(basicProvider.category),
      workingHours: basicProvider.workingHours || generateWorkingHours(),
      homeServiceAvailable: Math.random() > 0.5,
      languages: ["English", "Hindi", "Marathi"],
      emergencyService: Math.random() > 0.7,
    };
  };

  const fetchProviderData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockProvider = {
      id: providerId,
      name: "Dr. Sarah Johnson",
      specialization: "General Physician",
      category: "healthcare",
      rating: 4.8,
      reviewCount: 156,
      location: "Andheri West",
      isVerified: true,
      verificationLevel: "verified",
      trustScore: 9.2,
      profileImage: "https://api.dicebear.com/7.x/personas/svg?seed=sarah",
      phone: "+91 98765 43210",
      email: "dr.sarah@example.com",
      services: generateServices("healthcare"),
      workingHours: generateWorkingHours(),
      homeServiceAvailable: true,
      languages: ["English", "Hindi", "Marathi"],
      emergencyService: false,
    };
    
    setProvider(mockProvider);
    setIsLoading(false);
  };

  const generateServices = (category: string): ServiceOption[] => {
    const servicesByCategory = {
      healthcare: [
        { id: "1", name: "General Consultation", description: "Comprehensive health check-up and consultation", duration: "30 min", price: 800, category: "consultation" },
        { id: "2", name: "Health Checkup", description: "Complete physical examination", duration: "45 min", price: 1200, category: "examination" },
        { id: "3", name: "Follow-up Visit", description: "Follow-up consultation for existing patients", duration: "20 min", price: 500, category: "followup" },
      ],
      beauty: [
        { id: "1", name: "Hair Cut & Style", description: "Professional haircut and styling", duration: "60 min", price: 1200, category: "hair" },
        { id: "2", name: "Facial Treatment", description: "Deep cleansing facial with mask", duration: "90 min", price: 2000, category: "skincare" },
        { id: "3", name: "Hair Coloring", description: "Professional hair coloring service", duration: "120 min", price: 3500, category: "hair" },
      ],
      legal: [
        { id: "1", name: "Legal Consultation", description: "Initial legal advice and consultation", duration: "60 min", price: 2000, category: "consultation" },
        { id: "2", name: "Document Review", description: "Review and analysis of legal documents", duration: "45 min", price: 1500, category: "review" },
        { id: "3", name: "Contract Drafting", description: "Professional contract drafting service", duration: "90 min", price: 5000, category: "drafting" },
      ],
    };
    
    return servicesByCategory[category as keyof typeof servicesByCategory] || servicesByCategory.healthcare;
  };

  const generateWorkingHours = () => {
    return {
      monday: { open: "09:00", close: "18:00", isOpen: true },
      tuesday: { open: "09:00", close: "18:00", isOpen: true },
      wednesday: { open: "09:00", close: "18:00", isOpen: true },
      thursday: { open: "09:00", close: "18:00", isOpen: true },
      friday: { open: "09:00", close: "18:00", isOpen: true },
      saturday: { open: "10:00", close: "16:00", isOpen: true },
      sunday: { open: "10:00", close: "14:00", isOpen: false },
    };
  };

  const generateTimeSlots = () => {
    if (!formData.selectedDate || !selectedService) return;
    
    const slots: TimeSlot[] = [];
    const dayName = formData.selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const workingHours = provider?.workingHours[dayName];
    
    if (!workingHours || !workingHours.isOpen) {
      setAvailableSlots([]);
      return;
    }
    
    // Generate slots between working hours
    const startHour = parseInt(workingHours.open.split(':')[0]);
    const endHour = parseInt(workingHours.close.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        if (hour === endHour - 1 && minute === 30) break; // Don't create slot too close to closing
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        slots.push({
          time: displayTime,
          available: Math.random() > 0.3, // Randomly make some slots unavailable
          price: selectedService.price,
          duration: selectedService.duration,
        });
      }
    }
    
    setAvailableSlots(slots);
  };

  const handleServiceSelect = (service: ServiceOption) => {
    setSelectedService(service);
    setFormData(prev => ({ ...prev, selectedService: service }));
    setStep(2);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, selectedDate: date }));
    }
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, selectedTime: time }));
    setStep(3);
  };

  const handleSubmitBooking = async () => {
    setIsLoading(true);
    
    // Simulate booking API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const bookingData = {
      id: `booking-${Date.now()}`,
      providerId: provider.id,
      providerName: provider.name,
      serviceName: selectedService?.name,
      service: selectedService,
      provider: provider,
      date: formData.selectedDate,
      time: formData.selectedTime,
      totalAmount: selectedService?.price || 0,
      paymentStatus: "pending",
      status: "pending",
      notes: formData.notes,
      contactPhone: formData.contactPhone,
      userId: user?.id,
    };
    
    setIsLoading(false);
    
    // Navigate to confirmation page
    navigate('/booking-confirmation', {
      state: { booking: bookingData }
    });
  };

  if (isLoading && !provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Provider Not Found</h2>
            <p className="text-gray-600 mb-4">
              The provider you're trying to book doesn't exist.
            </p>
            <Button onClick={() => navigate('/explore')}>
              Back to Search
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Book Appointment</h1>
              <p className="text-sm text-gray-600">Complete your booking in {4 - step} more steps</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[
                  { num: 1, title: "Select Service", active: step >= 1, completed: step > 1 },
                  { num: 2, title: "Choose Date & Time", active: step >= 2, completed: step > 2 },
                  { num: 3, title: "Your Details", active: step >= 3, completed: step > 3 },
                  { num: 4, title: "Confirmation", active: step >= 4, completed: false },
                ].map((stepItem, index) => (
                  <div key={stepItem.num} className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${stepItem.completed ? 'bg-green-500 text-white' : 
                        stepItem.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
                    `}>
                      {stepItem.completed ? <Check className="h-4 w-4" /> : stepItem.num}
                    </div>
                    <span className={`ml-2 text-sm ${stepItem.active ? 'font-medium' : 'text-gray-500'}`}>
                      {stepItem.title}
                    </span>
                    {index < 3 && <div className="w-8 h-px bg-gray-300 mx-4"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Service Selection */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Service</CardTitle>
                  <CardDescription>
                    Choose the service you'd like to book with {provider.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {provider.services.map((service: ServiceOption) => (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedService?.id === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => handleServiceSelect(service)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{service.name}</h3>
                            <p className="text-gray-600 mt-1">{service.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {service.duration}
                              </span>
                              <Badge variant="outline">{service.category}</Badge>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-green-600">₹{service.price}</p>
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleServiceSelect(service);
                              }}
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Date & Time Selection */}
            {step === 2 && selectedService && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date & Time</CardTitle>
                    <CardDescription>
                      Choose your preferred appointment date and time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Calendar */}
                      <div>
                        <Label className="text-base font-medium mb-4 block">Select Date</Label>
                        <Calendar
                          mode="single"
                          selected={formData.selectedDate}
                          onSelect={handleDateSelect}
                          disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                          className="rounded-md border"
                        />
                      </div>
                      
                      {/* Time Slots */}
                      <div>
                        <Label className="text-base font-medium mb-4 block">Available Times</Label>
                        {formData.selectedDate ? (
                          <div className="space-y-2 max-h-80 overflow-y-auto">
                            {availableSlots.length > 0 ? (
                              availableSlots.map((slot) => (
                                <Button
                                  key={slot.time}
                                  variant={formData.selectedTime === slot.time ? "default" : "outline"}
                                  className="w-full justify-between"
                                  disabled={!slot.available}
                                  onClick={() => handleTimeSelect(slot.time)}
                                >
                                  <span>{slot.time}</span>
                                  <span className="text-sm">₹{slot.price}</span>
                                </Button>
                              ))
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p>No slots available for this date</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p>Please select a date first</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Home Service Option */}
                {provider.homeServiceAvailable && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{provider.name}</strong> also offers home service for this appointment type.
                      You can request a home visit in the next step.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 3: Booking Details */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>
                    Please provide additional information for your appointment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        placeholder="Your phone number"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="Emergency contact number"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <Label>Preferred Language</Label>
                    <Select 
                      value={formData.preferredLanguage} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, preferredLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {provider.languages.map((lang: string) => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Home Service Option */}
                  {provider.homeServiceAvailable && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="homeService"
                          checked={formData.isHomeService}
                          onChange={(e) => setFormData(prev => ({ ...prev, isHomeService: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="homeService">Request home service (+₹200)</Label>
                      </div>
                      {formData.isHomeService && (
                        <div>
                          <Label htmlFor="address">Service Address</Label>
                          <Textarea
                            id="address"
                            placeholder="Enter your complete address for home service"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Special Notes */}
                  <div>
                    <Label htmlFor="notes">Special Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requirements or notes for the provider"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmitBooking} 
                      disabled={isLoading || !formData.contactPhone}
                      className="flex-1"
                    >
                      {isLoading ? "Processing..." : "Confirm Booking"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle>Provider Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <img src={provider.profileImage} alt={provider.name} />
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{provider.name}</h3>
                    <p className="text-sm text-gray-600">{provider.specialization}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-gray-500">({provider.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{provider.location}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <VerificationBadge 
                      isVerified={provider.isVerified}
                      level={provider.verificationLevel}
                      size="sm"
                    />
                    <TrustScoreBadge score={provider.trustScore} size="sm" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            {selectedService && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">{selectedService.name}</h4>
                    <p className="text-sm text-gray-600">{selectedService.description}</p>
                  </div>
                  
                  {formData.selectedDate && (
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">
                        {formData.selectedDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  
                  {formData.selectedTime && (
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">{formData.selectedTime}</p>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span>Service Cost</span>
                      <span className="font-medium">₹{selectedService.price}</span>
                    </div>
                    {formData.isHomeService && (
                      <div className="flex justify-between items-center">
                        <span>Home Service</span>
                        <span className="font-medium">₹200</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-lg font-bold mt-2">
                      <span>Total</span>
                      <span>₹{selectedService.price + (formData.isHomeService ? 200 : 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Provider */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Provider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  {provider.phone}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Provider
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualBookingPage;
