import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useAuth } from "@/hooks/useAuthRedux";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBookings } from "@/store/slices/dashboardSlice";
import {
  Calendar,
  Clock,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  CreditCard,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Timer,
  Navigation,
  Receipt,
  HeartHandshake,
  Repeat,
  MoreHorizontal,
} from "lucide-react";

interface BookingDetails {
  id: string;
  serviceName: string;
  providerName: string;
  providerPhone: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
  paymentStatus: "pending" | "paid" | "refunded";
  amount: number;
  location: string;
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    booked: string;
    confirmed?: string;
    started?: string;
    completed?: string;
  };
}

const BookingHistory = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { bookings, isLoading } = useAppSelector((state) => state.dashboard);
  
  const [filteredBookings, setFilteredBookings] = useState<BookingDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  // Mock detailed bookings data
  const mockBookings: BookingDetails[] = [
    {
      id: "booking-1",
      serviceName: "Hair Cut & Styling",
      providerName: "Maya Hair Salon",
      providerPhone: "+91 98765 43210",
      category: "Beauty & Personal Care",
      date: "2024-01-25",
      time: "2:00 PM",
      duration: "1 hour",
      status: "confirmed",
      paymentStatus: "paid",
      amount: 1200,
      location: "Andheri West, Mumbai",
      notes: "Please use organic products",
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-01-21T14:45:00Z",
      timeline: {
        booked: "2024-01-20T10:30:00Z",
        confirmed: "2024-01-21T14:45:00Z",
      }
    },
    {
      id: "booking-2", 
      serviceName: "General Consultation",
      providerName: "Dr. Sarah Johnson",
      providerPhone: "+91 98765 43211",
      category: "Healthcare",
      date: "2024-01-22",
      time: "10:00 AM",
      duration: "30 minutes",
      status: "completed",
      paymentStatus: "paid",
      amount: 800,
      location: "Bandra East, Mumbai",
      rating: 5,
      review: "Excellent service, very professional",
      createdAt: "2024-01-18T09:15:00Z",
      updatedAt: "2024-01-22T10:30:00Z",
      timeline: {
        booked: "2024-01-18T09:15:00Z",
        confirmed: "2024-01-19T11:20:00Z",
        started: "2024-01-22T10:00:00Z",
        completed: "2024-01-22T10:30:00Z",
      }
    },
    {
      id: "booking-3",
      serviceName: "Legal Consultation",
      providerName: "Advocate Ramesh Kumar",
      providerPhone: "+91 98765 43212",
      category: "Legal Services",
      date: "2024-01-28",
      time: "3:00 PM", 
      duration: "45 minutes",
      status: "pending",
      paymentStatus: "pending",
      amount: 2000,
      location: "Lower Parel, Mumbai",
      notes: "Property dispute consultation",
      createdAt: "2024-01-23T16:20:00Z",
      updatedAt: "2024-01-23T16:20:00Z",
      timeline: {
        booked: "2024-01-23T16:20:00Z",
      }
    },
    {
      id: "booking-4",
      serviceName: "Car Servicing",
      providerName: "AutoCare Plus",
      providerPhone: "+91 98765 43213",
      category: "Automotive",
      date: "2024-01-15",
      time: "11:00 AM",
      duration: "2 hours",
      status: "cancelled",
      paymentStatus: "refunded",
      amount: 3500,
      location: "Powai, Mumbai",
      createdAt: "2024-01-10T08:45:00Z",
      updatedAt: "2024-01-14T12:30:00Z",
      timeline: {
        booked: "2024-01-10T08:45:00Z",
        confirmed: "2024-01-11T09:15:00Z",
      }
    }
  ];

  useEffect(() => {
    dispatch(fetchBookings());
    setFilteredBookings(mockBookings);
  }, [dispatch]);

  // Filter bookings based on search and filters
  useEffect(() => {
    let filtered = mockBookings;

    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const bookingDate = new Date(booking.date);
      
      switch (dateFilter) {
        case "this_week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => new Date(booking.date) >= weekAgo);
          break;
        case "this_month":
          filtered = filtered.filter(booking => 
            new Date(booking.date).getMonth() === now.getMonth() &&
            new Date(booking.date).getFullYear() === now.getFullYear()
          );
          break;
        case "last_month":
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          filtered = filtered.filter(booking => 
            new Date(booking.date).getMonth() === lastMonth.getMonth() &&
            new Date(booking.date).getFullYear() === lastMonth.getFullYear()
          );
          break;
      }
    }

    setFilteredBookings(filtered);
  }, [searchQuery, statusFilter, dateFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "outline" as const, color: "text-yellow-600", icon: Timer },
      confirmed: { variant: "default" as const, color: "text-blue-600", icon: CheckCircle },
      in_progress: { variant: "default" as const, color: "text-purple-600", icon: RefreshCw },
      completed: { variant: "default" as const, color: "text-green-600", icon: CheckCircle },
      cancelled: { variant: "destructive" as const, color: "text-red-600", icon: XCircle },
      no_show: { variant: "destructive" as const, color: "text-orange-600", icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const config = {
      pending: { variant: "outline" as const, color: "text-yellow-600" },
      paid: { variant: "default" as const, color: "text-green-600" },
      refunded: { variant: "secondary" as const, color: "text-gray-600" },
    };

    return (
      <Badge variant={config[paymentStatus as keyof typeof config].variant}>
        {paymentStatus.toUpperCase()}
      </Badge>
    );
  };

  const handleTrackBooking = (booking: BookingDetails) => {
    setSelectedBooking(booking);
    setShowTrackingModal(true);
  };

  const handleRebookService = (booking: BookingDetails) => {
    navigate(`/explore?search=${encodeURIComponent(booking.serviceName)}`);
  };

  const handleRateService = (booking: BookingDetails) => {
    // Navigate to rating/review page
    navigate(`/dashboard/rate/${booking.id}`);
  };

  const renderTrackingTimeline = (booking: BookingDetails) => {
    const steps = [
      { key: 'booked', label: 'Booking Placed', time: booking.timeline.booked },
      { key: 'confirmed', label: 'Confirmed', time: booking.timeline.confirmed },
      { key: 'started', label: 'Service Started', time: booking.timeline.started },
      { key: 'completed', label: 'Service Completed', time: booking.timeline.completed },
    ];

    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
              step.time 
                ? 'bg-green-500' 
                : index === 0 || (steps[index - 1]?.time && !step.time)
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
            }`}></div>
            <div className="flex-1">
              <p className={`font-medium ${step.time ? 'text-green-600' : 'text-gray-500'}`}>
                {step.label}
              </p>
              {step.time && (
                <p className="text-sm text-gray-500">
                  {new Date(step.time).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const bookingStats = {
    total: mockBookings.length,
    upcoming: mockBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length,
    completed: mockBookings.filter(b => b.status === 'completed').length,
    cancelled: mockBookings.filter(b => b.status === 'cancelled').length,
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
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking History</h1>
            <p className="text-gray-600 mt-2">
              Track and manage all your appointments and services
            </p>
          </div>
          <Button onClick={() => navigate('/explore')}>
            <Calendar className="h-4 w-4 mr-2" />
            Book New Service
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookingStats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">{bookingStats.upcoming}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{bookingStats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{bookingStats.cancelled}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bookings ({filteredBookings.length})</CardTitle>
            <CardDescription>
              Complete history of all your appointments and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.serviceName}</p>
                        <p className="text-sm text-gray-500">{booking.category}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.providerName}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.location}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">{booking.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentBadge(booking.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">₹{booking.amount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTrackBooking(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {booking.status === 'completed' && !booking.rating && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRateService(booking)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRebookService(booking)}
                        >
                          <Repeat className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your filters"
                    : "You haven't made any bookings yet"
                  }
                </p>
                <Button onClick={() => navigate('/explore')}>
                  Book Your First Service
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Tracking Modal */}
        <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details & Tracking</DialogTitle>
              <DialogDescription>
                Track your booking status and view complete details
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-6">
                {/* Booking Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedBooking.serviceName}</h3>
                    <p className="text-gray-600">{selectedBooking.category}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Booking ID: {selectedBooking.id}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(selectedBooking.status)}
                    <p className="text-2xl font-bold mt-2">₹{selectedBooking.amount}</p>
                  </div>
                </div>

                {/* Provider Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Provider Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Provider</span>
                        <span className="font-medium">{selectedBooking.providerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone</span>
                        <span className="font-medium">{selectedBooking.providerPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location</span>
                        <span className="font-medium">{selectedBooking.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date & Time</span>
                        <span className="font-medium">
                          {new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span className="font-medium">{selectedBooking.duration}</span>
                      </div>
                      {selectedBooking.notes && (
                        <div>
                          <span className="text-sm text-gray-600">Notes:</span>
                          <p className="text-sm mt-1">{selectedBooking.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline Tracking */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderTrackingTimeline(selectedBooking)}
                  </CardContent>
                </Card>

                {/* Rating/Review */}
                {selectedBooking.status === 'completed' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedBooking.rating ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span>Rating:</span>
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < selectedBooking.rating!
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {selectedBooking.review && (
                            <p className="text-sm text-gray-600">{selectedBooking.review}</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-600 mb-3">Rate your experience</p>
                          <Button onClick={() => handleRateService(selectedBooking)}>
                            <Star className="h-4 w-4 mr-2" />
                            Rate & Review
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Receipt className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Provider
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleRebookService(selectedBooking)}
                  >
                    <Repeat className="h-4 w-4 mr-2" />
                    Book Again
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default BookingHistory;
