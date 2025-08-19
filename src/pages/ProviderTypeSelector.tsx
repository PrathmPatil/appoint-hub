import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuthRedux";
import { useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import {
  User,
  Building2,
  Users,
  Calendar,
  CreditCard,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const ProviderTypeSelector = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [selectedType, setSelectedType] = useState<"individual" | "business">(
    "individual",
  );

  const handleTypeSelection = (type: "individual" | "business") => {
    if (user) {
      dispatch(updateUser({ providerType: type }));
      // Redirect to appropriate dashboard
      window.location.href =
        type === "business" ? "/dashboard/business" : "/dashboard/services";
    }
  };

  const providerTypes = [
    {
      id: "individual",
      title: "Individual Provider",
      description: "I provide services independently",
      icon: User,
      features: [
        "Personal service profile",
        "Direct client bookings",
        "Simple scheduling",
        "Individual earnings tracking",
        "Personal rating & reviews",
      ],
      examples: "Freelance therapist, independent consultant, personal trainer",
      color: "border-blue-500 bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "business",
      title: "Business Owner",
      description: "I run a business with multiple staff and facilities",
      icon: Building2,
      features: [
        "Business profile management",
        "Multiple staff members",
        "Facility & room management",
        "Advanced scheduling system",
        "Business analytics & reporting",
      ],
      examples: "Spa, clinic, salon, fitness center, dental practice",
      color: "border-green-500 bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to AppointHub!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Let's set up your provider profile
          </p>
          <p className="text-gray-500">
            Choose the option that best describes your service delivery model
          </p>
        </div>

        {/* Provider Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {providerTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? type.color : "hover:border-gray-300"
                }`}
                onClick={() =>
                  setSelectedType(type.id as "individual" | "business")
                }
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      isSelected ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 ${
                        isSelected
                          ? type.id === "individual"
                            ? "text-blue-600"
                            : "text-green-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-xl mb-2">{type.title}</CardTitle>
                  <p className="text-gray-600">{type.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Features List */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      What you get:
                    </h4>
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Perfect for:
                    </h4>
                    <p className="text-sm text-gray-600">{type.examples}</p>
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`w-full mt-6 ${type.buttonColor}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTypeSelection(type.id as "individual" | "business");
                    }}
                    disabled={!isSelected}
                  >
                    {isSelected ? (
                      <>
                        Choose {type.title}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      `Select ${type.title}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium text-gray-900 mb-2">
              Don't worry, you can change this later
            </h3>
            <p className="text-sm text-gray-600">
              You can switch between individual and business modes anytime from
              your dashboard settings.
            </p>
          </CardContent>
        </Card>

        {/* Demo Accounts Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <Badge className="bg-blue-600">Demo</Badge>
              Test Different Provider Types
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">
                  Individual Provider:
                </h4>
                <p className="text-blue-700">
                  <strong>Email:</strong> provider@example.com
                  <br />
                  <strong>Password:</strong> provider123
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">Business Owner:</h4>
                <p className="text-blue-700">
                  <strong>Email:</strong> business@example.com
                  <br />
                  <strong>Password:</strong> business123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProviderTypeSelector;
