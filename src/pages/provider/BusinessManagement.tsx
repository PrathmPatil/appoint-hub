import { useEffect, useMemo, useState } from "react";
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
  fetchBusinessBookings,
  createBusiness,
  updateBusiness,
  addStaffMember,
  addFacility,
  updateBookingStatus,
  type Business,
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
  Calendar,
  Phone,
  Mail,
  Globe,
  CheckCircle,
} from "lucide-react";

const BusinessManagement = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { currentBusiness, businesses, staff, facilities, businessBookings, isLoading } = useAppSelector(
    (state) => state.business,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    name: "",
    type: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    type: "",
  });

  const [hoursDraft, setHoursDraft] = useState<any | null>(null);

  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "therapist",
    experience: 1,
    specialties: "",
  });

  const [facilityForm, setFacilityForm] = useState({
    name: "",
    type: "room",
    capacity: 1,
    amenities: "",
  });

  useEffect(() => {
    dispatch(fetchBusinesses(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (currentBusiness?.id) {
      dispatch(fetchStaff(currentBusiness.id));
      dispatch(fetchFacilities(currentBusiness.id));
      dispatch(fetchBusinessBookings(currentBusiness.id));
      setEditForm({
        name: currentBusiness.name,
        description: currentBusiness.description,
        address: currentBusiness.address,
        phone: currentBusiness.phone,
        email: currentBusiness.email,
        website: currentBusiness.website || "",
        type: currentBusiness.type,
      });
      setHoursDraft(currentBusiness.operatingHours);
    }
  }, [currentBusiness?.id, dispatch]);

  const myStaff = staff.filter((s) => s.businessId === currentBusiness?.id);
  const myFacilities = facilities.filter((f) => f.businessId === currentBusiness?.id);
  const myBookings = businessBookings.filter((b) => b.businessId === currentBusiness?.id);

  const businessTypes = [
    { value: "spa", label: "Spa & Wellness" },
    { value: "clinic", label: "Medical Clinic" },
    { value: "salon", label: "Beauty Salon" },
    { value: "fitness", label: "Fitness Center" },
    { value: "dental", label: "Dental Clinic" },
    { value: "hospital", label: "Hospital" },
  ];

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await dispatch(
        createBusiness({
          name: businessForm.name,
          type: businessForm.type as "spa" | "clinic" | "salon" | "fitness" | "dental" | "hospital",
          description: businessForm.description,
          address: businessForm.address,
          phone: businessForm.phone,
          email: businessForm.email,
          website: businessForm.website,
          ownerId: user.id,
          amenities: ["WiFi", "Parking"],
        })
      ).unwrap();

      setBusinessForm({
        name: "",
        type: "",
        description: "",
        address: "",
        phone: "",
        email: "",
        website: "",
      });
      setIsBusinessDialogOpen(false);
    } catch (error) {
      console.error("Failed to create business:", error);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
            <p className="text-gray-600 mt-2">
              {currentBusiness ? "Manage your business operations" : "Select or create a business to get started"}
            </p>
          </div>
          {!currentBusiness && (
            <Dialog open={isBusinessDialogOpen} onOpenChange={setIsBusinessDialogOpen}>
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
                        onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                        placeholder="e.g., Serenity Spa"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Business Type</Label>
                      <Select value={businessForm.type} onValueChange={(value) => setBusinessForm({ ...businessForm, type: value })}>
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
                      onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                      placeholder="Describe your business..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={businessForm.address}
                      onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
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
                        onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
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
                        onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
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
                      onChange={(e) => setBusinessForm({ ...businessForm, website: e.target.value })}
                      placeholder="https://yourbusiness.com"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsBusinessDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Business</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {currentBusiness ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staff">Staff ({myStaff.length})</TabsTrigger>
              <TabsTrigger value="facilities">Facilities ({myFacilities.length})</TabsTrigger>
              <TabsTrigger value="bookings">Bookings ({myBookings.length})</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {currentBusiness.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>{currentBusiness.type}</Badge>
                      {currentBusiness.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Business</DialogTitle>
                        <DialogDescription>Update your business details</DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!currentBusiness) return;
                          dispatch(
                            updateBusiness({
                              id: currentBusiness.id,
                              name: editForm.name,
                              description: editForm.description,
                              address: editForm.address,
                              phone: editForm.phone,
                              email: editForm.email,
                              website: editForm.website,
                              type: editForm.type as Business["type"],
                            })
                          );
                          setIsEditDialogOpen(false);
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ename">Name</Label>
                            <Input id="ename" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                          </div>
                          <div>
                            <Label htmlFor="etype">Type</Label>
                            <Select value={editForm.type} onValueChange={(v) => setEditForm({ ...editForm, type: v })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {businessTypes.map((t) => (
                                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="edesc">Description</Label>
                          <Textarea id="edesc" rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="eaddr">Address</Label>
                          <Input id="eaddr" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ephone">Phone</Label>
                            <Input id="ephone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                          </div>
                          <div>
                            <Label htmlFor="eemail">Email</Label>
                            <Input id="eemail" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="eweb">Website</Label>
                          <Input id="eweb" value={editForm.website} onChange={(e) => setEditForm({ ...editForm, website: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                          <Button type="submit">Save</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{currentBusiness.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{currentBusiness.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{currentBusiness.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{currentBusiness.email}</span>
                    </div>
                    {currentBusiness.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{currentBusiness.website}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{getOperatingHoursDisplay(currentBusiness.operatingHours)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{currentBusiness.rating.toFixed(1)} rating</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentBusiness.staffCount}</div>
                    <p className="text-xs text-muted-foreground">{myStaff.filter((s) => s.isActive).length} active</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Facilities</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentBusiness.facilityCount}</div>
                    <p className="text-xs text-muted-foreground">{myFacilities.filter((f) => f.isActive).length} active</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentBusiness.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">{myBookings.length} recent</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rating</CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentBusiness.rating.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Average rating</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Operating Hours
                  </CardTitle>
                  <Dialog open={isHoursDialogOpen} onOpenChange={setIsHoursDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Edit Hours</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Operating Hours</DialogTitle>
                        <DialogDescription>Set daily hours and breaks</DialogDescription>
                      </DialogHeader>
                      {hoursDraft && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!currentBusiness) return;
                            dispatch(updateBusiness({ id: currentBusiness.id, operatingHours: hoursDraft }));
                            setIsHoursDialogOpen(false);
                          }}
                          className="space-y-4"
                        >
                          {Object.entries(hoursDraft).map(([day, hours]: any) => (
                            <div key={day} className="border rounded p-3">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="w-24 capitalize font-medium">{day}</span>
                                <div className="flex items-center gap-2">
                                  <Label className="text-sm">Open</Label>
                                  <Switch checked={!!hours.isOpen} onCheckedChange={(v) => setHoursDraft({ ...hoursDraft, [day]: { ...hours, isOpen: v } })} />
                                </div>
                                <Input type="time" value={hours.start} onChange={(e) => setHoursDraft({ ...hoursDraft, [day]: { ...hours, start: e.target.value } })} className="w-32" />
                                <span className="text-sm">to</span>
                                <Input type="time" value={hours.end} onChange={(e) => setHoursDraft({ ...hoursDraft, [day]: { ...hours, end: e.target.value } })} className="w-32" />
                              </div>
                              <div className="ml-24">
                                <Label className="text-sm">Breaks</Label>
                                <div className="space-y-2 mt-1">
                                  {(hours.breaks || []).map((br: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <Input type="time" value={br.start} onChange={(e) => {
                                        const next = [...(hours.breaks || [])];
                                        next[idx] = { ...next[idx], start: e.target.value };
                                        setHoursDraft({ ...hoursDraft, [day]: { ...hours, breaks: next } });
                                      }} className="w-28" />
                                      <span className="text-sm">to</span>
                                      <Input type="time" value={br.end} onChange={(e) => {
                                        const next = [...(hours.breaks || [])];
                                        next[idx] = { ...next[idx], end: e.target.value };
                                        setHoursDraft({ ...hoursDraft, [day]: { ...hours, breaks: next } });
                                      }} className="w-28" />
                                      <Button type="button" variant="ghost" size="sm" onClick={() => {
                                        const next = (hours.breaks || []).filter((_: any, i: number) => i !== idx);
                                        setHoursDraft({ ...hoursDraft, [day]: { ...hours, breaks: next } });
                                      }}>Remove</Button>
                                    </div>
                                  ))}
                                  <Button type="button" variant="outline" size="sm" onClick={() => {
                                    const next = [...(hours.breaks || []), { start: "13:00", end: "14:00" }];
                                    setHoursDraft({ ...hoursDraft, [day]: { ...hours, breaks: next } });
                                  }}>Add Break</Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsHoursDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Hours</Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(currentBusiness.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium capitalize">{day}</span>
                        <div className="flex items-center gap-2">
                          {hours.isOpen ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-green-600">{hours.start} - {hours.end}</span>
                              {Array.isArray((hours as any).breaks) && (hours as any).breaks.length > 0 && (
                                <span className="text-xs text-gray-600">• Breaks: {(hours as any).breaks.map((b: any) => `${b.start}-${b.end}`).join(", ")}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-red-600">Closed</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Staff Management</h2>
                <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Staff Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Staff Member</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!currentBusiness) return;
                        const payload = {
                          id: `staff-${Date.now()}`,
                          name: staffForm.name,
                          email: staffForm.email,
                          phone: staffForm.phone,
                          role: staffForm.role,
                          specialties: staffForm.specialties.split(",").map((s) => s.trim()).filter(Boolean),
                          experience: Number(staffForm.experience),
                          rating: 0,
                          businessId: currentBusiness.id,
                          isActive: true,
                          workingHours: {
                            monday: { start: "09:00", end: "17:00", isWorking: true },
                            tuesday: { start: "09:00", end: "17:00", isWorking: true },
                            wednesday: { start: "09:00", end: "17:00", isWorking: true },
                            thursday: { start: "09:00", end: "17:00", isWorking: true },
                            friday: { start: "09:00", end: "17:00", isWorking: true },
                            saturday: { start: "10:00", end: "16:00", isWorking: true },
                            sunday: { start: "10:00", end: "14:00", isWorking: false },
                          },
                          bookedSlots: [],
                          createdAt: new Date().toISOString(),
                        } as const;
                        dispatch(addStaffMember(payload));
                        setIsAddStaffOpen(false);
                        setStaffForm({ name: "", email: "", phone: "", role: "therapist", experience: 1, specialties: "" });
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} required />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Select value={staffForm.role} onValueChange={(v) => setStaffForm({ ...staffForm, role: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["manager","therapist","doctor","stylist","technician","aesthetician"].map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Email</Label>
                          <Input type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} required />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input value={staffForm.phone} onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Experience (years)</Label>
                          <Input type="number" min={0} value={staffForm.experience} onChange={(e) => setStaffForm({ ...staffForm, experience: Number(e.target.value) })} />
                        </div>
                        <div>
                          <Label>Specialties (comma separated)</Label>
                          <Input value={staffForm.specialties} onChange={(e) => setStaffForm({ ...staffForm, specialties: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddStaffOpen(false)}>Cancel</Button>
                        <Button type="submit">Add</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myStaff.map((staffMember) => (
                  <Card key={staffMember.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {staffMember.avatar && (
                            <img src={staffMember.avatar} alt={staffMember.name} className="w-12 h-12 rounded-full" />
                          )}
                          <div>
                            <CardTitle className="text-lg">{staffMember.name}</CardTitle>
                            <p className="text-sm text-gray-600 capitalize">{staffMember.role}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{staffMember.email}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={staffMember.isActive ? "default" : "secondary"}>
                          {staffMember.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Experience</span>
                        <span className="text-sm font-medium">{staffMember.experience} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">{staffMember.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Phone</span>
                        <span className="text-sm font-medium">{staffMember.phone}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Specialties</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {staffMember.specialties.slice(0, 2).map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">{specialty}</Badge>
                          ))}
                          {staffMember.specialties.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{staffMember.specialties.length - 2}</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="facilities" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Facility Management</h2>
                <Dialog open={isAddFacilityOpen} onOpenChange={setIsAddFacilityOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Facility
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Facility</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!currentBusiness) return;
                        const payload = {
                          id: `facility-${Date.now()}`,
                          name: facilityForm.name,
                          type: facilityForm.type as any,
                          businessId: currentBusiness.id,
                          capacity: Number(facilityForm.capacity),
                          amenities: facilityForm.amenities.split(",").map((s) => s.trim()).filter(Boolean),
                          isActive: true,
                          bookings: [],
                          createdAt: new Date().toISOString(),
                        } as const;
                        dispatch(addFacility(payload));
                        setIsAddFacilityOpen(false);
                        setFacilityForm({ name: "", type: "room", capacity: 1, amenities: "" });
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input value={facilityForm.name} onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })} required />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select value={facilityForm.type} onValueChange={(v) => setFacilityForm({ ...facilityForm, type: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(["room","equipment","area"] as const).map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Capacity</Label>
                          <Input type="number" min={1} value={facilityForm.capacity} onChange={(e) => setFacilityForm({ ...facilityForm, capacity: Number(e.target.value) })} />
                        </div>
                        <div>
                          <Label>Amenities (comma separated)</Label>
                          <Input value={facilityForm.amenities} onChange={(e) => setFacilityForm({ ...facilityForm, amenities: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddFacilityOpen(false)}>Cancel</Button>
                        <Button type="submit">Add</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myFacilities.map((facility) => (
                  <Card key={facility.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{facility.name}</CardTitle>
                          <p className="text-sm text-gray-600 capitalize">{facility.type}</p>
                        </div>
                        <Badge variant={facility.isActive ? "default" : "secondary"}>
                          {facility.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Capacity</span>
                        <span className="text-sm font-medium">{facility.capacity} person(s)</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Amenities</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {facility.amenities.slice(0, 3).map((amenity) => (
                            <Badge key={amenity} variant="outline" className="text-xs">{amenity}</Badge>
                          ))}
                          {facility.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{facility.amenities.length - 3}</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Business Bookings</h2>
                <div className="flex gap-2">
                  <Badge variant="outline">{myBookings.filter((b) => b.status === "pending").length} Pending</Badge>
                  <Badge variant="default">{myBookings.filter((b) => b.status === "confirmed").length} Confirmed</Badge>
                </div>
              </div>

              <div className="space-y-4">
                {myBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{booking.userName}</h4>
                            <Badge
                              variant={
                                booking.status === "confirmed"
                                  ? "default"
                                  : booking.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-gray-600 font-medium">Service</p>
                              <p>{booking.serviceName}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">Staff</p>
                              <p>{booking.staffName}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">Facility</p>
                              <p>{booking.facilityName}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-gray-600 font-medium">Date & Time</p>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {booking.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {booking.startTime} - {booking.endTime}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">Duration</p>
                              <p>{booking.duration} minutes</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">Amount</p>
                              <p className="text-lg font-semibold text-green-600">₹{booking.amount}</p>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="mb-4">
                              <p className="text-gray-600 font-medium mb-1">Notes</p>
                              <p className="text-sm bg-gray-50 p-2 rounded">{booking.notes}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={booking.paymentStatus === "completed" ? "default" : "secondary"} className={booking.paymentStatus === "completed" ? "bg-green-600" : ""}>
                                Payment: {booking.paymentStatus}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => {
                                if (booking.customerPhone) {
                                  window.location.href = `tel:${booking.customerPhone}`;
                                } else if (booking.customerEmail) {
                                  window.location.href = `mailto:${booking.customerEmail}`;
                                }
                              }}>
                                <Phone className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                              {booking.status === "pending" && (
                                <Button size="sm" onClick={() => dispatch(updateBookingStatus({ id: booking.id, status: "confirmed" }))}>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirm
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {myBookings.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No Bookings Yet</h3>
                      <p className="text-gray-500 text-center mb-6">When customers book your services, they will appear here.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-bold">Business Settings</h2>

              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Accept Online Bookings</Label>
                      <p className="text-sm text-gray-600">Allow customers to book appointments online</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Automatic Confirmation</Label>
                      <p className="text-sm text-gray-600">Automatically confirm bookings</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Send SMS reminders to customers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Business Selected</h3>
              <p className="text-gray-500 text-center mb-6">Go to Dashboard to select or create a business branch to manage.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BusinessManagement;
