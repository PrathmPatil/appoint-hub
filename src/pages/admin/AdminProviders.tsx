import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, fetchServices } from "@/store/slices/dashboardSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Star,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Shield,
  Ban,
  CheckCircle,
  Briefcase,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminProviders = () => {
  const dispatch = useAppDispatch();
  const { users, services, isLoading } = useAppSelector(
    (state) => state.dashboard,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchServices());
  }, [dispatch]);

  const providers = users.filter((user) => user.role === "service_provider");

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && provider.verified) ||
      (statusFilter === "unverified" && !provider.verified);
    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "high" && provider.rating && provider.rating >= 4.5) ||
      (ratingFilter === "medium" &&
        provider.rating &&
        provider.rating >= 3.5 &&
        provider.rating < 4.5) ||
      (ratingFilter === "low" && provider.rating && provider.rating < 3.5);

    return matchesSearch && matchesStatus && matchesRating;
  });

  const getProviderStats = () => {
    return {
      total: providers.length,
      verified: providers.filter((p) => p.verified).length,
      unverified: providers.filter((p) => !p.verified).length,
      highRated: providers.filter((p) => p.rating && p.rating >= 4.5).length,
      totalServices: services.length,
      averageRating:
        providers.reduce((sum, p) => sum + (p.rating || 0), 0) /
        providers.length,
    };
  };

  const stats = getProviderStats();

  const getProviderServices = (providerId: string) => {
    return services.filter((service) => service.providerId === providerId);
  };

  const handleProviderAction = (providerId: string, action: string) => {
    console.log(`${action} provider:`, providerId);
    // In real app, dispatch action to update provider
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Service Providers
          </h1>
          <p className="text-gray-600 mt-2">
            Manage service providers and their offerings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Providers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.verified}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Rated</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.highRated}
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
                Total Services
              </CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Shield className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.unverified}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search providers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="high">4.5+ Stars</SelectItem>
                  <SelectItem value="medium">3.5-4.4 Stars</SelectItem>
                  <SelectItem value="low">Below 3.5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Providers Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Service Providers ({filteredProviders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => {
                  const providerServices = getProviderServices(provider.id);
                  return (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {provider.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {provider.email}
                            </div>
                            {provider.phone && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {provider.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {provider.rating ? (
                            <Badge
                              variant="outline"
                              className={
                                provider.rating >= 4.5
                                  ? "text-green-600 border-green-600"
                                  : provider.rating >= 3.5
                                    ? "text-yellow-600 border-yellow-600"
                                    : "text-red-600 border-red-600"
                              }
                            >
                              <Star className="h-3 w-3 mr-1" />
                              {provider.rating.toFixed(1)}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600">
                              No Rating
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {provider.verified ? (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-orange-600 border-orange-600"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {providerServices.length}
                          </span>
                          <Badge variant="outline">
                            <Briefcase className="h-3 w-3 mr-1" />
                            Services
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {provider.totalBookings}
                          </span>
                          <Badge variant="outline">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Total
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(provider.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleProviderAction(provider.id, "view")
                              }
                            >
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleProviderAction(provider.id, "services")
                              }
                            >
                              <Briefcase className="h-4 w-4 mr-2" />
                              View Services
                            </DropdownMenuItem>
                            {!provider.verified && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleProviderAction(provider.id, "verify")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Verify Provider
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                handleProviderAction(provider.id, "message")
                              }
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleProviderAction(provider.id, "suspend")
                              }
                              className="text-red-600"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend Provider
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Performing Providers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers
                .filter((p) => p.rating && p.rating >= 4.5)
                .slice(0, 6)
                .map((provider) => {
                  const providerServices = getProviderServices(provider.id);
                  return (
                    <div key={provider.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar>
                          <AvatarFallback>
                            {provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="flex items-center gap-1 text-sm text-yellow-600">
                            <Star className="h-3 w-3" />
                            {provider.rating?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Services:</span>
                          <span className="font-medium">
                            {providerServices.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bookings:</span>
                          <span className="font-medium">
                            {provider.totalBookings}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge
                            variant="outline"
                            className={
                              provider.verified
                                ? "text-green-600 border-green-600"
                                : "text-orange-600 border-orange-600"
                            }
                          >
                            {provider.verified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminProviders;
