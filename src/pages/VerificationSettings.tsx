import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  Star,
  TrendingUp,
  FileText,
  Award,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import VerificationUpload from "@/components/verification/VerificationUpload";
import { Link } from "react-router-dom";

interface VerificationDocument {
  id: string;
  type: 'professional_license' | 'business_license' | 'drivers_license' | 'passport';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  submittedAt: string;
  reviewedAt?: string;
  expiryDate: string;
  documentNumber: string;
  rejectionReason?: string;
}

interface TrustMetrics {
  verificationLevel: 'unverified' | 'basic' | 'verified' | 'premium';
  trustScore: number;
  totalBookings: number;
  avgRating: number;
  responseRate: number;
  completionRate: number;
  reviewCount: number;
}

const VerificationSettings: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [showUpload, setShowUpload] = useState(false);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [trustMetrics, setTrustMetrics] = useState<TrustMetrics | null>(null);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setDocuments([
        {
          id: 'doc-1',
          type: 'professional_license',
          status: 'approved',
          submittedAt: '2024-01-15T10:00:00Z',
          reviewedAt: '2024-01-16T14:30:00Z',
          expiryDate: '2025-12-31',
          documentNumber: 'MD123456789',
        },
        {
          id: 'doc-2',
          type: 'business_license',
          status: 'pending',
          submittedAt: '2024-01-20T09:15:00Z',
          expiryDate: '2025-06-30',
          documentNumber: 'BL987654321',
        },
      ]);

      setTrustMetrics({
        verificationLevel: 'verified',
        trustScore: 8.7,
        totalBookings: 156,
        avgRating: 4.8,
        responseRate: 95,
        completionRate: 98,
        reviewCount: 89,
      });
    }, 1000);
  }, []);

  const handleVerificationComplete = (data: any) => {
    // Add new document to list
    const newDocument: VerificationDocument = {
      id: `doc-${Date.now()}`,
      type: data.documentType,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      expiryDate: data.expiryDate,
      documentNumber: data.documentNumber,
    };

    setDocuments(prev => [...prev, newDocument]);
    setShowUpload(false);
  };

  const getStatusIcon = (status: VerificationDocument['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: VerificationDocument['status']) => {
    const variants = {
      approved: 'default',
      pending: 'secondary',
      rejected: 'destructive',
      expired: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getVerificationBadge = (level: TrustMetrics['verificationLevel']) => {
    const config = {
      unverified: { color: 'bg-gray-100 text-gray-700', icon: Shield, text: 'Unverified' },
      basic: { color: 'bg-blue-100 text-blue-700', icon: Shield, text: 'Basic Verified' },
      verified: { color: 'bg-green-100 text-green-700', icon: Award, text: 'Verified Professional' },
      premium: { color: 'bg-purple-100 text-purple-700', icon: Star, text: 'Premium Verified' },
    };

    const { color, icon: Icon, text } = config[level];

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${color}`}>
        <Icon className="h-4 w-4" />
        <span className="font-medium">{text}</span>
      </div>
    );
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showUpload) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setShowUpload(false)}>
            ← Back to Verification Settings
          </Button>
        </div>
        <VerificationUpload onComplete={handleVerificationComplete} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verification & Trust</h1>
        <p className="text-gray-600 mt-2">
          Build trust with clients by verifying your credentials and improving your trust score
        </p>
      </div>

      {/* Current Status Overview */}
      {trustMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Trust Profile
              {getVerificationBadge(trustMetrics.verificationLevel)}
            </CardTitle>
            <CardDescription>
              Your current verification status and trust metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Trust Score */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className={`text-3xl font-bold ${getTrustScoreColor(trustMetrics.trustScore)}`}>
                    {trustMetrics.trustScore}
                  </div>
                  <span className="text-gray-500 ml-1">/10</span>
                </div>
                <p className="text-sm text-gray-600">Trust Score</p>
                <Progress 
                  value={trustMetrics.trustScore * 10} 
                  className="mt-2 h-2"
                />
              </div>

              {/* Total Bookings */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-2xl font-bold">{trustMetrics.totalBookings}</span>
                </div>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>

              {/* Average Rating */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold">{trustMetrics.avgRating}</span>
                  <span className="text-gray-500 ml-1">/5</span>
                </div>
                <p className="text-sm text-gray-600">Avg Rating ({trustMetrics.reviewCount} reviews)</p>
              </div>

              {/* Completion Rate */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-2xl font-bold">{trustMetrics.completionRate}%</span>
                </div>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Trust Score Breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold">Trust Score Factors</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verification Status</span>
                  <div className="flex items-center gap-2">
                    <Progress value={90} className="w-20 h-2" />
                    <span className="text-sm font-medium">90%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Response Rate</span>
                  <div className="flex items-center gap-2">
                    <Progress value={trustMetrics.responseRate} className="w-20 h-2" />
                    <span className="text-sm font-medium">{trustMetrics.responseRate}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Client Reviews</span>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="w-20 h-2" />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Booking History</span>
                  <div className="flex items-center gap-2">
                    <Progress value={92} className="w-20 h-2" />
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Verification Documents</CardTitle>
              <CardDescription>
                Upload and manage your professional credentials
              </CardDescription>
            </div>
            <Button onClick={() => setShowUpload(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents uploaded</h3>
              <p className="text-gray-600 mb-4">
                Upload your professional credentials to build trust with clients
              </p>
              <Button onClick={() => setShowUpload(true)}>
                Upload First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <h4 className="font-medium">
                        {doc.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Document #{doc.documentNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted {new Date(doc.submittedAt).toLocaleDateString()}
                        {doc.reviewedAt && ` • Reviewed ${new Date(doc.reviewedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(doc.status)}
                    <p className="text-xs text-gray-500 mt-1">
                      Expires {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits of Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits of Verification</CardTitle>
          <CardDescription>
            Why verified providers get more bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Increased Trust</h4>
                <p className="text-sm text-gray-600">
                  Verified providers get 3x more bookings than unverified ones
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Higher Rankings</h4>
                <p className="text-sm text-gray-600">
                  Appear higher in search results and recommendations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Premium Features</h4>
                <p className="text-sm text-gray-600">
                  Access to advanced scheduling and business tools
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium">Better Rates</h4>
                <p className="text-sm text-gray-600">
                  Command higher prices as a trusted professional
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Need Help with Verification?</h4>
              <p className="text-sm text-gray-600">
                Contact our support team for assistance with document upload or verification
              </p>
            </div>
            <Link to="/help">
              <Button variant="outline">
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationSettings;
