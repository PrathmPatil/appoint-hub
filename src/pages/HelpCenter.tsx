import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  CreditCard,
  Users,
  Calendar,
  Shield,
  Star,
  ExternalLink,
  FileText,
  Video,
  Headphones,
} from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const helpCategories = [
    {
      id: "booking",
      name: "Booking & Appointments",
      icon: Calendar,
      count: 15,
    },
    { id: "payment", name: "Payments & Billing", icon: CreditCard, count: 12 },
    { id: "account", name: "Account Management", icon: Users, count: 8 },
    { id: "safety", name: "Safety & Security", icon: Shield, count: 6 },
    { id: "providers", name: "For Service Providers", icon: Star, count: 20 },
  ];

  const faqData = [
    {
      category: "booking",
      question: "How do I book an appointment?",
      answer:
        "You can book an appointment by searching for the service you need, selecting a provider, choosing an available time slot, and completing the booking process. You'll receive confirmation via email and SMS.",
    },
    {
      category: "booking",
      question: "Can I reschedule or cancel my appointment?",
      answer:
        "Yes, you can reschedule or cancel appointments up to 24 hours before the scheduled time through your dashboard or by contacting the service provider directly.",
    },
    {
      category: "booking",
      question: "What if the service provider doesn't show up?",
      answer:
        "If a service provider doesn't show up, please contact our support team immediately. We'll help reschedule and may offer compensation based on our no-show policy.",
    },
    {
      category: "payment",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI, digital wallets, and bank transfers. Payment is processed securely through our certified payment partners.",
    },
    {
      category: "payment",
      question: "When am I charged for the service?",
      answer:
        "Payment is typically processed after the service is completed. Some providers may require advance payment or deposits, which will be clearly indicated during booking.",
    },
    {
      category: "payment",
      question: "Can I get a refund?",
      answer:
        "Refunds are processed according to our refund policy and the individual provider's cancellation terms. Most cancellations made 24+ hours in advance are eligible for full refunds.",
    },
    {
      category: "account",
      question: "How do I create an account?",
      answer:
        'Click on "Sign Up" and provide your email, phone number, and basic information. You\'ll receive a verification code to activate your account.',
    },
    {
      category: "account",
      question: "I forgot my password. How do I reset it?",
      answer:
        'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link.',
    },
    {
      category: "safety",
      question: "How do you verify service providers?",
      answer:
        "All service providers undergo background checks, identity verification, and credential validation. We also monitor reviews and ratings continuously.",
    },
    {
      category: "safety",
      question: "Is my personal information secure?",
      answer:
        "Yes, we use industry-standard encryption and security measures to protect your personal information. We never share your data with unauthorized parties.",
    },
    {
      category: "providers",
      question: "How do I join as a service provider?",
      answer:
        'Click on "Join as Professional" and complete the application process including identity verification, credential validation, and profile setup.',
    },
    {
      category: "providers",
      question: "What commission do you charge?",
      answer:
        "Our commission structure varies by service category. New providers get their first 100 bookings commission-free. Contact us for detailed pricing information.",
    },
  ];

  const quickActions = [
    {
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      action: "chat",
      available: true,
      waitTime: "< 2 min",
    },
    {
      title: "Call Support",
      description: "Speak directly with our support agents",
      icon: Phone,
      action: "call",
      available: true,
      waitTime: "< 5 min",
      number: "+1-800-APPOINT",
    },
    {
      title: "Email Support",
      description: "Send us detailed questions or feedback",
      icon: Mail,
      action: "email",
      available: true,
      waitTime: "< 2 hours",
      email: "support@appointhub.com",
    },
    {
      title: "Video Call Support",
      description: "Schedule a video consultation",
      icon: Video,
      action: "video",
      available: false,
      waitTime: "By appointment",
    },
  ];

  const supportHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 9:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "12:00 PM - 6:00 PM" },
  ];

  const tutorials = [
    {
      title: "Getting Started with AppointHub",
      description: "Learn the basics of booking appointments",
      duration: "5 min",
      type: "video",
      level: "Beginner",
    },
    {
      title: "Finding the Right Service Provider",
      description: "Tips for choosing the best professionals",
      duration: "3 min",
      type: "article",
      level: "Beginner",
    },
    {
      title: "Managing Your Appointments",
      description: "Reschedule, cancel, and track your bookings",
      duration: "4 min",
      type: "video",
      level: "Intermediate",
    },
    {
      title: "Payment and Billing Guide",
      description: "Understanding payments, refunds, and billing",
      duration: "6 min",
      type: "article",
      level: "Intermediate",
    },
  ];

  const systemStatus = {
    overall: "operational",
    services: [
      { name: "Booking System", status: "operational" },
      { name: "Payment Processing", status: "operational" },
      { name: "SMS Notifications", status: "partial_outage" },
      { name: "Email System", status: "operational" },
      { name: "Mobile App", status: "operational" },
    ],
  };

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "partial_outage":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "major_outage":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Operational";
      case "partial_outage":
        return "Partial Outage";
      case "major_outage":
        return "Major Outage";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-blue-100 mb-8">
            Get instant answers and expert support for all your AppointHub needs
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help articles, FAQs, or contact support..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  action.available ? "hover:-translate-y-1" : "opacity-60"
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      action.available
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {action.description}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{action.waitTime}</span>
                  </div>
                  {action.available && (
                    <Badge className="mt-3 bg-green-100 text-green-600">
                      Available
                    </Badge>
                  )}
                  {action.number && (
                    <p className="text-xs text-blue-600 mt-2">
                      {action.number}
                    </p>
                  )}
                  {action.email && (
                    <p className="text-xs text-blue-600 mt-2">{action.email}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
              >
                All Categories
              </Button>
              {helpCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.name}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Button>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to common questions about AppointHub
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials & Guides</CardTitle>
                <CardDescription>
                  Step-by-step guides to help you make the most of AppointHub
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tutorials.map((tutorial, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {tutorial.type === "video" ? (
                            <Video className="h-6 w-6 text-blue-600" />
                          ) : (
                            <FileText className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {tutorial.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {tutorial.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{tutorial.duration}</span>
                            <Badge variant="outline">{tutorial.level}</Badge>
                            <Badge variant="outline">{tutorial.type}</Badge>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus.overall)}
                  <span>System Status</span>
                  <Badge
                    className={
                      systemStatus.overall === "operational"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }
                  >
                    {getStatusText(systemStatus.overall)}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time status of all AppointHub services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemStatus.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(service.status)}
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          service.status === "operational"
                            ? "border-green-500 text-green-600"
                            : service.status === "partial_outage"
                              ? "border-yellow-500 text-yellow-600"
                              : "border-red-500 text-red-600"
                        }
                      >
                        {getStatusText(service.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-sm text-gray-600">
                  <p>Last updated: {new Date().toLocaleString()}</p>
                  <p>
                    For real-time updates, follow us on social media or
                    subscribe to status notifications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Multiple ways to reach our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-gray-600">+1-800-APPOINT</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-600">
                        support@appointhub.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-gray-600">Available 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Hours</CardTitle>
                  <CardDescription>
                    When our support team is available
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supportHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Emergency Support:</strong> Available 24/7 for
                      critical issues
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold">Terms of Service</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Legal terms and conditions for using AppointHub services
                  </p>
                  <Button variant="outline" size="sm">
                    Read Terms <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="h-6 w-6 text-green-600" />
                    <h3 className="font-semibold">Privacy Policy</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    How we collect, use, and protect your personal information
                  </p>
                  <Button variant="outline" size="sm">
                    Read Policy <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                    <h3 className="font-semibold">Refund Policy</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Guidelines for cancellations, refunds, and dispute
                    resolution
                  </p>
                  <Button variant="outline" size="sm">
                    Read Policy <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="h-6 w-6 text-orange-600" />
                    <h3 className="font-semibold">Community Guidelines</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Standards for behavior and interaction on our platform
                  </p>
                  <Button variant="outline" size="sm">
                    Read Guidelines <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenter;
