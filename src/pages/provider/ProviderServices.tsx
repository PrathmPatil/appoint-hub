import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchServices, updateService } from "@/store/slices/dashboardSlice";
import { useAuth } from "@/hooks/useAuthRedux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Plus,
  Edit,
  Star,
  Clock,
  DollarSign,
  Users,
  Eye,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const ProviderServices = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { services, isLoading } = useAppSelector((state) => state.dashboard);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    availability: true,
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Filter services for current provider
  const myServices = services.filter(
    (service) => service.providerId === user?.id,
  );

  const categories = [
    "Healthcare & Wellness",
    "Beauty & Personal Care",
    "Home Services",
    "Legal & Financial",
    "Real Estate & Property",
    "Education & Coaching",
    "Automotive Services",
    "Business & Corporate",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceData = {
      ...formData,
      price: parseFloat(formData.price),
      providerId: user?.id || "",
      providerName: user?.name || "",
      rating: editingService?.rating || 0,
      reviews: editingService?.reviews || 0,
      id: editingService?.id || `service-${Date.now()}`,
      createdAt: editingService?.createdAt || new Date().toISOString(),
    };

    if (editingService) {
      dispatch(updateService(serviceData));
    } else {
      // In real app, would dispatch addService action
      console.log("Adding new service:", serviceData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      duration: "",
      availability: true,
    });
    setEditingService(null);
  };

  const openEditDialog = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price.toString(),
      duration: service.duration,
      availability: service.availability,
    });
    setIsDialogOpen(true);
  };

  const toggleAvailability = (serviceId: string, availability: boolean) => {
    dispatch(updateService({ id: serviceId, availability }));
  };

  const getServiceStats = () => {
    return {
      total: myServices.length,
      active: myServices.filter((s) => s.availability).length,
      totalRevenue: myServices.reduce((sum, s) => sum + s.price * 10, 0), // Mock calculation
      averageRating:
        myServices.reduce((sum, s) => sum + s.rating, 0) / myServices.length ||
        0,
    };
  };

  const stats = getServiceStats();

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600 mt-2">
              Manage your service offerings and pricing
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Edit Service" : "Add New Service"}
                </DialogTitle>
                <DialogDescription>
                  {editingService
                    ? "Update your service details"
                    : "Create a new service offering"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Professional House Cleaning"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your service..."
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="2 hours"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="availability"
                    checked={formData.availability}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, availability: checked })
                    }
                  />
                  <Label htmlFor="availability">Available for booking</Label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingService ? "Update Service" : "Add Service"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Services
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Services
              </CardTitle>
              <ToggleRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageRating.toFixed(1)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Est. Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myServices.map((service) => (
            <Card
              key={service.id}
              className={!service.availability ? "opacity-60" : ""}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={service.availability}
                      onCheckedChange={(checked) =>
                        toggleAvailability(service.id, checked)
                      }
                      size="sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Badge variant="outline">{service.category}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">₹{service.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">
                      {service.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({service.reviews} reviews)
                    </span>
                  </div>
                  <Badge
                    variant={service.availability ? "default" : "secondary"}
                    className={service.availability ? "bg-green-600" : ""}
                  >
                    {service.availability ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Performance</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>~{Math.floor(service.reviews / 2)} bookings</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {myServices.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No services yet
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Start by adding your first service offering to attract
                customers.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProviderServices;
