import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  XCircle,
  RefreshCw,
  Home,
  CreditCard,
  Phone,
  Mail,
} from "lucide-react";

const PaymentError = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    booking,
    error = "Payment failed due to an unknown error",
    errorCode = "PAYMENT_FAILED",
    retryUrl = "/payment",
  } = location.state || {};

  const handleRetry = () => {
    if (booking) {
      navigate(retryUrl, { state: { booking } });
    } else {
      navigate("/payment");
    }
  };

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleContactSupport = () => {
    // In a real app, this would open a support chat or call
    window.open("tel:+911234567890", "_self");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Failed</h1>
          <p className="text-gray-600 mt-2">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Payment Error Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>

            {errorCode && (
              <div className="text-sm text-gray-600">
                <strong>Error Code:</strong> {errorCode}
              </div>
            )}

            {/* Common Error Solutions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Common Solutions:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check your internet connection</li>
                <li>• Verify your card details are correct</li>
                <li>• Ensure sufficient balance in your account</li>
                <li>• Try a different payment method</li>
                <li>• Contact your bank if the issue persists</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Booking Summary */}
        {booking && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">
                  {typeof booking.service === "string"
                    ? booking.service
                    : booking.service?.name || "Service"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-lg">
                  ₹{booking.totalAmount || booking.total || "500"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {booking.date instanceof Date
                    ? booking.date.toLocaleDateString()
                    : booking.date || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{booking.time || "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>

          {/* Support Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                If you continue to experience issues, our support team is here
                to help.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContactSupport}
                  className="w-full"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>

                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/help">
                    <Mail className="h-4 w-4 mr-2" />
                    Help Center
                  </Link>
                </Button>
              </div>

              <div className="text-center pt-3 border-t">
                <p className="text-xs text-gray-500">
                  Support: +91 12345 67890 | Available 24/7
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
