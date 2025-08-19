import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Download,
  Home,
  CreditCard,
  AlertCircle,
} from "lucide-react";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking } = location.state || {};

  console.log("BookingConfirmation - Location state:", location.state);
  console.log("BookingConfirmation - Booking data:", booking);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">
              We couldn't find your booking information.
            </p>
            <Link to="/explore">
              <Button>Back to Search</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaid = booking.paymentStatus === "completed";
  const isPending = booking.paymentStatus === "pending";

  const handlePaymentClick = () => {
    console.log("Navigating to payment with booking:", booking);
    navigate("/payment", {
      state: {
        booking: {
          ...booking,
          // Ensure all required fields are present
          service: booking.service || { name: "Service", duration: "30 min" },
          provider: booking.provider || {
            name: "Provider",
            location: "Location",
          },
          date: booking.date || new Date(),
          time: booking.time || "10:00 AM",
          totalAmount: booking.totalAmount || 500,
        },
      },
    });
  };

  const handleDownloadReceipt = () => {
    const receiptData = `
APPOINTMENT RECEIPT
==================
Provider: ${booking.provider?.name || 'Provider'}
Service: ${booking.service?.name || 'Service'}
Date: ${booking.date ? new Date(booking.date).toLocaleDateString() : 'Date TBD'}
Time: ${booking.time || 'Time TBD'}
Amount: ₹${booking.totalAmount || 0}
Status: ${isPaid ? "Paid" : "Payment Pending"}
Reference: #${(booking.provider?.id || 'BOOKING').toUpperCase()}-${Date.now().toString().slice(-4)}
    `;
    const blob = new Blob([receiptData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${booking.provider?.id || 'booking'}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddToCalendar = () => {
    const startDate = booking.date ? new Date(booking.date) : new Date();
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment with ${booking.provider?.name || 'Provider'}`)}&dates=${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(`Service: ${booking.service?.name || 'Service'}\nProvider: ${booking.provider?.name || 'Provider'}\nLocation: ${booking.provider?.location || "TBD"}`)}&location=${encodeURIComponent(booking.provider?.location || "")}`;

    window.open(calendarUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isPaid ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              {isPaid ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Clock className="h-8 w-8 text-yellow-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isPaid ? "Booking Confirmed!" : "Booking Reserved!"}
            </h1>
            <p className="text-gray-600">
              {isPaid
                ? "Your appointment has been confirmed and payment processed"
                : "Your appointment slot has been reserved. Payment pending."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={booking.provider?.profileImage || `https://api.dicebear.com/7.x/personas/svg?seed=${booking.provider?.name || 'provider'}`}
                      alt={booking.provider?.name || 'Provider'}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {booking.provider?.name || 'Provider'}
                      </h3>
                      <p className="text-gray-600">
                        {booking.provider?.specialization || 'Service Provider'}
                      </p>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {booking.provider?.location || 'Location TBD'}
                        </span>
                      </div>
                    </div>
                    <Badge variant={isPaid ? "default" : "secondary"}>
                      {isPaid ? "Confirmed" : "Reserved"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service & Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Service & Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Service</h4>
                    <p className="text-lg font-semibold">
                      {booking.service?.name || 'Service'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.service?.description || 'Service description'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Duration: {booking.service?.duration || '30 min'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Date & Time
                    </h4>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span>
                        {booking.date ? new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) : 'Date TBD'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{booking.time || 'Time TBD'}</span>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Additional Notes
                    </h4>
                    <p className="text-gray-700">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{booking.totalAmount || 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={isPaid ? "default" : "destructive"}>
                      {isPaid ? "Paid" : "Payment Pending"}
                    </Badge>
                    {isPending && (
                      <p className="text-sm text-gray-600 mt-1">
                        Pay before appointment
                      </p>
                    )}
                  </div>
                </div>

                {isPending && (
                  <div className="mt-4">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handlePaymentClick}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Payment Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            {/* Booking Reference */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Reference Number</p>
                  <p className="text-lg font-mono font-bold">
                    #{(booking.provider?.id || 'BOOKING').toUpperCase()}-
                    {Date.now().toString().slice(-4)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Call Provider</p>
                    <p className="font-medium">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">support@appointhub.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleAddToCalendar}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Important Notes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Arrive 10 minutes before your appointment</li>
                  <li>• Bring a valid ID for verification</li>
                  <li>• Free cancellation up to 24 hours before</li>
                  {isPending && (
                    <li>• Complete payment before your appointment</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <Link to="/explore">
            <Button variant="outline" size="lg">
              Book Another Appointment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
