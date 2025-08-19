interface BookingData {
  id: string;
  status: 'completed' | 'cancelled' | 'no_show';
  rating?: number;
  responseTime?: number; // in minutes
  completedAt?: string;
  providerId: string;
}

interface ProviderMetrics {
  totalBookings: number;
  completedBookings: number;
  averageRating: number;
  reviewCount: number;
  averageResponseTime: number; // in minutes
  accountAge: number; // in days
  verificationLevel: 'unverified' | 'basic' | 'verified' | 'premium';
  isVerified: boolean;
  noShowRate: number;
  cancellationRate: number;
  repeatClientRate: number;
  profileCompleteness: number; // 0-1
}

interface TrustScoreBreakdown {
  overall: number;
  reliability: number;
  quality: number;
  responsiveness: number;
  verification: number;
  experience: number;
}

/**
 * Calculate comprehensive trust score based on provider metrics
 * Scale: 0-10 (10 being highest trust)
 */
export function calculateTrustScore(metrics: ProviderMetrics): TrustScoreBreakdown {
  // 1. Reliability Score (25% weight)
  const completionRate = metrics.totalBookings > 0 ? metrics.completedBookings / metrics.totalBookings : 0;
  const reliabilityFactors = [
    completionRate * 100, // Completion rate (0-100)
    Math.max(0, 100 - metrics.noShowRate * 100), // Low no-show rate
    Math.max(0, 100 - metrics.cancellationRate * 100), // Low cancellation rate
  ];
  const reliability = reliabilityFactors.reduce((sum, factor) => sum + factor, 0) / reliabilityFactors.length / 10;

  // 2. Quality Score (30% weight)
  const ratingScore = metrics.averageRating * 2; // Scale 0-5 to 0-10
  const reviewVolume = Math.min(10, Math.log10(metrics.reviewCount + 1) * 3); // Logarithmic scale
  const repeatClient = metrics.repeatClientRate * 10; // 0-1 to 0-10
  const quality = (ratingScore * 0.5 + reviewVolume * 0.2 + repeatClient * 0.3);

  // 3. Responsiveness Score (20% weight)
  const responseTimeScore = Math.max(0, 10 - (metrics.averageResponseTime / 60)); // Penalize slow response
  const responsiveness = Math.min(10, responseTimeScore);

  // 4. Verification Score (15% weight)
  const verificationScores = {
    unverified: 0,
    basic: 4,
    verified: 7,
    premium: 10,
  };
  const baseVerificationScore = verificationScores[metrics.verificationLevel];
  const verification = baseVerificationScore + (metrics.profileCompleteness * 2);

  // 5. Experience Score (10% weight)
  const accountAgeScore = Math.min(10, (metrics.accountAge / 365) * 3); // 3 years = max score
  const volumeScore = Math.min(10, Math.log10(metrics.totalBookings + 1) * 2.5);
  const experience = (accountAgeScore * 0.4 + volumeScore * 0.6);

  // Calculate weighted overall score
  const weights = {
    reliability: 0.25,
    quality: 0.30,
    responsiveness: 0.20,
    verification: 0.15,
    experience: 0.10,
  };

  const overall = 
    reliability * weights.reliability +
    quality * weights.quality +
    responsiveness * weights.responsiveness +
    verification * weights.verification +
    experience * weights.experience;

  return {
    overall: Math.min(10, Math.max(0, overall)),
    reliability: Math.min(10, Math.max(0, reliability)),
    quality: Math.min(10, Math.max(0, quality)),
    responsiveness: Math.min(10, Math.max(0, responsiveness)),
    verification: Math.min(10, Math.max(0, verification)),
    experience: Math.min(10, Math.max(0, experience)),
  };
}

/**
 * Get trust score color class based on score
 */
export function getTrustScoreColor(score: number): string {
  if (score >= 9) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 8) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (score >= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (score >= 6) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
}

/**
 * Get trust score description
 */
export function getTrustScoreDescription(score: number): string {
  if (score >= 9.5) return 'Exceptional';
  if (score >= 9) return 'Excellent';
  if (score >= 8) return 'Very Good';
  if (score >= 7) return 'Good';
  if (score >= 6) return 'Fair';
  if (score >= 5) return 'Average';
  return 'Below Average';
}

/**
 * Get improvement suggestions based on trust score breakdown
 */
export function getTrustScoreImprovements(breakdown: TrustScoreBreakdown): string[] {
  const suggestions: string[] = [];

  if (breakdown.reliability < 7) {
    suggestions.push('Improve booking completion rate and reduce cancellations');
  }
  if (breakdown.quality < 7) {
    suggestions.push('Focus on service quality to improve ratings and reviews');
  }
  if (breakdown.responsiveness < 7) {
    suggestions.push('Respond to client messages and booking requests faster');
  }
  if (breakdown.verification < 7) {
    suggestions.push('Complete profile verification and add professional credentials');
  }
  if (breakdown.experience < 7) {
    suggestions.push('Build experience through more completed bookings');
  }

  return suggestions;
}

/**
 * Mock function to generate realistic provider metrics for demo
 */
export function generateMockProviderMetrics(providerId: string): ProviderMetrics {
  // Use provider ID as seed for consistent mock data
  const seed = providerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  const totalBookings = Math.floor(random(20, 500));
  const completedBookings = Math.floor(totalBookings * random(0.85, 0.98));
  const reviewCount = Math.floor(completedBookings * random(0.3, 0.8));

  return {
    totalBookings,
    completedBookings,
    averageRating: random(4.0, 5.0),
    reviewCount,
    averageResponseTime: random(5, 120), // 5 minutes to 2 hours
    accountAge: random(30, 1095), // 1 month to 3 years
    verificationLevel: random(0, 1) > 0.7 ? 'verified' : random(0, 1) > 0.4 ? 'basic' : 'unverified',
    isVerified: random(0, 1) > 0.3,
    noShowRate: random(0, 0.1), // 0-10%
    cancellationRate: random(0, 0.15), // 0-15%
    repeatClientRate: random(0.2, 0.6), // 20-60%
    profileCompleteness: random(0.6, 1.0), // 60-100%
  };
}

/**
 * Calculate trust score for a provider with mock data
 */
export function calculateMockTrustScore(providerId: string): TrustScoreBreakdown {
  const metrics = generateMockProviderMetrics(providerId);
  return calculateTrustScore(metrics);
}
