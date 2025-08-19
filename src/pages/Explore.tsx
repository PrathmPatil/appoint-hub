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
} from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";

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
  isOnline: boolean;
  profileImage: string;
  services: string[];
  responseTime: string;
  completedBookings: number;
  tags: string[];
  workingHours: string;
}

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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

  // Mock API function - in real app, this would be actual API calls
  const fetchProviders = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      setLoading(true);

      // Simulate API delay
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

          return {
            id: `provider-${globalIndex}`,
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
            isOnline: Math.random() > 0.3,
            profileImage: `https://api.dicebear.com/7.x/personas/svg?seed=${globalIndex}`,
            services: getServices(category),
            responseTime: getResponseTime(),
            completedBookings: Math.floor(Math.random() * 500) + 100,
            tags: getTags(category),
            workingHours: getWorkingHours(),
          };
        },
      );

      setProviders((prev) =>
        reset ? mockProviders : [...prev, ...mockProviders],
      );
      setHasMore(pageNum < 5); // Simulate finite data
      setLoading(false);
    },
    [],
  );

  // Helper functions for mock data
  const getProviderName = (category: string, index: number) => {
    const names = {
      healthcare: [
        "Dr. Rajesh Kumar",
        "Dr. Priya Sharma",
        "Dr. Amit Patel",
        "Dr. Sunita Singh",
      ],
      beauty: [
        "Glamour Salon",
        "Beauty Bliss Spa",
        "Style Studio",
        "Glow Beauty Center",
      ],
      legal: [
        "Advocate Ramesh",
        "Legal Associates",
        "Law Chambers",
        "Justice Legal",
      ],
      property: [
        "Prime Real Estate",
        "Property Plus",
        "Home Finder",
        "Estate Expert",
      ],
      education: ["Tutor Pro", "Learn Smart", "Skill Builder", "Knowledge Hub"],
      automotive: [
        "Auto Care Center",
        "Car Service Pro",
        "Vehicle Expert",
        "Motor Clinic",
      ],
      business: [
        "Business Consult",
        "Corporate Solutions",
        "Strategy Partners",
        "Growth Advisory",
      ],
      travel: [
        "Travel Desk",
        "Visa Services",
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

  // Initial load and real-time subscriptions
  useEffect(() => {
    fetchProviders(1, true);

    // Subscribe to real-time provider updates
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
  }, [fetchProviders, subscribe]);

  // Infinite scroll observer
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
      fetchProviders(page);
    }
  }, [page, fetchProviders]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...providers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.specialization
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          provider.services.some((service) =>
            service.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
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
      filtered = filtered.filter((provider) =>
        provider.availability.nextSlot.includes("Today"),
      );
    }

    if (filters.pricing) {
      const maxPrice = parseFloat(filters.pricing);
      filtered = filtered.filter(
        (provider) => provider.pricing.min <= maxPrice,
      );
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
        filtered.sort((a, b) => a.pricing.min - b.pricing.min);
        break;
      case "availability":
        filtered.sort((a, b) => {
          const aToday = a.availability.nextSlot.includes("Today");
          const bToday = b.availability.nextSlot.includes("Today");
          return bToday ? (aToday ? 0 : 1) : aToday ? -1 : 0;
        });
        break;
      default:
        // Relevance - keep original order
        break;
    }

    setFilteredProviders(filtered);
  }, [providers, searchQuery, selectedCategory, filters, sortBy]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const handleProviderClick = (provider: ServiceProvider) => {
    navigate(`/provider/${provider.id}`, { state: { provider } });
  };

  const handleBookNow = (e: React.MouseEvent, provider: ServiceProvider) => {
    e.stopPropagation();
    navigate(`/booking/${provider.id}`, { state: { provider } });
  };

  const ProviderCard = ({ provider }: { provider: ServiceProvider }) => (
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
                  <Verified className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">
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

          <div className="flex flex-wrap gap-1 mb-3">
            {provider.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {viewMode === "grid" && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search for professionals, services, or specializations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 h-fit sticky top-24">
            <Card className="max-h-[calc(100vh-120px)] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
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
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 overflow-y-auto flex-1">
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
                      <SelectItem value="tomorrow">
                        Available Tomorrow
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
              </CardContent>
            </Card>

            {/* Connection Status */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-sm">
                    {isConnected ? "Live Updates Active" : "Connecting..."}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {selectedCategory === "all"
                  ? "All Service Providers"
                  : categories.find((c) => c.id === selectedCategory)?.name ||
                    "Service Providers"}
              </h1>
              <p className="text-gray-600">
                {filteredProviders.length} professionals found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
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
      </div>
    </div>
  );
};

export default Explore;
