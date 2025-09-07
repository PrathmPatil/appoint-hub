import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
  AlertCircle,
  User,
  Star,
  Info,
  ArrowRight,
} from "lucide-react";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking } = location.state || {};

  // Prevent auto-scroll by scrolling to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  const handleAddToCalendar = () => {
    const startDate = booking.date ? new Date(booking.date) : new Date();
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment with ${booking.provider?.name || 'Provider'}`)}&dates=${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(`Service: ${booking.service?.name || 'Service'}\nProvider: ${booking.provider?.name || 'Provider'}\nLocation: ${booking.provider?.location || "TBD"}`)}&location=${encodeURIComponent(booking.provider?.location || "")}`;

    window.open(calendarUrl, "_blank");
  };

  const handleDownloadConfirmation = () => {
    const bookingRef = `#${(booking.provider?.id || 'BOOKING').toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const currentDate = new Date().toLocaleDateString();
    const serviceDate = booking.date ? new Date(booking.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Date TBD';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation - ${bookingRef}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .header .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }

        .content {
            padding: 30px;
        }

        .confirmation-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #dcfce7;
            color: #166534;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 25px;
        }

        .reference-box {
            background: #f1f5f9;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
        }

        .reference-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .reference-number {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            font-family: 'Courier New', monospace;
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }

        .detail-section {
            background: #fafafa;
            border-radius: 8px;
            padding: 20px;
            border-left: 4px solid #2563eb;
        }

        .detail-title {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .detail-item {
            margin-bottom: 10px;
        }

        .detail-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .detail-value {
            font-size: 14px;
            color: #1e293b;
            font-weight: 500;
        }

        .payment-info {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            border-left: 4px solid #f59e0b;
        }

        .payment-title {
            font-size: 16px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .payment-text {
            color: #92400e;
            font-size: 14px;
            line-height: 1.5;
        }

        .notes-section {
            background: #f0f9ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            border-left: 4px solid #0ea5e9;
        }

        .notes-title {
            font-size: 16px;
            font-weight: 700;
            color: #0c4a6e;
            margin-bottom: 15px;
        }

        .notes-list {
            list-style: none;
            padding: 0;
        }

        .notes-list li {
            padding: 5px 0;
            color: #0c4a6e;
            position: relative;
            padding-left: 20px;
        }

        .notes-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #0ea5e9;
            font-weight: bold;
        }

        .contact-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #475569;
            font-size: 14px;
        }

        .footer {
            background: #f8fafc;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 12px;
        }

        .logo {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }

        .logo-icon {
            width: 32px;
            height: 32px;
            background: rgba(255,255,255,0.2);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
        }

        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">AH</div>
                <span style="font-size: 20px; font-weight: 600;">AppointHub</span>
            </div>
            <h1>Appointment Confirmation</h1>
            <p class="subtitle">Your appointment has been successfully scheduled</p>
        </div>

        <div class="content">
            <div class="confirmation-badge">
                <span>✓</span>
                <span>CONFIRMED - No Payment Required</span>
            </div>

            <div class="reference-box">
                <div class="reference-label">Booking Reference Number</div>
                <div class="reference-number">${bookingRef}</div>
            </div>

            <div class="details-grid">
                <div class="detail-section">
                    <div class="detail-title">
                        <span>👤</span>
                        Service Provider
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Provider Name</div>
                        <div class="detail-value">${booking.provider?.name || 'Provider Name'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Specialization</div>
                        <div class="detail-value">${booking.provider?.specialization || 'Professional Service'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Location</div>
                        <div class="detail-value">${booking.provider?.location || 'Service Location'}</div>
                    </div>
                </div>

                <div class="detail-section">
                    <div class="detail-title">
                        <span>📅</span>
                        Appointment Details
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Service</div>
                        <div class="detail-value">${booking.service?.name || 'Service Name'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Date</div>
                        <div class="detail-value">${serviceDate}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Time</div>
                        <div class="detail-value">${booking.time || 'Time TBD'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Duration</div>
                        <div class="detail-value">${booking.service?.duration || 'As needed'}</div>
                    </div>
                </div>
            </div>

            <div class="payment-info">
                <div class="payment-title">
                    <span>💳</span>
                    Payment Information
                </div>
                <p class="payment-text">
                    <strong>No upfront payment required!</strong> You will be charged only after your service is completed,
                    based on the actual services you receive. This ensures you pay for exactly what you get.
                </p>
            </div>

            <div class="notes-section">
                <div class="notes-title">Important Instructions</div>
                <ul class="notes-list">
                    <li>Arrive 10 minutes before your scheduled appointment time</li>
                    <li>Bring a valid government-issued ID for verification</li>
                    <li>Payment will be processed after service completion</li>
                    <li>Free cancellation available up to 24 hours in advance</li>
                    <li>You will receive a detailed bill after your service</li>
                </ul>
            </div>

            <div class="contact-section">
                <div class="contact-item">
                    <span>📞</span>
                    <span><strong>Call:</strong> +91 98765 43210</span>
                </div>
                <div class="contact-item">
                    <span>✉️</span>
                    <span><strong>Email:</strong> support@appointhub.com</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Generated on ${currentDate} | This is an official appointment confirmation from AppointHub</p>
            <p style="margin-top: 5px;">Keep this confirmation for your records</p>
        </div>
    </div>

    <script>
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Appointment Scheduled!
            </h1>
            <p className="text-green-100 text-lg">
              Your slot has been reserved successfully. No payment required now!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* How it Works Info */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Info className="h-5 w-5 mr-2" />
              How Our Payment System Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Book Your Slot</h3>
                <p className="text-sm text-blue-600">Reserve your appointment without any upfront payment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Get Your Service</h3>
                <p className="text-sm text-blue-600">Receive the service and any additional treatments you need</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Pay After Service</h3>
                <p className="text-sm text-blue-600">Pay only for the services you actually received</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Appointment Details</span>
                  <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={booking.provider?.profileImage || `https://api.dicebear.com/7.x/personas/svg?seed=${booking.provider?.name || 'provider'}`}
                      alt={booking.provider?.name || 'Provider'}
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {booking.provider?.name || 'Provider'}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        {booking.provider?.specialization || 'Service Provider'}
                      </p>
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">
                          {booking.provider?.rating || '4.8'}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          ({booking.provider?.reviewCount || '120'} reviews)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {booking.provider?.location || 'Location TBD'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        {booking.provider?.type === 'business' ? 'Business' : 'Individual'}
                      </Badge>
                    </div>
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
                    <h4 className="font-medium text-gray-900 mb-2">Service Booked</h4>
                    <p className="text-lg font-semibold mb-1">
                      {booking.service?.name || 'Service'}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {booking.service?.description || 'Service description'}
                    </p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Estimated Duration: {booking.service?.duration || '30 min'}</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Starting Price: ₹{booking.service?.price || booking.pricing?.min || 'TBD'}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Appointment Time
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">
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
                        <span className="font-medium">{booking.time || 'Time TBD'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <>
                    <Separator className="my-4" />
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Additional Notes
                      </h4>
                      <p className="text-gray-700">{booking.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <Info className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Pay After Service</h4>
                  <p className="text-orange-700 text-sm mb-3">
                    No upfront payment required! You'll pay only after receiving your service.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-orange-600">Estimated Base Price:</span>
                      <span className="font-medium">₹{booking.service?.price || booking.pricing?.min || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-600">Final Amount:</span>
                      <span className="font-medium">Based on services received</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-white rounded border border-orange-200">
                    <p className="text-xs text-orange-600">
                      💡 <strong>Benefit:</strong> Pay only for what you use! If you need additional services, 
                      they'll be added to your final bill. If you need fewer services, you'll pay less.
                    </p>
                  </div>
                </div>
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
                  <p className="text-lg font-mono font-bold bg-gray-100 p-2 rounded">
                    #{(booking.provider?.id || 'BOOKING').toUpperCase()}-
                    {Date.now().toString().slice(-4)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Save this number for your records
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Confirmation Email</h4>
                      <p className="text-sm text-gray-600">
                        You'll receive appointment details via email
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Provider Contact</h4>
                      <p className="text-sm text-gray-600">
                        Provider will contact you 24 hours before
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Service & Payment</h4>
                      <p className="text-sm text-gray-600">
                        Get your service, then pay for what you received
                      </p>
                    </div>
                  </div>
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
                    <p className="text-sm text-gray-600">Email Support</p>
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
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => navigate('/dashboard')}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadConfirmation}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Confirmation
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleAddToCalendar}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
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
                  <li>• Payment only after service completion</li>
                  <li>• You can add/modify services during appointment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/explore">
            <Button variant="outline" size="lg">
              Book Another Appointment
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              View My Appointments
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
