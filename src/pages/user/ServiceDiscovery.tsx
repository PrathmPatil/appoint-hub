import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  ArrowLeft,
  Filter,
  MapPin,
  Star,
  Clock,
  Phone,
  Calendar,
  ChevronDown,
  Grid3X3,
  List,
  Verified,
  Award,
  Users,
  Heart,
  Share2,
  Building2,
  User,
  CheckCircle,
  X,
  Shield,
  Award,
  TrendingUp,
} from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBusinesses, fetchStaff } from "@/store/slices/businessSlice";
import { VerificationBadge, TrustScoreBadge } from "@/components/ui/verification-badge";
import { calculateMockTrustScore } from "@/lib/trustScore";

interface ServiceProvider {
  id: string;
  name: string;
  specialization: string;
  category: string;
  rating: number;
  reviewCount: number;
  experience: string;
  location: string;
  distance: number;
  pricing: {
    min: number;
    max: number;
    currency: string;
  };
  availability: {
    nextSlot: string;
    slotsAvailable: number;
  };
  isVerified: boolean;
  verificationLevel?: "basic" | "verified" | "premium";
  trustScore?: number;
  isOnline: boolean;
  profileImage: string;
  services: string[];
  responseTime: string;
  completedBookings: number;
  tags: string[];
  workingHours: string;
  type: "individual";
}

interface BusinessProvider {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  address: string;
  distance: number;
  staffCount: number;
  availability: number; // percentage busy
  isVerified: boolean;
  services: string[];
  tags: string[];
  amenities: string[];
  workingHours: string;
  type: "business";
  staff: Array<{
    id: string;
    name: string;
    specialization: string;
    rating: number;
    availability: number;
  }>;
}

type Provider = ServiceProvider | BusinessProvider;

const ServiceDiscovery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    businesses,
    staff,
    isLoading: businessLoading,
  } = useAppSelector((state) => state.business);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [providerType, setProviderType] = useState<
    "all" | "individual" | "business"
  >((searchParams.get("type") as "all" | "individual" | "business") || "all");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    rating: "",
    distance: "",
    availability: "",
    pricing: "",
  });

  const observerTarget = useRef<HTMLDivElement>(null);
  const { subscribe, isConnected } = useRealTimeData();

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "healthcare", name: "Healthcare & Wellness" },
    { id: "beauty", name: "Beauty & Personal Care" },
    { id: "legal", name: "Legal & Financial" },
    { id: "property", name: "Real Estate & Property" },
    { id: "education", name: "Education & Coaching" },
    { id: "automotive", name: "Automotive Services" },
    { id: "business", name: "Business & Corporate" },
    { id: "travel", name: "Travel & Documentation" },
  ];

  // Load businesses and staff from Redux store
  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchStaff());
  }, [dispatch]);

  // Mock API function for individual providers
  const fetchIndividualProviders = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockProviders: ServiceProvider[] = Array.from(
        { length: 10 },
        (_, index) => {
          const globalIndex = (pageNum - 1) * 10 + index;
          const categories = [
            "healthcare",
            "beauty",
            "legal",
            "property",
            "education",
            "automotive",
            "business",
            "travel",
          ];
          const category = categories[globalIndex % categories.length];
          const providerId = `individual-${pageNum}-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const trustScoreData = calculateMockTrustScore(providerId);

          return {
            id: providerId,
            name: getProviderName(category, globalIndex),
            specialization: getSpecialization(category),
            category,
            rating: 4.2 + Math.random() * 0.8,
            reviewCount: Math.floor(Math.random() * 200) + 50,
            experience: `${Math.floor(Math.random() * 15) + 2} years`,
            location: getLocation(),
            distance: Math.round((Math.random() * 10 + 0.5) * 10) / 10,
            pricing: {
              min: getPricing(category).min,
              max: getPricing(category).max,
              currency: "₹",
            },
            availability: {
              nextSlot: getNextSlot(),
              slotsAvailable: Math.floor(Math.random() * 8) + 1,
            },
            isVerified: Math.random() > 0.2,
            verificationLevel: Math.random() > 0.7 ? "premium" : Math.random() > 0.4 ? "verified" : "basic",
            trustScore: Math.round(trustScoreData.overall * 10) / 10,
            isOnline: Math.random() > 0.3,
            profileImage: `https://api.dicebear.com/7.x/personas/svg?seed=${globalIndex}`,
            services: getServices(category),
            responseTime: getResponseTime(),
            completedBookings: Math.floor(Math.random() * 500) + 100,
            tags: getTags(category),
            workingHours: getWorkingHours(),
            type: "individual",
          };
        },
      );

      return mockProviders;
    },
    [],
  );

  // Transform businesses from Redux store to BusinessProvider format
  const transformBusinesses = useCallback((): BusinessProvider[] => {
    return businesses.map((business) => {
      const businessStaff = staff.filter(
        (s) => s.businessId === business.id && s.isActive,
      );
      const avgRating =
        businessStaff.reduce((sum, s) => sum + (s.rating || 4.5), 0) /
        Math.max(businessStaff.length, 1);

      return {
        id: business.id,
        name: business.name,
        description: business.description,
        category:
          business.type === "spa"
            ? "beauty"
            : business.type === "clinic"
              ? "healthcare"
              : business.type,
        rating: business.rating || avgRating,
        reviewCount: Math.floor(Math.random() * 300) + 100,
        location: business.location || "Business District",
        address: business.address,
        distance: Math.round((Math.random() * 15 + 0.5) * 10) / 10,
        staffCount: businessStaff.length,
        availability: Math.floor(Math.random() * 80) + 20, // 20-100% busy
        isVerified: business.verified,
        services: business.services || getServices(business.type),
        tags: getTags(business.type),
        amenities: business.amenities,
        workingHours: getWorkingHours(),
        type: "business",
        staff: businessStaff.map((s) => ({
          id: s.id,
          name: s.name,
          specialization: s.specializations?.[0] || s.position,
          rating: s.rating || 4.5,
          availability: Math.floor(Math.random() * 80) + 20,
        })),
      };
    });
  }, [businesses, staff]);

  // Load all providers
  const loadProviders = useCallback(async () => {
    setLoading(true);

    try {
      const individualProviders = await fetchIndividualProviders(
        page,
        page === 1,
      );
      const businessProviders = page === 1 ? transformBusinesses() : [];

      const allProviders = [...businessProviders, ...individualProviders];

      setProviders((prev) =>
        page === 1 ? allProviders : [...prev, ...allProviders],
      );
      setHasMore(page < 3); // Limit for demo
    } catch (error) {
      console.error("Error loading providers:", error);
    } finally {
      setLoading(false);
    }
  }, [page, fetchIndividualProviders, transformBusinesses]);

  // Initial load
  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  // Real-time subscriptions
  useEffect(() => {
    subscribe("provider_update", (data) => {
      setProviders((prev) =>
        prev.map((provider) =>
          provider.id === data.providerId
            ? { ...provider, ...data.updates }
            : provider,
        ),
      );
    });

    subscribe("availability_change", (data) => {
      setProviders((prev) =>
        prev.map((provider) =>
          provider.id === data.providerId
            ? { ...provider, availability: data.availability }
            : provider,
        ),
      );
    });
  }, [subscribe]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  // Load more data when page changes
  useEffect(() => {
    if (page > 1) {
      loadProviders();
    }
  }, [page, loadProviders]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...providers];

    // Provider type filter
    if (providerType !== "all") {
      filtered = filtered.filter((provider) => provider.type === providerType);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((provider) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          provider.name.toLowerCase().includes(searchLower) ||
          (provider.type === "individual" &&
            (provider as ServiceProvider).specialization
              .toLowerCase()
              .includes(searchLower)) ||
          (provider.type === "business" &&
            (provider as BusinessProvider).description
              .toLowerCase()
              .includes(searchLower)) ||
          provider.services.some((service) =>
            service.toLowerCase().includes(searchLower),
          )
        );
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (provider) => provider.category === selectedCategory,
      );
    }

    // Additional filters
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter((provider) => provider.rating >= minRating);
    }

    if (filters.distance) {
      const maxDistance = parseFloat(filters.distance);
      filtered = filtered.filter(
        (provider) => provider.distance <= maxDistance,
      );
    }

    if (filters.availability === "today") {
      filtered = filtered.filter((provider) => {
        if (provider.type === "individual") {
          return (provider as ServiceProvider).availability.nextSlot.includes(
            "Today",
          );
        } else {
          return (provider as BusinessProvider).availability <= 70; // Less than 70% busy
        }
      });
    }

    if (filters.pricing) {
      const maxPrice = parseFloat(filters.pricing);
      filtered = filtered.filter((provider) => {
        if (provider.type === "individual") {
          return (provider as ServiceProvider).pricing.min <= maxPrice;
        }
        return true; // Businesses might have varying pricing
      });
    }

    // Sorting
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "distance":
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case "price":
        filtered.sort((a, b) => {
          const aPrice =
            a.type === "individual" ? (a as ServiceProvider).pricing.min : 0;
          const bPrice =
            b.type === "individual" ? (b as ServiceProvider).pricing.min : 0;
          return aPrice - bPrice;
        });
        break;
      case "availability":
        filtered.sort((a, b) => {
          if (a.type === "individual" && b.type === "individual") {
            const aToday = (
              a as ServiceProvider
            ).availability.nextSlot.includes("Today");
            const bToday = (
              b as ServiceProvider
            ).availability.nextSlot.includes("Today");
            return bToday ? (aToday ? 0 : 1) : aToday ? -1 : 0;
          } else if (a.type === "business" && b.type === "business") {
            return (
              (a as BusinessProvider).availability -
              (b as BusinessProvider).availability
            );
          }
          return 0;
        });
        break;
      default:
        // Relevance - prioritize businesses, then individuals
        filtered.sort((a, b) => {
          if (a.type === "business" && b.type === "individual") return -1;
          if (a.type === "individual" && b.type === "business") return 1;
          return 0;
        });
        break;
    }

    setFilteredProviders(filtered);
  }, [providers, searchQuery, selectedCategory, providerType, filters, sortBy]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (providerType !== "all") params.set("type", providerType);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, providerType, setSearchParams]);

  const handleProviderClick = (provider: Provider) => {
    navigate(`/provider/${provider.id}`, { state: { provider } });
  };

  const handleBookNow = (e: React.MouseEvent, provider: Provider) => {
    e.stopPropagation();
    if (provider.type === "business") {
      navigate(`/business-booking/${provider.id}`, { state: { provider } });
    } else {
      navigate(`/booking/${provider.id}`, { state: { provider } });
    }
  };

  const handleViewDetails = (e: React.MouseEvent, provider: Provider) => {
    e.stopPropagation();
    navigate(`/provider/${provider.id}`, { state: { provider } });
  };

  // Helper functions (same as before)
  const getProviderName = (category: string, index: number) => {
    const names = {
      healthcare: [
        "Dr. Rajesh Kumar",
        "Dr. Priya Sharma",
        "Dr. Amit Patel",
        "Dr. Sunita Singh",
      ],
      beauty: ["Sarah Johnson", "Maya Patel", "Lisa Chen", "Anita Sharma"],
      legal: [
        "Advocate Ramesh",
        "Sarah Legal",
        "John Chambers",
        "Priya Justice",
      ],
      property: ["Raj Estate", "Property Plus", "Home Finder", "Estate Expert"],
      education: [
        "Prof. Kumar",
        "Teacher Smart",
        "Skill Builder",
        "Knowledge Hub",
      ],
      automotive: [
        "Mechanic Pro",
        "Car Expert",
        "Vehicle Master",
        "Motor Clinic",
      ],
      business: [
        "Business Guru",
        "Corporate Solutions",
        "Strategy Partners",
        "Growth Advisory",
      ],
      travel: [
        "Travel Expert",
        "Visa Pro",
        "Journey Partners",
        "Global Travel",
      ],
    };

    const categoryNames =
      names[category as keyof typeof names] || names.healthcare;
    return categoryNames[index % categoryNames.length];
  };

  const getSpecialization = (category: string) => {
    const specs = {
      healthcare: [
        "General Physician",
        "Cardiologist",
        "Dermatologist",
        "Pediatrician",
      ],
      beauty: ["Hair Styling", "Skin Care", "Nail Art", "Makeup Artist"],
      legal: ["Civil Law", "Criminal Law", "Corporate Law", "Family Law"],
      property: [
        "Residential Sales",
        "Commercial Leasing",
        "Investment Advisory",
        "Property Management",
      ],
      education: ["Mathematics", "English", "Science", "Computer Programming"],
      automotive: [
        "Car Servicing",
        "Bike Repair",
        "Auto Detailing",
        "Tyre Services",
      ],
      business: [
        "Strategy Consulting",
        "Digital Marketing",
        "Financial Planning",
        "HR Services",
      ],
      travel: [
        "Visa Processing",
        "Travel Planning",
        "Documentation",
        "Immigration Services",
      ],
    };

    const categorySpecs =
      specs[category as keyof typeof specs] || specs.healthcare;
    return categorySpecs[Math.floor(Math.random() * categorySpecs.length)];
  };

  const getLocation = () => {
    const locations = [
      "Andheri West",
      "Bandra East",
      "Powai",
      "Lower Parel",
      "Whitefield",
      "Koramangala",
      "Indiranagar",
      "MG Road",
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getPricing = (category: string) => {
    const pricing = {
      healthcare: { min: 500, max: 2000 },
      beauty: { min: 300, max: 1500 },
      legal: { min: 1000, max: 5000 },
      property: { min: 0, max: 0 },
      education: { min: 400, max: 1200 },
      automotive: { min: 800, max: 3000 },
      business: { min: 2000, max: 10000 },
      travel: { min: 500, max: 2500 },
    };

    return pricing[category as keyof typeof pricing] || pricing.healthcare;
  };

  const getNextSlot = () => {
    const slots = [
      "Today 2:30 PM",
      "Today 4:00 PM",
      "Tomorrow 10:00 AM",
      "Tomorrow 2:00 PM",
      "Day after 11:30 AM",
    ];
    return slots[Math.floor(Math.random() * slots.length)];
  };

  const getServices = (category: string) => {
    const services = {
      healthcare: ["Consultation", "Check-up", "Diagnosis", "Treatment"],
      beauty: ["Haircut", "Facial", "Manicure", "Massage"],
      legal: [
        "Legal Advice",
        "Documentation",
        "Court Representation",
        "Contract Review",
      ],
      property: [
        "Property Viewing",
        "Valuation",
        "Legal Check",
        "Documentation",
      ],
      education: [
        "1-on-1 Tutoring",
        "Group Classes",
        "Test Prep",
        "Assignment Help",
      ],
      automotive: [
        "Oil Change",
        "Brake Service",
        "AC Repair",
        "General Checkup",
      ],
      business: [
        "Strategy Session",
        "Market Research",
        "Business Plan",
        "Financial Analysis",
      ],
      travel: [
        "Visa Application",
        "Document Verification",
        "Travel Insurance",
        "Booking Assistance",
      ],
    };

    const categoryServices =
      services[category as keyof typeof services] || services.healthcare;
    return categoryServices.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const getResponseTime = () => {
    const times = [
      "Within 5 mins",
      "Within 15 mins",
      "Within 30 mins",
      "Within 1 hour",
    ];
    return times[Math.floor(Math.random() * times.length)];
  };

  const getTags = (category: string) => {
    const tags = {
      healthcare: [
        "Experienced",
        "Insurance Accepted",
        "Emergency Available",
        "Online Consultation",
      ],
      beauty: [
        "Certified",
        "Organic Products",
        "Home Service",
        "Latest Trends",
      ],
      legal: [
        "Court Experienced",
        "Quick Response",
        "Affordable",
        "Specialized",
      ],
      property: [
        "Trusted",
        "No Brokerage",
        "Quick Service",
        "Verified Properties",
      ],
      education: [
        "Result Oriented",
        "Flexible Timing",
        "Personalized",
        "Exam Focused",
      ],
      automotive: [
        "Genuine Parts",
        "Warranty",
        "Pickup/Drop",
        "Expert Technicians",
      ],
      business: [
        "Industry Expert",
        "Proven Results",
        "Strategic",
        "Cost Effective",
      ],
      travel: [
        "Fast Processing",
        "Document Support",
        "24/7 Help",
        "Govt Approved",
      ],
    };

    const categoryTags = tags[category as keyof typeof tags] || tags.healthcare;
    return categoryTags.slice(0, Math.floor(Math.random() * 2) + 1);
  };

  const getWorkingHours = () => {
    const hours = [
      "9 AM - 6 PM",
      "10 AM - 8 PM",
      "11 AM - 7 PM",
      "9 AM - 9 PM",
      "24/7 Available",
    ];
    return hours[Math.floor(Math.random() * hours.length)];
  };

  const getAvailabilityColor = (percentage: number) => {
    if (percentage <= 30) return "text-green-600 bg-green-100";
    if (percentage <= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getAvailabilityLabel = (percentage: number) => {
    if (percentage <= 30) return "Mostly Available";
    if (percentage <= 70) return "Moderately Busy";
    return "Very Busy";
  };

  // Individual Provider Card
  const IndividualProviderCard = ({
    provider,
  }: {
    provider: ServiceProvider;
  }) => (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        viewMode === "list" ? "mb-4" : ""
      }`}
      onClick={() => handleProviderClick(provider)}
    >
      <CardContent
        className={`p-6 ${viewMode === "list" ? "flex items-center space-x-6" : ""}`}
      >
        <div
          className={`${viewMode === "list" ? "flex-shrink-0" : "text-center mb-4"}`}
        >
          <div className="relative">
            <img
              src={provider.profileImage}
              alt={provider.name}
              className={`${viewMode === "list" ? "w-20 h-20" : "w-24 h-24 mx-auto"} rounded-full object-cover`}
            />
            {provider.isOnline && (
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
            <div className="absolute -top-1 -left-1">
              <Badge className="bg-blue-600 text-white text-xs px-1 py-0.5">
                <User className="h-3 w-3 mr-1" />
                Individual
              </Badge>
            </div>
          </div>
        </div>

        <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
          <div
            className={`${viewMode === "list" ? "flex justify-between items-start" : ""}`}
          >
            <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{provider.name}</h3>
                {provider.isVerified && (
                  <VerificationBadge
                    isVerified={provider.isVerified}
                    level={provider.verificationLevel}
                    size="sm"
                    showText={false}
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2 text-center">
                {provider.specialization}
              </p>

              <div className="flex items-center justify-center space-x-4 mb-3 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">
                    {provider.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 ml-1">
                    ({provider.reviewCount})
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{provider.distance} km</span>
                </div>
              </div>

              {/* Trust Score and Verification Badges */}
              {(provider.trustScore || provider.isVerified) && (
                <div className="flex items-center justify-center gap-2 mb-3">
                  {provider.trustScore && (
                    <TrustScoreBadge
                      score={provider.trustScore}
                      size="sm"
                    />
                  )}
                  {provider.isVerified && (
                    <VerificationBadge
                      isVerified={provider.isVerified}
                      level={provider.verificationLevel}
                      size="sm"
                    />
                  )}
                </div>
              )}

              <div className="mb-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span>{provider.availability.nextSlot}</span>
                </div>
                <div className="text-xs text-green-600 text-center">
                  {provider.availability.slotsAvailable} slots available
                </div>
              </div>

              {provider.pricing.min > 0 && (
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-green-600">
                    {provider.pricing.currency}
                    {provider.pricing.min}
                    {provider.pricing.max > provider.pricing.min &&
                      ` - ${provider.pricing.currency}${provider.pricing.max}`}
                  </span>
                </div>
              )}
            </div>

            {viewMode === "list" && (
              <div className="flex flex-col space-y-2 ml-4">
                <Button size="sm" onClick={(e) => handleBookNow(e, provider)}>
                  Book Now
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-3 justify-center">
            {provider.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {viewMode === "grid" && (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Button
                  className="flex-1"
                  size="sm"
                  onClick={(e) => handleBookNow(e, provider)}
                >
                  Book Now
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => handleViewDetails(e, provider)}
              >
                View Details
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Business Provider Card
  const BusinessProviderCard = ({
    provider,
  }: {
    provider: BusinessProvider;
  }) => {
    const availabilityColor = getAvailabilityColor(provider.availability);
    const availabilityLabel = getAvailabilityLabel(provider.availability);

    return (
      <Card
        className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-l-blue-500 ${
          viewMode === "list" ? "mb-4" : ""
        }`}
        onClick={() => handleProviderClick(provider)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Business Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 relative">
              <Building2 className="h-8 w-8 text-white" />
              <div className="absolute -top-1 -right-1">
                <Badge className="bg-blue-600 text-white text-xs px-1 py-0.5">
                  <Building2 className="h-3 w-3 mr-1" />
                  Business
                </Badge>
              </div>
            </div>

            {/* Business Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {provider.name}
                    </h3>
                    {provider.isVerified && (
                      <VerificationBadge
                        isVerified={provider.isVerified}
                        level="verified"
                        size="sm"
                      />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {provider.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{provider.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{provider.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Current Availability
                  </span>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${availabilityColor}`}
                  >
                    {availabilityLabel}
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress value={provider.availability} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{100 - provider.availability}% Available</span>
                    <span>{provider.availability}% Busy</span>
                  </div>
                </div>
              </div>

              {/* Staff Preview */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Service Providers ({provider.staffCount})
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All Staff
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {provider.staff.slice(0, 4).map((staffMember, index) => (
                    <div key={staffMember.id} className="relative group">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {staffMember.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {/* Staff availability indicator */}
                      <div
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          staffMember.availability <= 30
                            ? "bg-green-500"
                            : staffMember.availability <= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></div>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {staffMember.name} - {staffMember.availability}% busy
                      </div>
                    </div>
                  ))}
                  {provider.staff.length > 4 && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        +{provider.staff.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {provider.isVerified && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  {provider.staffCount} Staff
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Open Today
                </Badge>
                {provider.amenities.slice(0, 1).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={(e) => handleBookNow(e, provider)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleViewDetails(e, provider)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProviderCard = ({ provider }: { provider: Provider }) => {
    if (provider.type === "business") {
      return <BusinessProviderCard provider={provider as BusinessProvider} />;
    } else {
      return <IndividualProviderCard provider={provider as ServiceProvider} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AH</span>
                </div>
                <h1 className="text-xl font-bold text-blue-600">AppointHub</h1>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Row */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for professionals, services, or specializations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Collapsible Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            sidebarOpen ? "w-80" : "w-0"
          } overflow-hidden`}
        >
          <div className="h-full bg-white border-r shadow-lg w-80">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters Content */}
            <div className="p-4 space-y-6 overflow-y-auto h-full">
              {/* Clear All */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Filters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setProviderType("all");
                    setFilters({
                      rating: "",
                      distance: "",
                      availability: "",
                      pricing: "",
                    });
                    setSortBy("relevance");
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </Button>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Provider Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Provider Type
                </label>
                <Select
                  value={providerType}
                  onValueChange={(value: "all" | "individual" | "business") =>
                    setProviderType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="individual">Individuals</SelectItem>
                    <SelectItem value="business">Businesses</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="distance">Nearest</SelectItem>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="availability">
                      Available Today
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Minimum Rating
                </label>
                <Select
                  value={filters.rating || "any"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      rating: value === "any" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any rating</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Distance Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Distance
                </label>
                <Select
                  value={filters.distance || "any"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      distance: value === "any" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any distance</SelectItem>
                    <SelectItem value="2">Within 2 km</SelectItem>
                    <SelectItem value="5">Within 5 km</SelectItem>
                    <SelectItem value="10">Within 10 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Availability
                </label>
                <Select
                  value={filters.availability || "any"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      availability: value === "any" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="today">Available Today</SelectItem>
                    <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Price
                </label>
                <Select
                  value={filters.pricing || "any"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      pricing: value === "any" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any price</SelectItem>
                    <SelectItem value="500">Under ₹500</SelectItem>
                    <SelectItem value="1000">Under ₹1,000</SelectItem>
                    <SelectItem value="2000">Under ₹2,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Connection Status */}
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-sm">
                    {isConnected ? "Live Updates Active" : "Connecting..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {selectedCategory === "all"
                ? "All Service Providers"
                : categories.find((c) => c.id === selectedCategory)?.name ||
                  "Service Providers"}
            </h1>
            <p className="text-gray-600">
              {filteredProviders.length} providers found
              {searchQuery && ` for "${searchQuery}"`}
              {providerType !== "all" && ` (${providerType}s only)`}
            </p>
          </div>

          {/* Provider Type Summary */}
          <div className="mb-6 flex gap-4">
            <Card className="flex-1">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    filteredProviders.filter((p) => p.type === "business")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Businesses</div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    filteredProviders.filter((p) => p.type === "individual")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">
                  Individual Providers
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Provider Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
                  : "space-y-4 mt-6"
              }
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-4 w-32 mx-auto mb-2" />
                    <Skeleton className="h-3 w-24 mx-auto mb-4" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          <div ref={observerTarget} className="h-10 mt-6" />

          {/* No Results */}
          {filteredProviders.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium mb-2">No providers found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setProviderType("all");
                  setFilters({
                    rating: "",
                    distance: "",
                    availability: "",
                    pricing: "",
                  });
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* End of Results */}
          {!hasMore && !loading && filteredProviders.length > 0 && (
            <div className="text-center py-6 text-gray-500">
              <p>You've reached the end of the results</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ServiceDiscovery;
