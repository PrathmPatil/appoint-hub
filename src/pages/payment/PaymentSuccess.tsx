import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Download,
  Home,
} from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { booking, paymentMethod, transactionId } = location.state || {};

  useEffect(() => {
    // If no booking data, redirect to dashboard
    if (!booking) {
      navigate("/dashboard");
    }
  }, [booking, navigate]);

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mt-2">Your booking has been confirmed</p>
        </div>

        {/* Booking Confirmation Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Confirmation</span>
              <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service Info */}
            <div>
              <h3 className="font-medium text-gray-900">{booking.service}</h3>
              <p className="text-sm text-gray-600">{booking.provider}</p>
            </div>

            <Separator />

            {/* Booking Details */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-gray-600">{booking.date}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm text-gray-600">
                    {booking.time} ({booking.duration})
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600">{booking.location}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Payment Details
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">
                    {paymentMethod.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-medium">${booking.total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Confirmation Email
                  </h4>
                  <p className="text-sm text-gray-600">
                    You'll receive a confirmation email with all booking details
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Provider Contact
                  </h4>
                  <p className="text-sm text-gray-600">
                    The service provider will contact you 24 hours before the
                    appointment
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Service Delivery
                  </h4>
                  <p className="text-sm text-gray-600">
                    Enjoy your service and don't forget to leave a review!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Call Support</p>
                  <p className="text-sm text-gray-600">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">
                    support@servicehub.com
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>

          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Booking Reference:{" "}
            <span className="font-mono font-medium">{transactionId}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Save this reference number for your records
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
