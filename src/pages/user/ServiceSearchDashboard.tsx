import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { VerificationBadge, TrustScoreBadge } from "@/components/ui/verification-badge";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  CreditCard,
  User,
  Building2,
  ChevronRight,
  Heart,
  Phone,
  Calendar,
  Zap,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  Bookmark,
  SlidersHorizontal,
  Map,
  List,
  Grid3X3,
} from "lucide-react";

interface ServiceProvider {
  id: string;
  name: string;
  type: "individual" | "business";
  category: string;
  specialization: string;
  rating: number;
  reviewCount: number;
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
  verificationLevel: "basic" | "verified" | "premium";
  trustScore: number;
  isOnline: boolean;
  profileImage: string;
  services: string[];
  tags: string[];
  responseTime: string;
  completedBookings: number;
  isFavorite: boolean;
  businessInfo?: {
    staffCount: number;
    amenities: string[];
  };
}

const ServiceSearchDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters state
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    distance: 25,
    rating: 0,
    availability: "any",
    providerType: "all",
    verificationLevel: "all",
    amenities: [] as string[],
  });

  const categories = [
    { id: "all", name: "All Categories", icon: "🔍", count: 450 },
    { id: "healthcare", name: "Healthcare & Wellness", icon: "🏥", count: 150 },
    { id: "beauty", name: "Beauty & Personal Care", icon: "💄", count: 89 },
    { id: "legal", name: "Legal & Financial", icon: "⚖️", count: 45 },
    { id: "automotive", name: "Automotive Services", icon: "🚗", count: 67 },
    { id: "education", name: "Education & Coaching", icon: "📚", count: 34 },
    { id: "business", name: "Business & Corporate", icon: "💼", count: 28 },
    { id: "home", name: "Home Services", icon: "🏠", count: 56 },
    { id: "fitness", name: "Fitness & Sports", icon: "💪", count: 42 },
  ];

  const popularSearches = [
    "Hair Salon", "Doctor Consultation", "Car Service", "Legal Advice",
    "Yoga Classes", "Dental Care", "Home Cleaning", "Fitness Trainer"
  ];

  const amenities = [
    "Online Consultation", "Home Service", "24/7 Available", "Emergency Service",
    "Certified Professional", "Insurance Accepted", "Parking Available", "AC Service"
  ];

  // Mock providers data
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockProviders: ServiceProvider[] = Array.from({ length: 24 }, (_, index) => ({
      id: `provider-${index + 1}`,
      name: getProviderName(index),
      type: Math.random() > 0.7 ? "business" : "individual",
      category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
      specialization: getSpecialization(index),
      rating: 4.0 + Math.random() * 1.0,
      reviewCount: Math.floor(Math.random() * 200) + 20,
      location: getLocation(index),
      distance: Math.round((Math.random() * 20 + 1) * 10) / 10,
      pricing: {
        min: Math.floor(Math.random() * 1000) + 200,
        max: Math.floor(Math.random() * 3000) + 1000,
        currency: "₹",
      },
      availability: {
        nextSlot: getNextSlot(),
        slotsAvailable: Math.floor(Math.random() * 8) + 1,
      },
      isVerified: Math.random() > 0.3,
      verificationLevel: Math.random() > 0.7 ? "premium" : Math.random() > 0.4 ? "verified" : "basic",
      trustScore: Math.round((7 + Math.random() * 3) * 10) / 10,
      isOnline: Math.random() > 0.2,
      profileImage: `https://api.dicebear.com/7.x/personas/svg?seed=${index}`,
      services: getServices(index),
      tags: getTags(index),
      responseTime: getResponseTime(),
      completedBookings: Math.floor(Math.random() * 500) + 50,
      isFavorite: Math.random() > 0.8,
      businessInfo: Math.random() > 0.7 ? {
        staffCount: Math.floor(Math.random() * 10) + 3,
        amenities: amenities.slice(0, Math.floor(Math.random() * 4) + 2),
      } : undefined,
    }));

    setProviders(mockProviders);
    setFilteredProviders(mockProviders);
    setIsLoading(false);
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...providers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase())) ||
        provider.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(provider => provider.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(provider => 
      provider.pricing.min >= filters.priceRange[0] && 
      provider.pricing.max <= filters.priceRange[1]
    );

    // Distance filter
    filtered = filtered.filter(provider => provider.distance <= filters.distance);

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(provider => provider.rating >= filters.rating);
    }

    // Provider type filter
    if (filters.providerType !== "all") {
      filtered = filtered.filter(provider => provider.type === filters.providerType);
    }

    // Verification level filter
    if (filters.verificationLevel !== "all") {
      filtered = filtered.filter(provider => 
        provider.isVerified && provider.verificationLevel === filters.verificationLevel
      );
    }

    // Availability filter
    if (filters.availability === "today") {
      filtered = filtered.filter(provider => provider.availability.nextSlot.includes("Today"));
    } else if (filters.availability === "this_week") {
      filtered = filtered.filter(provider => 
        provider.availability.nextSlot.includes("Today") || 
        provider.availability.nextSlot.includes("Tomorrow")
      );
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(provider => 
        provider.businessInfo?.amenities.some(amenity => 
          filters.amenities.includes(amenity)
        ) || provider.tags.some(tag => filters.amenities.includes(tag))
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
      case "price_low":
        filtered.sort((a, b) => a.pricing.min - b.pricing.min);
        break;
      case "price_high":
        filtered.sort((a, b) => b.pricing.min - a.pricing.min);
        break;
      case "availability":
        filtered.sort((a, b) => {
          const aToday = a.availability.nextSlot.includes("Today");
          const bToday = b.availability.nextSlot.includes("Today");
          return bToday ? (aToday ? 0 : 1) : aToday ? -1 : 0;
        });
        break;
      case "trust_score":
        filtered.sort((a, b) => b.trustScore - a.trustScore);
        break;
      default:
        // Relevance - prioritize verified, high ratings, nearby
        filtered.sort((a, b) => {
          const aScore = (a.isVerified ? 10 : 0) + a.rating + (10 - a.distance) + a.trustScore;
          const bScore = (b.isVerified ? 10 : 0) + b.rating + (10 - b.distance) + b.trustScore;
          return bScore - aScore;
        });
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
    if (provider.type === "business") {
      navigate(`/business-booking/${provider.id}`, { state: { provider } });
    } else {
      navigate(`/booking/${provider.id}`, { state: { provider } });
    }
  };

  const toggleFavorite = (providerId: string) => {
    setProviders(prev => 
      prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, isFavorite: !provider.isFavorite }
          : provider
      )
    );
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      distance: 25,
      rating: 0,
      availability: "any",
      providerType: "all",
      verificationLevel: "all",
      amenities: [],
    });
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("relevance");
  };

  // Helper functions
  const getProviderName = (index: number) => {
    const names = [
      "Dr. Sarah Johnson", "Maya Hair Salon", "Legal Associates", "AutoCare Plus",
      "Fitness First", "Beauty Bliss", "Tech Solutions", "Home Helpers",
      "Dental Care Center", "Yoga Studio", "Car Service Pro", "Education Hub"
    ];
    return names[index % names.length];
  };

  const getSpecialization = (index: number) => {
    const specs = [
      "General Medicine", "Hair Styling", "Legal Consultation", "Car Servicing",
      "Personal Training", "Facial Treatment", "IT Support", "House Cleaning",
      "Dental Care", "Yoga Instruction", "Auto Repair", "Tutoring"
    ];
    return specs[index % specs.length];
  };

  const getLocation = (index: number) => {
    const locations = [
      "Andheri West", "Bandra East", "Powai", "Lower Parel",
      "Whitefield", "Koramangala", "Indiranagar", "MG Road"
    ];
    return locations[index % locations.length];
  };

  const getNextSlot = () => {
    const slots = [
      "Today 2:30 PM", "Today 4:00 PM", "Tomorrow 10:00 AM",
      "Tomorrow 2:00 PM", "Day after 11:30 AM"
    ];
    return slots[Math.floor(Math.random() * slots.length)];
  };

  const getServices = (index: number) => {
    const allServices = [
      ["Consultation", "Check-up", "Treatment"],
      ["Haircut", "Styling", "Coloring"],
      ["Legal Advice", "Documentation", "Court Representation"],
      ["Oil Change", "Brake Service", "AC Repair"]
    ];
    return allServices[index % allServices.length];
  };

  const getTags = (index: number) => {
    const allTags = [
      ["Experienced", "Insurance Accepted"],
      ["Certified", "Latest Trends"],
      ["Court Experienced", "Quick Response"],
      ["Genuine Parts", "Warranty"]
    ];
    return allTags[index % allTags.length];
  };

  const getResponseTime = () => {
    const times = ["Within 5 mins", "Within 15 mins", "Within 30 mins", "Within 1 hour"];
    return times[Math.floor(Math.random() * times.length)];
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Search</h1>
          <p className="text-gray-600 mt-2">
            Find and book services across all categories
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search for services, providers, or specializations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="h-12"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="distance">Nearest</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="availability">Available Today</SelectItem>
                  <SelectItem value="trust_score">Trust Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Popular Searches */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(search)}
                    className="text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Browse Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    selectedCategory === category.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">{category.icon}</span>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.count} providers</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle>Advanced Filters</CardTitle>
              <CardDescription>Refine your search results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                  </label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                    max={5000}
                    min={0}
                    step={100}
                    className="mt-2"
                  />
                </div>

                {/* Distance */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Distance: Within {filters.distance} km
                  </label>
                  <Slider
                    value={[filters.distance]}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value[0] }))}
                    max={50}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
                  <Select 
                    value={filters.rating.toString()} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, rating: parseFloat(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Provider Type */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Provider Type</label>
                  <Select 
                    value={filters.providerType} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, providerType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Availability</label>
                  <Select 
                    value={filters.availability} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="today">Available Today</SelectItem>
                      <SelectItem value="this_week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Verification Level */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Verification</label>
                  <Select 
                    value={filters.verificationLevel} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, verificationLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      <SelectItem value="basic">Basic Verified</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="premium">Premium Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <label className="text-sm font-medium mb-3 block">Amenities & Features</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={filters.amenities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters(prev => ({ 
                              ...prev, 
                              amenities: [...prev.amenities, amenity] 
                            }));
                          } else {
                            setFilters(prev => ({ 
                              ...prev, 
                              amenities: prev.amenities.filter(a => a !== amenity) 
                            }));
                          }
                        }}
                      />
                      <label 
                        htmlFor={amenity} 
                        className="text-sm cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {filteredProviders.length} providers found
            </h2>
            {searchQuery && (
              <p className="text-gray-600">for "{searchQuery}"</p>
            )}
          </div>
          <div className="flex gap-2">
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

        {/* Providers Grid/List */}
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
        }>
          {filteredProviders.map((provider) => (
            <Card 
              key={provider.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              onClick={() => handleProviderClick(provider)}
            >
              <CardContent className={`p-6 ${viewMode === "list" ? "flex items-center space-x-6" : ""}`}>
                {/* Provider Image/Icon */}
                <div className={`${viewMode === "list" ? "flex-shrink-0" : "text-center mb-4"}`}>
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
                      <Badge className={`text-xs px-1 py-0.5 ${
                        provider.type === "business" 
                          ? "bg-blue-600 text-white" 
                          : "bg-green-600 text-white"
                      }`}>
                        {provider.type === "business" ? (
                          <Building2 className="h-3 w-3 mr-1" />
                        ) : (
                          <User className="h-3 w-3 mr-1" />
                        )}
                        {provider.type}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Provider Info */}
                <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className={`${viewMode === "list" ? "flex justify-between items-start" : ""}`}>
                    <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                      {/* Name and Verification */}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(provider.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Heart className={`h-4 w-4 ${
                            provider.isFavorite 
                              ? "text-red-500 fill-current" 
                              : "text-gray-400"
                          }`} />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mb-2 text-center">
                        {provider.specialization}
                      </p>

                      {/* Rating and Location */}
                      <div className="flex items-center justify-center space-x-4 mb-3 text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{provider.rating.toFixed(1)}</span>
                          <span className="text-gray-500 ml-1">({provider.reviewCount})</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{provider.distance} km</span>
                        </div>
                      </div>

                      {/* Trust Score and Verification */}
                      {(provider.trustScore || provider.isVerified) && (
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <TrustScoreBadge score={provider.trustScore} size="sm" />
                          <VerificationBadge 
                            isVerified={provider.isVerified}
                            level={provider.verificationLevel}
                            size="sm"
                          />
                        </div>
                      )}

                      {/* Availability */}
                      <div className="mb-3">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-1">
                          <Clock className="h-4 w-4" />
                          <span>{provider.availability.nextSlot}</span>
                        </div>
                        <div className="text-xs text-green-600 text-center">
                          {provider.availability.slotsAvailable} slots available
                        </div>
                      </div>

                      {/* Pricing */}
                      {provider.pricing.min > 0 && (
                        <div className="text-center mb-3">
                          <span className="text-lg font-bold text-green-600">
                            {provider.pricing.currency}{provider.pricing.min}
                            {provider.pricing.max > provider.pricing.min &&
                              ` - ${provider.pricing.currency}${provider.pricing.max}`}
                          </span>
                        </div>
                      )}

                      {/* Business Info */}
                      {provider.businessInfo && (
                        <div className="text-center mb-3">
                          <Badge variant="outline" className="text-xs">
                            {provider.businessInfo.staffCount} staff members
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - List View */}
                    {viewMode === "list" && (
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleProviderClick(provider);
                        }}>
                          Book Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3 justify-center">
                    {provider.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons - Grid View */}
                  {viewMode === "grid" && (
                    <div className="flex space-x-2">
                      <Button
                        className="flex-1"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProviderClick(provider);
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No providers found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={resetFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ServiceSearchDashboard;
