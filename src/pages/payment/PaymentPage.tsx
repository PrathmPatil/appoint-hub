import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthRedux";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Shield,
  Lock,
  Calendar,
  DollarSign,
  CheckCircle,
  MapPin,
  Clock,
  Smartphone,
  QrCode,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingZip: "",
    upiId: "",
    phoneNumber: "",
  });

  // Get booking data from route state or use default
  const bookingData = location.state?.booking || {
    service: { name: "Home Cleaning Service", duration: "3 hours" },
    provider: {
      name: "CleanPro Services",
      location: "123 Oak Street, City, State",
    },
    date: new Date("2024-01-15"),
    time: "10:00 AM",
    totalAmount: 500,
    subtotal: 500,
    serviceFee: 50,
    total: 550,
  };

  // Format booking data for display
  const displayData = {
    service:
      typeof bookingData.service === "string"
        ? bookingData.service
        : bookingData.service?.name || "Service",
    provider:
      typeof bookingData.provider === "string"
        ? bookingData.provider
        : bookingData.provider?.name || "Provider",
    date:
      bookingData.date instanceof Date
        ? bookingData.date.toLocaleDateString()
        : bookingData.date || "2024-01-15",
    time: bookingData.time || "10:00 AM",
    duration: bookingData.service?.duration || bookingData.duration || "1 hour",
    location:
      bookingData.provider?.location || bookingData.location || "Location",
    subtotal: bookingData.totalAmount || bookingData.subtotal || 500,
    serviceFee: Math.round(
      (bookingData.totalAmount || bookingData.subtotal || 500) * 0.1,
    ),
    total: Math.round(
      (bookingData.totalAmount || bookingData.subtotal || 500) * 1.1,
    ),
  };

  // Generate QR Code for UPI payment
  useEffect(() => {
    if (paymentMethod === "upi" && user?.email) {
      const generateQRCode = async () => {
        const upiString = `upi://pay?pa=${user.email}&pn=${user.name || "User"}&am=${displayData.total}&cu=INR&tn=AppointHub Payment for ${displayData.service}`;

        try {
          const qrDataUrl = await QRCode.toDataURL(upiString, {
            width: 200,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
          setQrCodeDataUrl(qrDataUrl);
        } catch (error) {
          console.error("Error generating QR code:", error);
        }
      };

      generateQRCode();
    }
  }, [
    paymentMethod,
    user?.email,
    displayData.total,
    displayData.service,
    user?.name,
  ]);

  // UPI Apps configuration with deep links
  const upiApps = [
    {
      id: "gpay",
      name: "Google Pay",
      logo: "🟢",
      color: "border-green-500",
      deepLink: `https://pay.google.com/pay?pa=${user?.email}&pn=${user?.name || "User"}&am=${displayData.total}&cu=INR&tn=AppointHub Payment`,
    },
    {
      id: "phonepe",
      name: "PhonePe",
      logo: "🟣",
      color: "border-purple-500",
      deepLink: `phonepe://pay?pa=${user?.email}&pn=${user?.name || "User"}&am=${displayData.total}&cu=INR&tn=AppointHub Payment`,
    },
    {
      id: "paytm",
      name: "Paytm",
      logo: "🔵",
      color: "border-blue-500",
      deepLink: `paytmmp://pay?pa=${user?.email}&pn=${user?.name || "User"}&am=${displayData.total}&cu=INR&tn=AppointHub Payment`,
    },
    {
      id: "bhim",
      name: "BHIM UPI",
      logo: "🇮🇳",
      color: "border-orange-500",
      deepLink: `bhim://pay?pa=${user?.email}&pn=${user?.name || "User"}&am=${displayData.total}&cu=INR&tn=AppointHub Payment`,
    },
    {
      id: "amazonpay",
      name: "Amazon Pay",
      logo: "🟡",
      color: "border-yellow-500",
      deepLink: `https://www.amazon.in/pay?pa=${user?.email}&pn=${user?.name || "User"}&am=${displayData.total}&cu=INR&tn=AppointHub Payment`,
    },
    {
      id: "cred",
      name: "CRED",
      logo: "⚫",
      color: "border-black",
      deepLink: `cred://pay?pa=${user?.email}&pn=${user?.name || "User"}&am=${displayData.total}&cu=INR&tn=AppointHub Payment`,
    },
    {
      id: "mobikwik",
      name: "MobiKwik",
      logo: "🔴",
      color: "border-red-500",
      deepLink: `mobikwik://pay?pa=${user?.email}&pn=${user?.name || "User"}&am=${displayData.total}&cu=INR&tn=AppointHub Payment`,
    },
    {
      id: "freecharge",
      name: "Freecharge",
      logo: "💙",
      color: "border-blue-400",
      deepLink: `freecharge://pay?pa=${user?.email}&pn=${user?.name || "User"}&am=${displayData.total}&cu=INR&tn=AppointHub Payment`,
    },
  ];

  // Handle UPI app selection and redirect
  const handleUpiAppClick = (app: (typeof upiApps)[0]) => {
    setSelectedUpiApp(app.id);

    // Create a temporary link and click it to open the UPI app
    const link = document.createElement("a");
    link.href = app.deepLink;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show processing state
    setIsProcessing(true);

    // Simulate payment processing (in real app, you'd listen for payment status)
    setTimeout(() => {
      setIsProcessing(false);
      const confirmPayment = confirm(
        `Did you complete the payment via ${app.name}? Click OK if payment was successful.`,
      );
      if (confirmPayment) {
        navigate("/payment/success", {
          state: {
            booking: bookingData,
            paymentMethod: app.id,
            transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          },
        });
      }
    }, 3000);
  };

  // Handle wallet payments
  const handleWalletPayment = (walletId: string, walletName: string) => {
    setPaymentMethod(walletId);
    setIsProcessing(true);

    // Simulate wallet payment process
    setTimeout(() => {
      setIsProcessing(false);
      const confirmPayment = confirm(
        `Redirect to ${walletName}? Click OK to proceed with payment.`,
      );
      if (confirmPayment) {
        // In a real app, you'd redirect to the wallet's payment page
        window.open(`https://${walletId}.com/payment`, "_blank");

        setTimeout(() => {
          const paymentSuccess = confirm(
            `Did you complete the payment via ${walletName}? Click OK if payment was successful.`,
          );
          if (paymentSuccess) {
            navigate("/payment/success", {
              state: {
                booking: bookingData,
                paymentMethod: walletId,
                transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              },
            });
          }
        }, 2000);
      }
    }, 1000);
  };

  // Handle net banking
  const handleNetBanking = (bankName: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const confirmPayment = confirm(
        `Redirect to ${bankName} Net Banking? Click OK to proceed.`,
      );
      if (confirmPayment) {
        // In a real app, you'd redirect to the bank's payment gateway
        window.open(
          `https://${bankName.toLowerCase().replace(" ", "")}.in/netbanking`,
          "_blank",
        );

        setTimeout(() => {
          const paymentSuccess = confirm(
            `Did you complete the payment via ${bankName}? Click OK if payment was successful.`,
          );
          if (paymentSuccess) {
            navigate("/payment/success", {
              state: {
                booking: bookingData,
                paymentMethod: "netbanking",
                transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              },
            });
          }
        }, 2000);
      }
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields based on payment method
    if (paymentMethod === "upi" && !formData.phoneNumber) {
      alert("Please enter your phone number");
      return;
    }

    if (paymentMethod === "card") {
      if (
        !formData.cardNumber ||
        !formData.nameOnCard ||
        !formData.expiryDate ||
        !formData.cvv
      ) {
        alert("Please fill in all card details");
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Always go to success page since there's no real API
      navigate("/payment/success", {
        state: {
          booking: bookingData,
          paymentMethod,
          transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          amount: displayData.total,
          paymentDetails: {
            phoneNumber: formData.phoneNumber,
            upiId: formData.upiId || user?.email,
            cardLast4: formData.cardNumber
              ? formData.cardNumber.slice(-4)
              : null,
          },
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      alert("Payment failed. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPaymentButtonText = () => {
    switch (paymentMethod) {
      case "upi":
        return selectedUpiApp
          ? `Pay with ${selectedUpiApp.toUpperCase()}`
          : "Pay with UPI";
      case "card":
        return "Pay with Card";
      default:
        return `Pay with ${paymentMethod}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600 mt-2">
            Complete your booking payment securely
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Enter your payment information to complete the booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Method Tabs */}
                  <Tabs
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger
                        value="upi"
                        className="flex items-center gap-2"
                      >
                        <Smartphone className="h-4 w-4" />
                        UPI
                      </TabsTrigger>
                      <TabsTrigger
                        value="card"
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        Cards
                      </TabsTrigger>
                      <TabsTrigger
                        value="wallet"
                        className="flex items-center gap-2"
                      >
                        <QrCode className="h-4 w-4" />
                        Wallets
                      </TabsTrigger>
                    </TabsList>

                    {/* UPI Payment Options */}
                    <TabsContent value="upi" className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {upiApps.map((app) => (
                          <div
                            key={app.id}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              selectedUpiApp === app.id
                                ? `${app.color} bg-gray-50`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleUpiAppClick(app)}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-1">{app.logo}</div>
                              <div className="text-xs font-medium">
                                {app.name}
                              </div>
                              <ExternalLink className="h-3 w-3 mx-auto mt-1 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="upiId">UPI ID (Optional)</Label>
                          <Input
                            id="upiId"
                            placeholder="yourname@upi"
                            value={formData.upiId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                upiId: e.target.value,
                              })
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter your UPI ID or click on any UPI app above to
                            pay directly
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            placeholder="+91 9876543210"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phoneNumber: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="border rounded-lg p-4 text-center">
                        <QrCode className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <h4 className="font-medium mb-1">Scan QR Code</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Open any UPI app and scan the QR code to pay ₹
                          {displayData.total}
                        </p>
                        <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                          {qrCodeDataUrl ? (
                            <img
                              src={qrCodeDataUrl}
                              alt="UPI Payment QR Code"
                              className="w-40 h-40 mx-auto"
                            />
                          ) : (
                            <div className="w-40 h-40 flex items-center justify-center">
                              <div className="text-center">
                                <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                  Loading QR Code...
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Amount: ₹{displayData.total} | Payee: {user?.email}
                        </p>
                      </div>
                    </TabsContent>

                    {/* Card Payment Options */}
                    <TabsContent value="card" className="space-y-4">
                      {/* Card Type Selection */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {[
                          { name: "Visa", logo: "💳", color: "bg-blue-600" },
                          {
                            name: "Mastercard",
                            logo: "💳",
                            color: "bg-red-600",
                          },
                          { name: "RuPay", logo: "🇮🇳", color: "bg-green-600" },
                          { name: "Amex", logo: "💎", color: "bg-gray-600" },
                        ].map((card) => (
                          <div
                            key={card.name}
                            className="p-3 border rounded-lg text-center"
                          >
                            <div className="text-lg mb-1">{card.logo}</div>
                            <div className="text-xs font-medium">
                              {card.name}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Card Form */}
                      <div className="space-y-4">
                        {/* Card Number */}
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <div className="relative">
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");
                                value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                                setFormData({ ...formData, cardNumber: value });
                              }}
                              maxLength={19}
                              required
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {/* Name on Card */}
                        <div>
                          <Label htmlFor="nameOnCard">Name on Card</Label>
                          <Input
                            id="nameOnCard"
                            placeholder="JOHN DOE"
                            value={formData.nameOnCard}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                nameOnCard: e.target.value.toUpperCase(),
                              })
                            }
                            required
                          />
                        </div>

                        {/* Expiry and CVV */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");
                                if (value.length >= 2) {
                                  value =
                                    value.slice(0, 2) + "/" + value.slice(2, 4);
                                }
                                setFormData({ ...formData, expiryDate: value });
                              }}
                              maxLength={5}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <div className="relative">
                              <Input
                                id="cvv"
                                type={showCvv ? "text" : "password"}
                                placeholder="123"
                                value={formData.cvv}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    cvv: e.target.value.replace(/\D/g, ""),
                                  })
                                }
                                maxLength={4}
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowCvv(!showCvv)}
                              >
                                {showCvv ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Save Card Option */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="saveCard"
                            className="rounded"
                          />
                          <Label htmlFor="saveCard" className="text-sm">
                            Save card for future payments
                          </Label>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Wallet Payment Options */}
                    <TabsContent value="wallet" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            id: "paytm",
                            name: "Paytm Wallet",
                            logo: "🔵",
                            desc: "Pay using Paytm wallet balance",
                          },
                          {
                            id: "phonepe",
                            name: "PhonePe Wallet",
                            logo: "🟣",
                            desc: "Pay using PhonePe wallet",
                          },
                          {
                            id: "amazonpay",
                            name: "Amazon Pay",
                            logo: "🟡",
                            desc: "Pay using Amazon Pay balance",
                          },
                          {
                            id: "mobikwik",
                            name: "MobiKwik",
                            logo: "🔴",
                            desc: "Pay using MobiKwik wallet",
                          },
                          {
                            id: "freecharge",
                            name: "Freecharge",
                            logo: "💙",
                            desc: "Pay using Freecharge wallet",
                          },
                          {
                            id: "jiopay",
                            name: "JioMoney",
                            logo: "💎",
                            desc: "Pay using Jio wallet",
                          },
                        ].map((wallet) => (
                          <div
                            key={wallet.id}
                            className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all hover:border-blue-300"
                            onClick={() =>
                              handleWalletPayment(wallet.id, wallet.name)
                            }
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{wallet.logo}</div>
                              <div className="flex-1">
                                <h4 className="font-medium">{wallet.name}</h4>
                                <p className="text-xs text-gray-600">
                                  {wallet.desc}
                                </p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Net Banking */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Net Banking</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            "SBI",
                            "HDFC",
                            "ICICI",
                            "Axis Bank",
                            "Kotak",
                            "PNB",
                            "BOB",
                            "Canara",
                            "Union Bank",
                            "IDBI",
                            "Indian Bank",
                            "Other Banks",
                          ].map((bank) => (
                            <div
                              key={bank}
                              className="p-3 border rounded text-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all"
                              onClick={() => handleNetBanking(bank)}
                            >
                              <div className="text-sm font-medium">{bank}</div>
                              <ExternalLink className="h-3 w-3 mx-auto mt-1 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Security & Payment Info */}
                  <div className="space-y-3">
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Your payment information is encrypted and secure. We use
                        bank-grade security.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Payment Benefits
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Instant payment confirmation</li>
                        <li>• UPI payments are free of charge</li>
                        <li>• Automatic receipt generation</li>
                        <li>• 24/7 customer support</li>
                        <li>• Refund protection available</li>
                      </ul>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    {/* Regular Payment Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing Payment...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Complete Payment - ₹{displayData.total}
                        </div>
                      )}
                    </Button>

                    {/* Test Buttons for Demo */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => {
                          setIsProcessing(true);
                          setTimeout(() => {
                            navigate("/payment/success", {
                              state: {
                                booking: bookingData,
                                paymentMethod: "test_success",
                                transactionId: `TEST-SUCCESS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                                amount: displayData.total,
                              },
                            });
                          }, 1500);
                        }}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        ✅ Test Success
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => {
                          setIsProcessing(true);
                          setTimeout(() => {
                            setIsProcessing(false);
                            alert(
                              "❌ Payment Failed: Insufficient funds or network error. Please try again.",
                            );
                          }, 1500);
                        }}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        ❌ Test Failure
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                      Use test buttons above for demo purposes (no real payment
                      processing)
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Service Details */}
                <div>
                  <h4 className="font-medium text-gray-900">
                    {displayData.service}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {displayData.provider}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Provider
                  </Badge>
                </div>

                <Separator />

                {/* Date & Time */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{displayData.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      {displayData.time} ({displayData.duration})
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{displayData.location}</span>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>₹{displayData.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee</span>
                    <span>₹{displayData.serviceFee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{displayData.total}</span>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-1">
                    Cancellation Policy
                  </h5>
                  <p className="text-xs text-gray-600">
                    Free cancellation up to 24 hours before service. After that,
                    a 50% fee applies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
