import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Star,
  Shield,
  Clock,
  MapPin,
  CreditCard,
  UserCheck,
  Building,
  BarChart3,
  Search,
  Stethoscope,
  Scissors,
  Scale,
  Home,
  GraduationCap,
  Car,
  Briefcase,
  Plane,
  Heart,
  Landmark,
  Calendar,
  Phone,
  Bell,
} from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const serviceCategories = [
    {
      id: "healthcare",
      title: "Healthcare & Wellness",
      icon: Stethoscope,
      description: "Doctors, Dentists, Therapists, Specialists",
      services: [
        "General Practitioner",
        "Dentist",
        "Physiotherapist",
        "Psychologist",
        "Dermatologist",
        "Veterinary",
      ],
      providers: 1250,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "beauty",
      title: "Beauty & Personal Care",
      icon: Scissors,
      description: "Salons, Spas, Styling, Grooming",
      services: [
        "Hair Salon",
        "Spa Services",
        "Nail Technician",
        "Massage Therapy",
        "Makeup Artist",
        "Barber Shop",
      ],
      providers: 890,
      color: "bg-pink-100 text-pink-600",
    },
    {
      id: "legal",
      title: "Legal & Financial",
      icon: Scale,
      description: "Lawyers, Accountants, Financial Advisors",
      services: [
        "Advocate/Lawyer",
        "Chartered Accountant",
        "Financial Advisor",
        "Insurance Agent",
        "Notary Public",
      ],
      providers: 650,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "property",
      title: "Real Estate & Property",
      icon: Home,
      description: "Agents, Designers, Inspections",
      services: [
        "Real Estate Agent",
        "Interior Designer",
        "Home Inspection",
        "Property Management",
      ],
      providers: 420,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "education",
      title: "Education & Coaching",
      icon: GraduationCap,
      description: "Tutors, Trainers, Life Coaches",
      services: [
        "Private Tutor",
        "Fitness Trainer",
        "Yoga Instructor",
        "Career Counselor",
        "Music Teacher",
      ],
      providers: 780,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "automotive",
      title: "Automotive Services",
      icon: Car,
      description: "Car Service, Wash, Detailing",
      services: [
        "Car Service Center",
        "Car Wash",
        "Vehicle Detailing",
        "Driving Instructor",
      ],
      providers: 340,
      color: "bg-red-100 text-red-600",
    },
    {
      id: "business",
      title: "Business & Corporate",
      icon: Briefcase,
      description: "Consulting, Photography, Events",
      services: [
        "Business Consulting",
        "Photography Studio",
        "Event Planning",
        "Marketing Services",
      ],
      providers: 560,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      id: "travel",
      title: "Travel & Documentation",
      icon: Plane,
      description: "Passport, Visa, Immigration",
      services: [
        "Passport Services",
        "Visa Consultant",
        "Immigration Services",
        "Travel Agency",
      ],
      providers: 280,
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Location-Based Search",
      description:
        "Find verified professionals near your location with smart geo-filtering",
    },
    {
      icon: Calendar,
      title: "Real-Time Booking",
      description:
        "See live availability and book appointments instantly with automatic confirmations",
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description:
        "All service providers are background-checked, verified, and regularly reviewed",
    },
    {
      icon: Star,
      title: "Smart Recommendations",
      description:
        "AI-powered ranking based on ratings, reviews, proximity, and your preferences",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Free SMS and email reminders for both customers and service providers",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description:
        "Multiple payment options with secure processing and transparent pricing",
    },
  ];

  const popularServices = [
    {
      title: "Doctor Consultation",
      category: "Healthcare",
      price: "From ₹500",
      rating: 4.8,
      providers: 250,
      duration: "30 min",
      available: "Today",
    },
    {
      title: "Hair Cut & Styling",
      category: "Beauty",
      price: "From ₹300",
      rating: 4.7,
      providers: 180,
      duration: "45 min",
      available: "Today",
    },
    {
      title: "Legal Consultation",
      category: "Legal",
      price: "From ₹1000",
      rating: 4.9,
      providers: 120,
      duration: "60 min",
      available: "Tomorrow",
    },
    {
      title: "Property Viewing",
      category: "Real Estate",
      price: "From ₹0",
      rating: 4.6,
      providers: 95,
      duration: "90 min",
      available: "Today",
    },
  ];

  const stats = [
    { number: "5,000+", label: "Verified Professionals" },
    { number: "50,000+", label: "Happy Customers" },
    { number: "100+", label: "Service Types" },
    { number: "25+", label: "Cities Covered" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Working Professional",
      rating: 5,
      comment:
        "Found an excellent physiotherapist within minutes. The booking process was seamless and the reminder notifications were very helpful.",
      service: "Healthcare",
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      rating: 5,
      comment:
        "Booked a CA for tax consultation. The platform made it so easy to compare professionals and book at my convenience.",
      service: "Financial",
    },
    {
      name: "Anjali Patel",
      role: "Homeowner",
      comment:
        "The interior designer I found through this platform transformed my home. Great quality service and transparent pricing.",
      rating: 5,
      service: "Property",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">AH</span>
              </div>
              <h1 className="text-2xl font-bold text-blue-600">AppointHub</h1>
              <Badge className="ml-2 bg-green-100 text-green-600">Live</Badge>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/services"
                className="text-gray-600 hover:text-gray-900"
              >
                Services
              </Link>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900"
              >
                How it Works
              </a>
              <a
                href="#professionals"
                className="text-gray-600 hover:text-gray-900"
              >
                For Professionals
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Book Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Book Appointments with
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                Verified Professionals
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              From healthcare to beauty, legal to automotive - find and book
              appointments with trusted professionals across 100+ service
              categories. Real-time availability, instant booking, smart
              reminders.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search for doctors, lawyers, salons, or any service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      navigate(
                        `/services?search=${encodeURIComponent(searchQuery)}`,
                      );
                    }
                  }}
                  className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Button
                  className="absolute right-2 top-2 h-10 bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() =>
                    navigate(
                      `/services?search=${encodeURIComponent(searchQuery)}`,
                    )
                  }
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Book Your First Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Join as Professional
              </Button>
            </div>

            <div className="text-center mt-8">
              <Link to="/services">
                <Button size="lg" variant="outline" className="px-8">
                  View All Services & Providers
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">
              Complete Service Categories
            </h3>
            <p className="text-gray-600 mt-4">
              Professional appointments across all industries and
              specializations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link
                  to={`/services?category=${category.id}`}
                  key={index}
                  className="block"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1 h-full">
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">
                        {category.title}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {category.services.slice(0, 3).map((service, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            • {service}
                          </div>
                        ))}
                        {category.services.length > 3 && (
                          <div className="text-sm text-blue-600">
                            +{category.services.length - 3} more
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          {category.providers} providers
                        </div>
                        <Button size="sm" variant="outline">
                          Explore
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">
              Why Choose AppointHub?
            </h3>
            <p className="text-gray-600 mt-4">
              Advanced features that make appointment booking effortless and
              reliable
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">
              Most Booked Services
            </h3>
            <p className="text-gray-600 mt-4">
              Popular appointments with instant availability
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <CardDescription className="text-blue-600">
                        {service.category}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      {service.available}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      {service.price}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {service.rating}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration} duration
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {service.providers} providers available
                    </div>
                  </div>
                  <Link
                    to={`/services?category=${service.category.toLowerCase()}&search=${encodeURIComponent(service.title)}`}
                  >
                    <Button className="w-full" size="sm">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">How It Works</h3>
            <p className="text-gray-600 mt-4">
              Book appointments in 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Search & Filter</h4>
              <p className="text-gray-600">
                Search by location, service type, or professional name. Use
                smart filters for availability, ratings, and price.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Book Instantly</h4>
              <p className="text-gray-600">
                See real-time availability and book your preferred time slot.
                Get instant confirmation with appointment details.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Attend & Review</h4>
              <p className="text-gray-600">
                Receive reminders, attend your appointment, and share your
                experience to help others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="professionals" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">
              Join Our Platform
            </h3>
            <p className="text-gray-600 mt-4">
              Whether you need appointments or provide services, we've got you
              covered
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customers */}
            <Card className="text-center p-6 h-full">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="mb-2">For Customers</CardTitle>
              <CardDescription className="mb-4">
                Book appointments with verified professionals across 100+
                service categories
              </CardDescription>
              <ul className="text-sm text-left space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Real-time availability
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Smart location-based search
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Free SMS & email reminders
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Secure payment options
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Review and rating system
                </li>
              </ul>
              <Link to="/register">
                <Button className="w-full">Start Booking</Button>
              </Link>
            </Card>

            {/* Service Providers */}
            <Card className="text-center p-6 border-2 border-blue-200 h-full">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="mb-2">For Professionals</CardTitle>
              <CardDescription className="mb-4">
                Grow your practice with our appointment management platform and
                reach more customers
              </CardDescription>
              <ul className="text-sm text-left space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Automated appointment scheduling
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Customer management dashboard
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Payment processing integration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Analytics and insights
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Marketing and promotion tools
                </li>
              </ul>
              <Link to="/register">
                <Button className="w-full">Join as Professional</Button>
              </Link>
              <Badge className="mt-2">
                Commission-free for first 100 bookings
              </Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">
              What Our Users Say
            </h3>
            <p className="text-gray-600 mt-4">
              Real experiences from customers across different service
              categories
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {testimonial.service}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-medium text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Book Your Next Appointment?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers who trust AppointHub for their
            professional service needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Book Your First Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold text-blue-400 mb-4">
                AppointHub
              </h4>
              <p className="text-gray-300">
                The comprehensive appointment booking platform connecting
                customers with verified professionals across all service
                categories.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Popular Categories</h5>
              <ul className="space-y-2 text-gray-300">
                <li>Healthcare & Wellness</li>
                <li>Beauty & Personal Care</li>
                <li>Legal & Financial</li>
                <li>Education & Coaching</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Professionals</h5>
              <ul className="space-y-2 text-gray-300">
                <li>Join Our Platform</li>
                <li>Business Tools</li>
                <li>Success Stories</li>
                <li>Support Center</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-300">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 AppointHub. All rights reserved. Making professional
              appointments effortless.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
