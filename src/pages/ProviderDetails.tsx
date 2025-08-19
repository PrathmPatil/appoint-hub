import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VerificationBadge, TrustScoreBadge } from "@/components/ui/verification-badge";
import { useAuth } from "@/hooks/useAuthRedux";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  Heart,
  Share2,
  MessageCircle,
  Building2,
  User,
  Award,
  CheckCircle,
  Camera,
  Globe,
  CreditCard,
  Zap,
  Shield,
  TrendingUp,
  Navigation,
  Info,
  ChevronRight,
  Bookmark,
  Flag,
} from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  category: string;
}

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  serviceName: string;
  verified: boolean;
}

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: "work" | "facility" | "team";
}

interface Provider {
  id: string;
  name: string;
  type: "individual" | "business";
  specialization: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  location: string;
  address: string;
  distance: number;
  isVerified: boolean;
  verificationLevel: "basic" | "verified" | "premium";
  trustScore: number;
  isOnline: boolean;
  profileImage: string;
  coverImage: string;
  phone: string;
  email: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  workingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  services: ServiceItem[];
  gallery: GalleryImage[];
  reviews: Review[];
  responseTime: string;
  completedBookings: number;
  languages: string[];
  amenities: string[];
  tags: string[];
  experience: string;
  education?: string[];
  certifications?: string[];
  businessInfo?: {
    staffCount: number;
    yearEstablished: number;
    licenseNumber?: string;
  };
  pricing: {
    min: number;
    max: number;
    currency: string;
  };
  availability: {
    nextSlot: string;
    slotsAvailable: number;
  };
}

const ProviderDetails = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get provider data from location state or fetch
  useEffect(() => {
    const stateProvider = location.state?.provider;
    if (stateProvider) {
      setProvider(enhanceProviderData(stateProvider));
      setIsLoading(false);
    } else {
      // Fetch provider data from API
      fetchProviderData();
    }
  }, [providerId, location.state]);

  const fetchProviderData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock provider data
    const mockProvider = generateMockProvider();
    setProvider(mockProvider);
    setIsLoading(false);
  };

  const enhanceProviderData = (basicProvider: any): Provider => {
    return {
      ...basicProvider,
      description: generateDescription(basicProvider.type, basicProvider.specialization),
      coverImage: `https://picsum.photos/800/300?random=${basicProvider.id}`,
      phone: "+91 98765 43210",
      email: `${basicProvider.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      website: `https://${basicProvider.name.toLowerCase().replace(/\s+/g, '')}.com`,
      socialMedia: {
        instagram: `@${basicProvider.name.toLowerCase().replace(/\s+/g, '')}`,
        facebook: basicProvider.name,
      },
      workingHours: generateWorkingHours(),
      services: generateServices(basicProvider.category),
      gallery: generateGallery(),
      reviews: generateReviews(),
      languages: ["English", "Hindi", "Marathi"],
      amenities: generateAmenities(basicProvider.type),
      education: basicProvider.type === "individual" ? generateEducation() : undefined,
      certifications: generateCertifications(basicProvider.category),
      businessInfo: basicProvider.type === "business" ? {
        staffCount: Math.floor(Math.random() * 20) + 5,
        yearEstablished: 2020 - Math.floor(Math.random() * 15),
        licenseNumber: `LIC${Math.random().toString().slice(2, 8)}`,
      } : undefined,
    };
  };

  const generateMockProvider = (): Provider => {
    return {
      id: providerId || "provider-1",
      name: "Dr. Sarah Johnson",
      type: "individual",
      specialization: "Cardiologist",
      category: "healthcare",
      description: "Experienced cardiologist with over 10 years of practice...",
      rating: 4.8,
      reviewCount: 156,
      location: "Andheri West",
      address: "123 Medical Center, Andheri West, Mumbai - 400058",
      distance: 2.5,
      isVerified: true,
      verificationLevel: "verified",
      trustScore: 9.2,
      isOnline: true,
      profileImage: "https://api.dicebear.com/7.x/personas/svg?seed=sarah",
      coverImage: "https://picsum.photos/800/300?random=1",
      phone: "+91 98765 43210",
      email: "dr.sarah@example.com",
      website: "https://drsarah.com",
      workingHours: generateWorkingHours(),
      services: generateServices("healthcare"),
      gallery: generateGallery(),
      reviews: generateReviews(),
      responseTime: "Within 15 mins",
      completedBookings: 1250,
      languages: ["English", "Hindi", "Marathi"],
      amenities: ["Online Consultation", "Insurance Accepted", "Emergency Available"],
      tags: ["Experienced", "Highly Rated", "Emergency Available"],
      experience: "10+ years",
      education: ["MBBS - Mumbai University", "MD Cardiology - AIIMS Delhi"],
      certifications: ["Board Certified Cardiologist", "Advanced Cardiac Life Support"],
      pricing: {
        min: 800,
        max: 2000,
        currency: "₹",
      },
      availability: {
        nextSlot: "Today 2:30 PM",
        slotsAvailable: 4,
      },
    };
  };

  const handleBookService = (service?: ServiceItem) => {
    if (service) {
      setSelectedService(service);
    }
    
    if (provider?.type === "business") {
      navigate(`/business-booking/${providerId}`, {
        state: { 
          provider,
          selectedService: service || selectedService,
        }
      });
    } else {
      navigate(`/booking/${providerId}`, {
        state: { 
          provider,
          selectedService: service || selectedService,
        }
      });
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would also update the backend
  };

  const handleContactProvider = (method: "call" | "message" | "email") => {
    switch (method) {
      case "call":
        window.open(`tel:${provider?.phone}`);
        break;
      case "email":
        window.open(`mailto:${provider?.email}`);
        break;
      case "message":
        // Open chat or messaging interface
        break;
    }
  };

  const getWorkingHoursToday = () => {
    if (!provider) return null;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return provider.workingHours[today];
  };

  const isOpenNow = () => {
    const todayHours = getWorkingHoursToday();
    if (!todayHours || !todayHours.isOpen) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  // Helper functions for generating mock data
  const generateDescription = (type: string, specialization: string) => {
    const descriptions = {
      individual: `Experienced ${specialization.toLowerCase()} with over 10 years of practice. Dedicated to providing personalized care and exceptional service to every client. Known for attention to detail and professional excellence.`,
      business: `Leading ${specialization.toLowerCase()} center offering comprehensive services with a team of qualified professionals. State-of-the-art facilities and commitment to customer satisfaction.`
    };
    return descriptions[type as keyof typeof descriptions];
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

  const generateServices = (category: string): ServiceItem[] => {
    const servicesByCategory = {
      healthcare: [
        { id: "1", name: "General Consultation", description: "Comprehensive health check-up", duration: "30 min", price: 800, category: "consultation" },
        { id: "2", name: "ECG Test", description: "Electrocardiogram test", duration: "15 min", price: 500, category: "diagnostic" },
        { id: "3", name: "Stress Test", description: "Cardiac stress testing", duration: "45 min", price: 1500, category: "diagnostic" },
      ],
      beauty: [
        { id: "1", name: "Hair Cut & Style", description: "Professional haircut and styling", duration: "60 min", price: 1200, category: "hair" },
        { id: "2", name: "Facial Treatment", description: "Deep cleansing facial", duration: "90 min", price: 2000, category: "skincare" },
        { id: "3", name: "Manicure", description: "Complete nail care", duration: "45 min", price: 800, category: "nails" },
      ],
      // Add more categories as needed
    };
    return servicesByCategory[category as keyof typeof servicesByCategory] || [];
  };

  const generateGallery = (): GalleryImage[] => {
    return Array.from({ length: 9 }, (_, index) => ({
      id: `img-${index + 1}`,
      url: `https://picsum.photos/400/300?random=${index + 10}`,
      caption: `Gallery image ${index + 1}`,
      category: (["work", "facility", "team"] as const)[index % 3],
    }));
  };

  const generateReviews = (): Review[] => {
    return Array.from({ length: 8 }, (_, index) => ({
      id: `review-${index + 1}`,
      userName: ["Amit Sharma", "Priya Patel", "Raj Kumar", "Sarah Johnson"][index % 4],
      userAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${index}`,
      rating: 4 + Math.random(),
      comment: [
        "Excellent service! Very professional and attentive.",
        "Highly recommend. Great experience overall.",
        "Quick and efficient. Will definitely come back.",
        "Outstanding quality and customer service."
      ][index % 4],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      serviceName: "General Consultation",
      verified: Math.random() > 0.3,
    }));
  };

  const generateAmenities = (type: string) => {
    const common = ["Wi-Fi", "AC", "Parking", "Wheelchair Accessible"];
    const individual = ["Online Consultation", "Home Visit", "Emergency Service"];
    const business = ["Multiple Specialists", "Lab Services", "Pharmacy", "Insurance"];
    
    return type === "business" ? [...common, ...business] : [...common, ...individual];
  };

  const generateEducation = () => {
    return ["MBBS - Mumbai University", "MD - AIIMS Delhi", "Fellowship in Cardiology"];
  };

  const generateCertifications = (category: string) => {
    const certsByCategory = {
      healthcare: ["Board Certified", "Advanced Life Support", "Medical License"],
      beauty: ["Certified Cosmetologist", "Advanced Skincare", "Hair Styling Certificate"],
      legal: ["Bar Association Member", "LLB Degree", "Specialized Practice License"],
    };
    return certsByCategory[category as keyof typeof certsByCategory] || ["Professional Certification"];
  };

  if (isLoading) {
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
              The provider you're looking for doesn't exist.
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <nav className="text-sm text-gray-500">
                <span>Explore</span>
                <ChevronRight className="h-4 w-4 inline mx-2" />
                <span>{provider.category}</span>
                <ChevronRight className="h-4 w-4 inline mx-2" />
                <span className="text-gray-900">{provider.name}</span>
              </nav>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card>
              <div className="relative">
                <img 
                  src={provider.coverImage} 
                  alt={provider.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <Button
                    variant={isFavorite ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleFavorite}
                    className="bg-white/90 backdrop-blur-sm"
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <img src={provider.profileImage} alt={provider.name} className="object-cover" />
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold">{provider.name}</h1>
                      {provider.isVerified && (
                        <VerificationBadge 
                          isVerified={provider.isVerified}
                          level={provider.verificationLevel}
                        />
                      )}
                      {provider.isOnline && (
                        <Badge className="bg-green-100 text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          Online
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-3">{provider.specialization}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{provider.rating.toFixed(1)}</span>
                        <span className="text-gray-500">({provider.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{provider.distance} km away</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span>{provider.completedBookings} bookings</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <TrustScoreBadge score={provider.trustScore} />
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {provider.responseTime}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{provider.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{provider.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Languages</p>
                    <p className="font-medium">{provider.languages.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Response Time</p>
                    <p className="font-medium">{provider.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-medium ${isOpenNow() ? 'text-green-600' : 'text-red-600'}`}>
                      {isOpenNow() ? 'Open Now' : 'Closed'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
                <CardDescription>
                  Available services with pricing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {provider.services.map((service) => (
                    <div 
                      key={service.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ₹{service.price}
                        </p>
                        <Button 
                          size="sm" 
                          onClick={() => handleBookService(service)}
                          className="mt-2"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {provider.gallery.slice(0, 6).map((image) => (
                    <div 
                      key={image.id}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setSelectedGalleryImage(image);
                        setShowGallery(true);
                      }}
                    >
                      <img 
                        src={image.url} 
                        alt={image.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {provider.gallery.length > 6 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setShowGallery(true)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    View All Photos ({provider.gallery.length})
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
                <CardDescription>
                  What clients are saying
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(showAllReviews ? provider.reviews : provider.reviews.slice(0, 3)).map((review) => (
                    <div key={review.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <Avatar>
                        <img src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.userName}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{review.serviceName}</span>
                          <span>•</span>
                          <span>{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {provider.reviews.length > 3 && !showAllReviews && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setShowAllReviews(true)}
                  >
                    View All Reviews ({provider.reviews.length})
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Widget */}
            <Card>
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">Next Available</p>
                    <p className="text-lg font-bold text-green-800">{provider.availability.nextSlot}</p>
                    <p className="text-xs text-green-600">{provider.availability.slotsAvailable} slots available</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {provider.pricing.currency}{provider.pricing.min}
                      {provider.pricing.max > provider.pricing.min && ` - ${provider.pricing.currency}${provider.pricing.max}`}
                    </p>
                    <p className="text-sm text-gray-600">Starting price</p>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleBookService()}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>

                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContactProvider('call')}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContactProvider('message')}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContactProvider('email')}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{provider.location}</p>
                    <p className="text-sm text-gray-600">{provider.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="font-medium">{provider.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="font-medium">{provider.email}</p>
                </div>
                {provider.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(provider.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{day}</span>
                      <span className={`text-sm ${hours.isOpen ? 'text-gray-700' : 'text-red-600'}`}>
                        {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {provider.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Info */}
            {provider.businessInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Staff Members</span>
                    <span className="font-medium">{provider.businessInfo.staffCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Established</span>
                    <span className="font-medium">{provider.businessInfo.yearEstablished}</span>
                  </div>
                  {provider.businessInfo.licenseNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">License</span>
                      <span className="font-medium text-xs">{provider.businessInfo.licenseNumber}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <Dialog open={showGallery} onOpenChange={setShowGallery}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gallery</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {provider.gallery.map((image) => (
              <div key={image.id} className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.caption}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderDetails;
