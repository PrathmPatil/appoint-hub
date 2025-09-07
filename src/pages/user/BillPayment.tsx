import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Receipt,
  Calendar,
  Clock,
  User,
  Star,
  CreditCard,
  Wallet,
  Smartphone,
  Check,
  Download,
  AlertCircle,
  Info,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  category: string;
}

interface Bill {
  id: string;
  appointmentId: string;
  providerName: string;
  providerRating: number;
  servicedAt: string;
  services: BillItem[];
  additionalServices: BillItem[];
  subtotal: number;
  discount: {
    amount: number;
    type: "percentage" | "amount";
    value: number;
  };
  total: number;
  notes?: string;
  status: "pending" | "paid" | "disputed";
  generatedAt: string;
  dueDate: string;
}

const BillPayment = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock bill data - in real app, fetch from API
  const [bill] = useState<Bill>({
    id: billId || "bill-123",
    appointmentId: "apt-456",
    providerName: "Bella Hair Studio",
    providerRating: 4.8,
    servicedAt: "2024-01-15T14:00:00Z",
    services: [
      {
        id: "s1",
        name: "Hair Cut & Styling",
        quantity: 1,
        price: 800,
        category: "Hair",
        notes: "Premium styling with advanced techniques"
      },
      {
        id: "s2",
        name: "Hair Wash",
        quantity: 1,
        price: 200,
        category: "Hair"
      }
    ],
    additionalServices: [
      {
        id: "a1",
        name: "Hair Conditioning Treatment",
        quantity: 1,
        price: 300,
        category: "Hair",
        notes: "Deep conditioning for damaged hair"
      },
      {
        id: "a2",
        name: "Scalp Massage",
        quantity: 1,
        price: 200,
        category: "Massage",
        notes: "Relaxing 10-minute scalp massage"
      }
    ],
    subtotal: 1500,
    discount: {
      amount: 150,
      type: "percentage",
      value: 10
    },
    total: 1350,
    notes: "Thank you for choosing our services! We hope you love your new look.",
    status: "pending",
    generatedAt: "2024-01-15T16:30:00Z",
    dueDate: "2024-01-22T23:59:59Z",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Pay securely with your card" },
    { id: "upi", name: "UPI", icon: Smartphone, description: "Pay with any UPI app" },
    { id: "wallet", name: "Digital Wallet", icon: Wallet, description: "PayTM, PhonePe, Google Pay" },
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod) return;

    setIsProcessingPayment(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Navigate to success page
    navigate("/payment/success", {
      state: {
        booking: {
          service: { name: bill.services[0]?.name },
          provider: { name: bill.providerName },
          date: new Date(bill.servicedAt),
          time: new Date(bill.servicedAt).toLocaleTimeString(),
          total: bill.total
        },
        paymentMethod: selectedPaymentMethod,
        transactionId: `TXN${Date.now()}`
      }
    });

    setIsProcessingPayment(false);
  };

  const handleDownloadBill = () => {
    const billData = `
SERVICE BILL
============
Bill ID: ${bill.id}
Provider: ${bill.providerName}
Service Date: ${new Date(bill.servicedAt).toLocaleDateString()}

SERVICES PROVIDED:
${bill.services.map(s => `- ${s.name} (×${s.quantity}): ₹${s.price * s.quantity}`).join('\n')}

${bill.additionalServices.length > 0 ? 'ADDITIONAL SERVICES:\n' + bill.additionalServices.map(s => `- ${s.name} (×${s.quantity}): ₹${s.price * s.quantity}`).join('\n') : ''}

Subtotal: ₹${bill.subtotal}
Discount: -₹${bill.discount.amount}
TOTAL: ₹${bill.total}

${bill.notes ? `Notes: ${bill.notes}` : ''}

Generated: ${new Date(bill.generatedAt).toLocaleString()}
Due Date: ${new Date(bill.dueDate).toLocaleDateString()}
    `;

    const blob = new Blob([billData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bill-${bill.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isOverdue = new Date() > new Date(bill.dueDate);
  const daysUntilDue = Math.ceil((new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Bill</h1>
              <p className="text-gray-600">Review and pay for services received</p>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {bill.status === "pending" && (
          <Alert className={`mb-6 ${isOverdue ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}`}>
            <AlertCircle className={`h-4 w-4 ${isOverdue ? "text-red-600" : "text-orange-600"}`} />
            <AlertDescription className={isOverdue ? "text-red-800" : "text-orange-800"}>
              {isOverdue 
                ? `This bill is overdue by ${Math.abs(daysUntilDue)} days. Please pay immediately.`
                : `Payment due in ${daysUntilDue} days (by ${new Date(bill.dueDate).toLocaleDateString()})`
              }
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bill Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider & Service Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Service Provider</span>
                  <Badge variant={bill.status === "paid" ? "default" : "secondary"}>
                    {bill.status === "paid" ? "Paid" : "Pending Payment"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {bill.providerName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{bill.providerName}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{bill.providerRating}</span>
                      <span className="text-gray-500 ml-1">(120+ reviews)</span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Service Date: {new Date(bill.servicedAt).toLocaleDateString()}</span>
                      <Clock className="h-3 w-3 ml-3 mr-1" />
                      <span>{new Date(bill.servicedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Provided */}
            <Card>
              <CardHeader>
                <CardTitle>Services Provided</CardTitle>
                <CardDescription>
                  Details of all services you received during your appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Original Services */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Booked Services</h4>
                    {bill.services.map((service) => (
                      <div key={service.id} className="flex justify-between items-start py-3 border-b last:border-b-0">
                        <div className="flex-1">
                          <h5 className="font-medium">{service.name}</h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {service.category}
                            </Badge>
                            {service.quantity > 1 && (
                              <span className="text-sm text-gray-600">Quantity: {service.quantity}</span>
                            )}
                          </div>
                          {service.notes && (
                            <p className="text-sm text-gray-600 mt-1">{service.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{service.price * service.quantity}</p>
                          {service.quantity > 1 && (
                            <p className="text-xs text-gray-500">₹{service.price} each</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional Services */}
                  {bill.additionalServices.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <span>Additional Services</span>
                          <Badge variant="secondary" className="ml-2 text-xs">Extra</Badge>
                        </h4>
                        {bill.additionalServices.map((service) => (
                          <div key={service.id} className="flex justify-between items-start py-3 border-b last:border-b-0">
                            <div className="flex-1">
                              <h5 className="font-medium">{service.name}</h5>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                                  {service.category}
                                </Badge>
                                {service.quantity > 1 && (
                                  <span className="text-sm text-gray-600">Quantity: {service.quantity}</span>
                                )}
                              </div>
                              {service.notes && (
                                <p className="text-sm text-gray-600 mt-1">{service.notes}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{service.price * service.quantity}</p>
                              {service.quantity > 1 && (
                                <p className="text-xs text-gray-500">₹{service.price} each</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Provider Notes */}
            {bill.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Provider Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{bill.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {/* Bill Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Bill Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{bill.subtotal}</span>
                  </div>
                  
                  {bill.discount.amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Discount ({bill.discount.type === "percentage" ? `${bill.discount.value}%` : `₹${bill.discount.value}`})
                      </span>
                      <span>-₹{bill.discount.amount}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{bill.total}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Generated: {new Date(bill.generatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Actions */}
            {bill.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Options</CardTitle>
                  <CardDescription>
                    Choose your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Payment Methods */}
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <method.icon className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-xs text-gray-600">{method.description}</p>
                          </div>
                          {selectedPaymentMethod === method.id && (
                            <Check className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pay Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowPaymentDialog(true)}
                    disabled={!selectedPaymentMethod}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ₹{bill.total}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Additional Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={handleDownloadBill}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Bill
                </Button>
                
                <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
                  <User className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Bill Information */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bill ID:</span>
                    <span className="font-mono">{bill.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Appointment ID:</span>
                    <span className="font-mono">{bill.appointmentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                      {new Date(bill.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Confirmation Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Payment</DialogTitle>
              <DialogDescription>
                Please review your payment details before confirming
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-xl font-bold">₹{bill.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <span className="text-sm">
                    {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                  </span>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your payment will be processed securely. You will receive a confirmation email once the payment is successful.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handlePayment} 
                disabled={isProcessingPayment}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BillPayment;
