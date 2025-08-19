import React, { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileImage,
  CheckCircle,
  AlertCircle,
  Camera,
  FileText,
  X,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Validation schemas
const documentSchema = z.object({
  documentType: z.enum(["drivers_license", "passport", "professional_license", "business_license"]),
  fullName: z.string().min(2, "Full name is required"),
  documentNumber: z.string().min(1, "Document number is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
});

const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
      "Only JPEG, PNG, or PDF files are allowed"
    ),
});

type DocumentFormData = z.infer<typeof documentSchema>;
type FileFormData = z.infer<typeof fileSchema>;

interface VerificationStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface ExtractedData {
  fullName?: string;
  documentNumber?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  confidence: number;
}

interface VerificationUploadProps {
  onComplete: (data: DocumentFormData & { fileUrl: string }) => void;
  currentStep?: number;
}

const VerificationUpload: React.FC<VerificationUploadProps> = ({
  onComplete,
  currentStep = 1,
}) => {
  const [step, setStep] = useState(currentStep);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps: VerificationStep[] = [
    {
      id: 1,
      title: "Document Upload",
      description: "Upload your identification or professional license",
      completed: uploadedFile !== null,
    },
    {
      id: 2,
      title: "Data Extraction",
      description: "We'll extract key information from your document",
      completed: extractedData !== null,
    },
    {
      id: 3,
      title: "Review & Submit",
      description: "Review extracted data and submit for verification",
      completed: verificationStatus === 'success',
    },
  ];

  const documentForm = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentType: "professional_license",
      fullName: "",
      documentNumber: "",
      expiryDate: "",
      issuingAuthority: "",
    },
  });

  // Mock OCR extraction function
  const mockOCRExtraction = useCallback(async (file: File): Promise<ExtractedData> => {
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted data based on file type and document type
    const mockData: ExtractedData = {
      fullName: "Dr. Sarah Johnson",
      documentNumber: "MD123456789",
      expiryDate: "2025-12-31",
      issuingAuthority: "Medical Board of California",
      confidence: 0.95,
    };
    
    setIsProcessing(false);
    return mockData;
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      // Validate file
      fileSchema.parse({ file });
      
      setUploadedFile(file);
      
      // Create preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
      
      // Move to next step
      setStep(2);
      
      // Start OCR extraction
      const extracted = await mockOCRExtraction(file);
      setExtractedData(extracted);
      
      // Auto-fill form with extracted data
      if (extracted.confidence > 0.8) {
        documentForm.setValue('fullName', extracted.fullName || '');
        documentForm.setValue('documentNumber', extracted.documentNumber || '');
        documentForm.setValue('expiryDate', extracted.expiryDate || '');
        documentForm.setValue('issuingAuthority', extracted.issuingAuthority || '');
      }
      
      setStep(3);
    } catch (error) {
      console.error('File upload error:', error);
    }
  }, [documentForm, mockOCRExtraction]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const onSubmit = async (data: DocumentFormData) => {
    setVerificationStatus('processing');
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setVerificationStatus('success');
    
    // Call completion callback with file URL (mock)
    onComplete({
      ...data,
      fileUrl: `https://api.appointhub.com/documents/${Date.now()}-${uploadedFile?.name}`,
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setExtractedData(null);
    setStep(1);
    setVerificationStatus('pending');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const progressValue = (step / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Document Verification
          </CardTitle>
          <CardDescription>
            Complete the verification process to gain trusted provider status
          </CardDescription>
          <div className="space-y-3">
            <Progress value={progressValue} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              {steps.map((stepInfo, index) => (
                <div
                  key={stepInfo.id}
                  className={cn(
                    "flex items-center gap-2",
                    step >= stepInfo.id ? "text-blue-600" : "text-gray-400"
                  )}
                >
                  {stepInfo.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-current" />
                  )}
                  <span className="hidden sm:inline">{stepInfo.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step 1: File Upload */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Upload a clear photo or scan of your professional license, ID, or business registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop your document here</p>
              <p className="text-gray-600 mb-4">or click to browse</p>
              <Button variant="outline">
                <FileImage className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileInputChange}
              />
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Supported formats:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>JPEG, PNG images (max 5MB)</li>
                <li>PDF documents (max 5MB)</li>
                <li>Clear, readable quality required</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Processing */}
      {step === 2 && isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
              <h3 className="font-semibold">Processing Document</h3>
              <p className="text-gray-600">
                Our AI is extracting information from your document...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Extracted Information</CardTitle>
            <CardDescription>
              Please verify the information extracted from your document
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedFile && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileImage className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {filePreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(filePreview, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {extractedData && (
              <Alert className="mb-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Information extracted with {Math.round(extractedData.confidence * 100)}% confidence.
                  Please review and correct any errors below.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={documentForm.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="documentType">Document Type</Label>
                <Select
                  value={documentForm.watch('documentType')}
                  onValueChange={(value) => documentForm.setValue('documentType', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional_license">Professional License</SelectItem>
                    <SelectItem value="business_license">Business License</SelectItem>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  {...documentForm.register('fullName')}
                  className={extractedData?.fullName ? 'bg-green-50 border-green-200' : ''}
                />
                {documentForm.formState.errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">
                    {documentForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="documentNumber">Document/License Number</Label>
                <Input
                  {...documentForm.register('documentNumber')}
                  className={extractedData?.documentNumber ? 'bg-green-50 border-green-200' : ''}
                />
                {documentForm.formState.errors.documentNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {documentForm.formState.errors.documentNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  {...documentForm.register('expiryDate')}
                  type="date"
                  className={extractedData?.expiryDate ? 'bg-green-50 border-green-200' : ''}
                />
                {documentForm.formState.errors.expiryDate && (
                  <p className="text-red-600 text-sm mt-1">
                    {documentForm.formState.errors.expiryDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Input
                  {...documentForm.register('issuingAuthority')}
                  placeholder="e.g., Medical Board of California"
                  className={extractedData?.issuingAuthority ? 'bg-green-50 border-green-200' : ''}
                />
                {documentForm.formState.errors.issuingAuthority && (
                  <p className="text-red-600 text-sm mt-1">
                    {documentForm.formState.errors.issuingAuthority.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Upload Different File
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={verificationStatus === 'processing'}
                >
                  {verificationStatus === 'processing' ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit for Verification'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {verificationStatus === 'success' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-semibold text-green-900">
                Verification Submitted Successfully!
              </h3>
              <p className="text-green-700">
                Your document has been submitted for review. You'll receive an email notification
                once the verification process is complete (typically within 1-2 business days).
              </p>
              <Badge variant="outline" className="border-green-600 text-green-700">
                Under Review
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerificationUpload;
