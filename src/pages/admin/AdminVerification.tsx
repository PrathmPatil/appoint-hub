import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  X,
  Eye,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Building2,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

interface VerificationSubmission {
  id: string;
  providerId: string;
  providerName: string;
  providerType: 'individual' | 'business';
  documentType: 'professional_license' | 'business_license' | 'drivers_license' | 'passport';
  documentNumber: string;
  fullName: string;
  issuingAuthority: string;
  expiryDate: string;
  fileUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  confidence: number; // OCR confidence score
  extractedData: {
    fullName?: string;
    documentNumber?: string;
    expiryDate?: string;
    issuingAuthority?: string;
  };
}

const AdminVerification: React.FC = () => {
  const [submissions, setSubmissions] = useState<VerificationSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<VerificationSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<VerificationSubmission | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockSubmissions: VerificationSubmission[] = [
      {
        id: 'sub-1',
        providerId: 'provider-1',
        providerName: 'Dr. Sarah Johnson',
        providerType: 'individual',
        documentType: 'professional_license',
        documentNumber: 'MD123456789',
        fullName: 'Dr. Sarah Johnson',
        issuingAuthority: 'Medical Board of California',
        expiryDate: '2025-12-31',
        fileUrl: 'https://example.com/doc1.pdf',
        submittedAt: '2024-01-20T10:30:00Z',
        status: 'pending',
        confidence: 0.95,
        extractedData: {
          fullName: 'Dr. Sarah Johnson',
          documentNumber: 'MD123456789',
          expiryDate: '2025-12-31',
          issuingAuthority: 'Medical Board of California',
        },
      },
      {
        id: 'sub-2',
        providerId: 'provider-2',
        providerName: 'Maya Wellness Spa',
        providerType: 'business',
        documentType: 'business_license',
        documentNumber: 'BL987654321',
        fullName: 'Maya Wellness Spa LLC',
        issuingAuthority: 'City of Los Angeles',
        expiryDate: '2025-06-30',
        fileUrl: 'https://example.com/doc2.pdf',
        submittedAt: '2024-01-19T14:15:00Z',
        status: 'approved',
        reviewedBy: 'admin@example.com',
        reviewedAt: '2024-01-19T16:45:00Z',
        confidence: 0.92,
        extractedData: {
          fullName: 'Maya Wellness Spa LLC',
          documentNumber: 'BL987654321',
          expiryDate: '2025-06-30',
          issuingAuthority: 'City of Los Angeles',
        },
      },
      {
        id: 'sub-3',
        providerId: 'provider-3',
        providerName: 'John Smith',
        providerType: 'individual',
        documentType: 'professional_license',
        documentNumber: 'LAW456789',
        fullName: 'John Smith',
        issuingAuthority: 'State Bar of California',
        expiryDate: '2024-12-31',
        fileUrl: 'https://example.com/doc3.pdf',
        submittedAt: '2024-01-18T09:00:00Z',
        status: 'rejected',
        reviewedBy: 'admin@example.com',
        reviewedAt: '2024-01-18T11:30:00Z',
        rejectionReason: 'Document appears to be expired or low quality scan.',
        confidence: 0.67,
        extractedData: {
          fullName: 'John Smith',
          documentNumber: 'LAW456789',
          expiryDate: '2024-12-31',
          issuingAuthority: 'State Bar of California',
        },
      },
    ];

    setSubmissions(mockSubmissions);
    setFilteredSubmissions(mockSubmissions);

    // Calculate stats
    const newStats = {
      pending: mockSubmissions.filter(s => s.status === 'pending').length,
      approved: mockSubmissions.filter(s => s.status === 'approved').length,
      rejected: mockSubmissions.filter(s => s.status === 'rejected').length,
      total: mockSubmissions.length,
    };
    setStats(newStats);
  }, []);

  // Filter submissions
  useEffect(() => {
    let filtered = submissions;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.providerName.toLowerCase().includes(query) ||
        s.documentNumber.toLowerCase().includes(query) ||
        s.fullName.toLowerCase().includes(query)
      );
    }

    setFilteredSubmissions(filtered);
  }, [submissions, filterStatus, searchQuery]);

  const handleReview = (submission: VerificationSubmission, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission);
    if (action === 'reject') {
      setReviewDialogOpen(true);
    } else {
      processReview(submission, action, '');
    }
  };

  const processReview = async (submission: VerificationSubmission, action: 'approve' | 'reject', reason: string) => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updatedSubmissions = submissions.map(s => {
      if (s.id === submission.id) {
        return {
          ...s,
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewedBy: 'admin@example.com',
          reviewedAt: new Date().toISOString(),
          rejectionReason: action === 'reject' ? reason : undefined,
        };
      }
      return s;
    });

    setSubmissions(updatedSubmissions);
    setIsProcessing(false);
    setReviewDialogOpen(false);
    setRejectionReason('');
    setSelectedSubmission(null);

    // Update stats
    const newStats = {
      pending: updatedSubmissions.filter(s => s.status === 'pending').length,
      approved: updatedSubmissions.filter(s => s.status === 'approved').length,
      rejected: updatedSubmissions.filter(s => s.status === 'rejected').length,
      total: updatedSubmissions.length,
    };
    setStats(newStats);
  };

  const getStatusBadge = (status: VerificationSubmission['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      approved: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      rejected: { variant: 'destructive' as const, icon: X, color: 'text-red-600' },
    };

    const { variant, icon: Icon, color } = variants[status];

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getDocumentTypeLabel = (type: VerificationSubmission['documentType']) => {
    const labels = {
      professional_license: 'Professional License',
      business_license: 'Business License',
      drivers_license: "Driver's License",
      passport: 'Passport',
    };
    return labels[type];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verification Review</h1>
        <p className="text-gray-600 mt-2">
          Review and approve provider verification submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by provider name or document number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Submissions</CardTitle>
          <CardDescription>
            Review and process provider verification documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Document #</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {submission.providerType === 'business' ? (
                        <Building2 className="h-4 w-4 text-blue-600" />
                      ) : (
                        <User className="h-4 w-4 text-green-600" />
                      )}
                      <div>
                        <p className="font-medium">{submission.providerName}</p>
                        <p className="text-sm text-gray-500">{submission.fullName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getDocumentTypeLabel(submission.documentType)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {submission.documentNumber}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getConfidenceColor(submission.confidence)}`}>
                      {Math.round(submission.confidence * 100)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(submission.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(submission.fileUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {submission.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReview(submission, 'approve')}
                            disabled={isProcessing}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReview(submission, 'reject')}
                            disabled={isProcessing}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No submissions found</h3>
              <p className="text-gray-600">
                No verification submissions match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this verification submission.
              The provider will receive this feedback.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You are about to reject the verification for{' '}
                  <strong>{selectedSubmission.providerName}</strong>
                </AlertDescription>
              </Alert>

              <div>
                <label className="text-sm font-medium">Rejection Reason</label>
                <Textarea
                  placeholder="Explain why this verification was rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedSubmission && processReview(selectedSubmission, 'reject', rejectionReason)}
              disabled={!rejectionReason.trim() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Reject Verification'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVerification;
