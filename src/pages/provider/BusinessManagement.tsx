import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/hooks/useAuthRedux";
import {
  fetchBusinesses,
  fetchStaff,
  fetchFacilities,
  setCurrentBusiness,
} from "@/store/slices/businessSlice";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  Users,
  MapPin,
  Clock,
  Star,
  Plus,
  Edit,
  Settings,
  Calendar,
  Phone,
  Mail,
  Globe,
  Camera,
  CheckCircle,
} from "lucide-react";

const BusinessManagement = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { businesses, staff, facilities, isLoading } = useAppSelector(
    (state) => state.business,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    name: "",
    type: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  // Get current user's business
  const myBusiness = businesses.find((b) => b.ownerId === user?.id);

  useEffect(() => {
    if (myBusiness) {
      dispatch(setCurrentBusiness(myBusiness));
      dispatch(fetchStaff(myBusiness.id));
      dispatch(fetchFacilities(myBusiness.id));
    }
  }, [myBusiness, dispatch]);

  const myStaff = staff.filter((s) => s.businessId === myBusiness?.id);
  const myFacilities = facilities.filter(
    (f) => f.businessId === myBusiness?.id,
  );

  const businessTypes = [
    { value: "spa", label: "Spa & Wellness" },
    { value: "clinic", label: "Medical Clinic" },
    { value: "salon", label: "Beauty Salon" },
    { value: "fitness", label: "Fitness Center" },
    { value: "dental", label: "Dental Clinic" },
    { value: "hospital", label: "Hospital" },
  ];

  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating business:", businessForm);
    // In real app, dispatch action to create business
    setIsBusinessDialogOpen(false);
  };

  const getOperatingHoursDisplay = (operatingHours: any) => {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const openDays = days.filter((day) => operatingHours[day]?.isOpen);
    return `${openDays.length} days/week`;
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Business Management
            </h1>
            <p className="text-gray-600 mt-2">
              {myBusiness
                ? "Manage your business operations"
                : "Set up your business profile"}
            </p>
          </div>
          {!myBusiness && (
            <Dialog
              open={isBusinessDialogOpen}
              onOpenChange={setIsBusinessDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Building2 className="h-4 w-4 mr-2" />
                  Create Business
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Your Business</DialogTitle>
                  <DialogDescription>
                    Set up your business profile to start accepting bookings
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateBusiness} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Business Name</Label>
                      <Input
                        id="name"
                        value={businessForm.name}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., Serenity Spa"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Business Type</Label>
                      <Select
                        value={businessForm.type}
                        onValueChange={(value) =>
                          setBusinessForm({ ...businessForm, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={businessForm.description}
                      onChange={(e) =>
                        setBusinessForm({
                          ...businessForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your business..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={businessForm.address}
                      onChange={(e) =>
                        setBusinessForm({
                          ...businessForm,
                          address: e.target.value,
                        })
                      }
                      placeholder="Full business address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={businessForm.phone}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessForm.email}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="contact@business.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={businessForm.website}
                      onChange={(e) =>
                        setBusinessForm({
                          ...businessForm,
                          website: e.target.value,
                        })
                      }
                      placeholder="https://yourbusiness.com"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsBusinessDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Business</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {myBusiness ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staff">Staff ({myStaff.length})</TabsTrigger>
              <TabsTrigger value="facilities">
                Facilities ({myFacilities.length})
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Business Info Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {myBusiness.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>{myBusiness.type}</Badge>
                      {myBusiness.verified && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{myBusiness.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{myBusiness.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{myBusiness.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{myBusiness.email}</span>
                    </div>
                    {myBusiness.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{myBusiness.website}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {getOperatingHoursDisplay(myBusiness.operatingHours)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        {myBusiness.rating.toFixed(1)} rating
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Staff
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {myBusiness.staffCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {myStaff.filter((s) => s.isActive).length} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Facilities
                    </CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {myBusiness.facilityCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {myFacilities.filter((f) => f.isActive).length} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Bookings
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {myBusiness.totalBookings}
                    </div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Rating
                    </CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {myBusiness.rating.toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average rating
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Operating Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(myBusiness.operatingHours).map(
                      ([day, hours]) => (
                        <div
                          key={day}
                          className="flex justify-between items-center p-3 border rounded-lg"
                        >
                          <span className="font-medium capitalize">{day}</span>
                          <div className="flex items-center gap-2">
                            {hours.isOpen ? (
                              <span className="text-sm text-green-600">
                                {hours.start} - {hours.end}
                              </span>
                            ) : (
                              <span className="text-sm text-red-600">
                                Closed
                              </span>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Staff Tab */}
            <TabsContent value="staff" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Staff Management</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myStaff.map((staffMember) => (
                  <Card key={staffMember.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {staffMember.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 capitalize">
                            {staffMember.role}
                          </p>
                        </div>
                        <Badge
                          variant={
                            staffMember.isActive ? "default" : "secondary"
                          }
                        >
                          {staffMember.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Experience
                        </span>
                        <span className="text-sm font-medium">
                          {staffMember.experience} years
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">
                            {staffMember.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Specialties
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {staffMember.specialties
                            .slice(0, 2)
                            .map((specialty) => (
                              <Badge
                                key={specialty}
                                variant="outline"
                                className="text-xs"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          {staffMember.specialties.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{staffMember.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Facilities Tab */}
            <TabsContent value="facilities" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Facility Management</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Facility
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myFacilities.map((facility) => (
                  <Card key={facility.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {facility.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 capitalize">
                            {facility.type}
                          </p>
                        </div>
                        <Badge
                          variant={facility.isActive ? "default" : "secondary"}
                        >
                          {facility.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Capacity</span>
                        <span className="text-sm font-medium">
                          {facility.capacity} person(s)
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Amenities</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {facility.amenities.slice(0, 3).map((amenity) => (
                            <Badge
                              key={amenity}
                              variant="outline"
                              className="text-xs"
                            >
                              {amenity}
                            </Badge>
                          ))}
                          {facility.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{facility.amenities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-bold">Business Settings</h2>

              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">
                        Accept Online Bookings
                      </Label>
                      <p className="text-sm text-gray-600">
                        Allow customers to book appointments online
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">
                        Automatic Confirmation
                      </Label>
                      <p className="text-sm text-gray-600">
                        Automatically confirm bookings
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Send SMS reminders to customers
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          // No Business Created Yet
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Business Profile
              </h3>
              <p className="text-gray-500 text-center mb-6">
                Create your business profile to start managing staff,
                facilities, and accepting bookings.
              </p>
              <Button onClick={() => setIsBusinessDialogOpen(true)}>
                <Building2 className="h-4 w-4 mr-2" />
                Create Your Business
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BusinessManagement;
