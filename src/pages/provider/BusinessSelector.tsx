import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createBusiness, fetchBusinesses, setCurrentBusiness, type Business } from "@/store/slices/businessSlice";
import { useAuth } from "@/hooks/useAuthRedux";
import { Building2, MapPin, Phone, Mail, Plus } from "lucide-react";

const BusinessSelector = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { businesses, isLoading } = useAppSelector((s) => s.business);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    dispatch(fetchBusinesses(user?.id));
  }, [dispatch, user?.id]);

  const myBusinesses = useMemo(() => {
    return businesses.filter((b) => b.ownerId === user?.id);
  }, [businesses, user?.id]);

  const businessTypes = [
    { value: "spa", label: "Spa & Wellness" },
    { value: "clinic", label: "Medical Clinic" },
    { value: "salon", label: "Beauty Salon" },
    { value: "fitness", label: "Fitness Center" },
    { value: "dental", label: "Dental Clinic" },
    { value: "hospital", label: "Hospital" },
  ];

  const onSelect = (b: Business) => {
    dispatch(setCurrentBusiness(b));
    navigate("/dashboard/business");
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !form.type) return;
    try {
      const created = await dispatch(
        createBusiness({
          name: form.name,
          type: form.type as Business["type"],
          description: form.description,
          address: form.address,
          phone: form.phone,
          email: form.email,
          website: form.website,
          ownerId: user.id,
          amenities: ["WiFi", "Parking"],
        })
      ).unwrap();
      dispatch(setCurrentBusiness(created));
      setIsDialogOpen(false);
      setForm({ name: "", type: "", description: "", address: "", phone: "", email: "", website: "" });
      navigate("/dashboard/business");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Select a Business</h1>
            <p className="text-gray-600 mt-1">Choose a branch to manage or create a new one.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Business
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Business</DialogTitle>
                <DialogDescription>Set up a new branch for your account</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateBusiness} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBusinesses.map((b) => (
              <Card key={b.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(b)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {b.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{b.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{b.type}</Badge>
                    <Badge variant="outline">{b.staffCount} Staff</Badge>
                    <Badge variant="outline">{b.facilityCount} Facilities</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {myBusinesses.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="py-12 flex flex-col items-center justify-center">
                  <Building2 className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No businesses yet. Create your first branch.</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Business
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BusinessSelector;
