import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Plus,
  Minus,
  Calendar,
  Clock,
  User,
  Check,
  Send,
  Calculator,
  AlertCircle,
  Receipt,
  Save,
} from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isCompleted: boolean;
  quantity: number;
  notes?: string;
}

interface AdditionalService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

const ServiceBilling = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  // Mock appointment data - in real app, fetch from API
  const [appointment, setAppointment] = useState({
    id: appointmentId,
    clientName: "John Doe",
    clientEmail: "john@example.com",
    clientPhone: "+91 98765 43210",
    date: "2024-01-15",
    time: "2:00 PM",
    status: "in-progress",
    originalServices: [
      {
        id: "service-1",
        name: "Hair Cut & Styling",
        description: "Professional hair cutting and styling",
        price: 800,
        duration: 60,
        category: "Hair",
        isCompleted: false,
        quantity: 1,
      },
      {
        id: "service-2",
        name: "Hair Wash",
        description: "Deep cleansing hair wash with premium products",
        price: 200,
        duration: 15,
        category: "Hair",
        isCompleted: false,
        quantity: 1,
      },
    ],
  });

  const [completedServices, setCompletedServices] = useState<ServiceItem[]>([]);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage");
  const [notes, setNotes] = useState("");
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);

  // Available additional services
  const availableServices = [
    { id: "add-1", name: "Hair Conditioning Treatment", price: 300, category: "Hair" },
    { id: "add-2", name: "Scalp Massage", price: 200, category: "Massage" },
    { id: "add-3", name: "Hair Styling (Extra)", price: 150, category: "Hair" },
    { id: "add-4", name: "Beard Trim", price: 250, category: "Grooming" },
    { id: "add-5", name: "Face Cleanup", price: 400, category: "Face" },
  ];

  useEffect(() => {
    // Initialize completed services with original services
    setCompletedServices(appointment.originalServices.map(service => ({ ...service, isCompleted: false, quantity: 1 })));
  }, []);

  const handleServiceCompletion = (serviceId: string, completed: boolean) => {
    setCompletedServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, isCompleted: completed }
          : service
      )
    );
  };

  const handleServiceQuantity = (serviceId: string, quantity: number) => {
    setCompletedServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, quantity: Math.max(0, quantity) }
          : service
      )
    );
  };

  const handleServiceNotes = (serviceId: string, notes: string) => {
    setCompletedServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, notes }
          : service
      )
    );
  };

  const addAdditionalService = (serviceId: string) => {
    const service = availableServices.find(s => s.id === serviceId);
    if (!service) return;

    const existingService = additionalServices.find(s => s.id === serviceId);
    if (existingService) {
      setAdditionalServices(prev =>
        prev.map(s =>
          s.id === serviceId
            ? { ...s, quantity: s.quantity + 1 }
            : s
        )
      );
    } else {
      setAdditionalServices(prev => [
        ...prev,
        {
          id: service.id,
          name: service.name,
          price: service.price,
          quantity: 1,
        }
      ]);
    }
  };

  const removeAdditionalService = (serviceId: string) => {
    setAdditionalServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const updateAdditionalServiceQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeAdditionalService(serviceId);
      return;
    }

    setAdditionalServices(prev =>
      prev.map(s =>
        s.id === serviceId
          ? { ...s, quantity }
          : s
      )
    );
  };

  const calculateTotal = () => {
    const completedServicesTotal = completedServices
      .filter(s => s.isCompleted)
      .reduce((sum, service) => sum + (service.price * service.quantity), 0);

    const additionalServicesTotal = additionalServices
      .reduce((sum, service) => sum + (service.price * service.quantity), 0);

    const subtotal = completedServicesTotal + additionalServicesTotal;
    
    let discountAmount = 0;
    if (discountType === "percentage") {
      discountAmount = (subtotal * discount) / 100;
    } else {
      discountAmount = discount;
    }

    return {
      subtotal,
      discount: discountAmount,
      total: Math.max(0, subtotal - discountAmount),
      completedServicesTotal,
      additionalServicesTotal,
    };
  };

  const generateBill = async () => {
    setIsGeneratingBill(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const billData = {
      appointmentId: appointment.id,
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      services: completedServices.filter(s => s.isCompleted),
      additionalServices,
      ...calculateTotal(),
      discount: {
        amount: calculateTotal().discount,
        type: discountType,
        value: discount,
      },
      notes,
      generatedAt: new Date().toISOString(),
      status: "pending_payment",
    };

    console.log("Generated bill:", billData);
    
    // Redirect to bill confirmation
    navigate("/provider/bill-sent", { state: { bill: billData } });
    
    setIsGeneratingBill(false);
  };

  const { subtotal, discount: discountAmount, total, completedServicesTotal, additionalServicesTotal } = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Billing</h1>
              <p className="text-gray-600">Mark completed services and generate bill</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Appointment ID</p>
              <p className="font-mono font-medium">#{appointmentId}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{appointment.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="text-sm">{appointment.date}</span>
                      <Clock className="h-3 w-3 ml-2 mr-1" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className="capitalize">{appointment.status.replace("-", " ")}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Original Services */}
            <Card>
              <CardHeader>
                <CardTitle>Booked Services</CardTitle>
                <CardDescription>
                  Mark services as completed and adjust quantities if needed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedServices.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-lg transition-all ${
                        service.isCompleted ? "bg-green-50 border-green-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={service.isCompleted}
                            onCheckedChange={(checked) =>
                              handleServiceCompletion(service.id, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {service.description}
                            </p>
                            <div className="flex items-center space-x-4">
                              <Badge variant="outline" className="text-xs">
                                {service.category}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {service.duration} min
                              </span>
                            </div>
                            {service.isCompleted && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Label className="text-xs">Quantity:</Label>
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleServiceQuantity(service.id, service.quantity - 1)}
                                      disabled={service.quantity <= 1}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="text-sm w-8 text-center">{service.quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleServiceQuantity(service.id, service.quantity + 1)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-xs">Notes (optional):</Label>
                                  <Input
                                    placeholder="Any additional notes about this service..."
                                    value={service.notes || ""}
                                    onChange={(e) => handleServiceNotes(service.id, e.target.value)}
                                    className="mt-1 text-xs"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{service.price}</p>
                          {service.isCompleted && service.quantity > 1 && (
                            <p className="text-sm text-gray-600">
                              ₹{service.price * service.quantity} total
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Services</CardTitle>
                <CardDescription>
                  Add any extra services provided during the appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add Service Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mb-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Additional Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Additional Service</DialogTitle>
                      <DialogDescription>
                        Select from available services to add to the bill
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                      {availableServices.map((service) => (
                        <div
                          key={service.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => addAdditionalService(service.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{service.name}</h4>
                              <Badge variant="outline" className="text-xs mt-1">
                                {service.category}
                              </Badge>
                            </div>
                            <p className="font-medium">₹{service.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Added Services */}
                {additionalServices.length > 0 && (
                  <div className="space-y-3">
                    {additionalServices.map((service) => (
                      <div
                        key={service.id}
                        className="p-3 border rounded-lg bg-blue-50 border-blue-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{service.name}</h4>
                            <div className="flex items-center space-x-2 mt-2">
                              <Label className="text-xs">Quantity:</Label>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateAdditionalServiceQuantity(service.id, service.quantity - 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm w-8 text-center">{service.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateAdditionalServiceQuantity(service.id, service.quantity + 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{service.price * service.quantity}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAdditionalService(service.id)}
                              className="text-red-600 hover:text-red-800 mt-1"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any additional notes or comments for the client..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Bill Summary */}
          <div className="space-y-6">
            {/* Bill Calculation */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Bill Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Original Services */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Completed Services</h4>
                    {completedServices
                      .filter(s => s.isCompleted)
                      .map((service) => (
                        <div key={service.id} className="flex justify-between text-sm">
                          <span>
                            {service.name}
                            {service.quantity > 1 && ` (×${service.quantity})`}
                          </span>
                          <span>₹{service.price * service.quantity}</span>
                        </div>
                      ))}
                    {completedServicesTotal > 0 && (
                      <div className="flex justify-between font-medium text-sm pt-1 border-t">
                        <span>Subtotal</span>
                        <span>₹{completedServicesTotal}</span>
                      </div>
                    )}
                  </div>

                  {/* Additional Services */}
                  {additionalServices.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Additional Services</h4>
                      {additionalServices.map((service) => (
                        <div key={service.id} className="flex justify-between text-sm">
                          <span>
                            {service.name}
                            {service.quantity > 1 && ` (×${service.quantity})`}
                          </span>
                          <span>₹{service.price * service.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium text-sm pt-1 border-t">
                        <span>Additional Total</span>
                        <span>₹{additionalServicesTotal}</span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Discount */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Discount (Optional)</h4>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Select value={discountType} onValueChange={(value: "percentage" | "amount") => setDiscountType(value)}>
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="amount">₹</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="0"
                          value={discount || ""}
                          onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount Applied</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>

                  {/* Generate Bill Button */}
                  <Button
                    className="w-full"
                    onClick={generateBill}
                    disabled={completedServices.filter(s => s.isCompleted).length === 0 || isGeneratingBill}
                  >
                    {isGeneratingBill ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Bill...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Generate & Send Bill
                      </>
                    )}
                  </Button>

                  {completedServices.filter(s => s.isCompleted).length === 0 && (
                    <div className="flex items-center text-orange-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Mark at least one service as completed</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBilling;
