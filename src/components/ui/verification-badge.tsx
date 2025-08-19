import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  isVerified: boolean;
  level?: "basic" | "verified" | "premium";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isVerified,
  level = "basic",
  size = "md",
  showText = true,
  className,
}) => {
  if (!isVerified) {
    return null;
  }

  const sizeConfig = {
    sm: { icon: "h-3 w-3", text: "text-xs", padding: "px-1.5 py-0.5" },
    md: { icon: "h-4 w-4", text: "text-xs", padding: "px-2 py-1" },
    lg: { icon: "h-5 w-5", text: "text-sm", padding: "px-3 py-1.5" },
  };

  const config = {
    basic: {
      icon: Shield,
      text: "Verified",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    verified: {
      icon: CheckCircle,
      text: "Verified Pro",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    premium: {
      icon: Award,
      text: "Premium",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  };

  const { icon: Icon, text, color } = config[level];
  const { icon: iconSize, text: textSize, padding } = sizeConfig[size];

  return (
    <Badge
      variant="outline"
      className={cn(
        color,
        padding,
        "inline-flex items-center gap-1 font-medium",
        className
      )}
    >
      <Icon className={iconSize} />
      {showText && <span className={textSize}>{text}</span>}
    </Badge>
  );
};

interface TrustScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({
  score,
  size = "md",
  showLabel = true,
  className,
}) => {
  const sizeConfig = {
    sm: { text: "text-xs", padding: "px-1.5 py-0.5" },
    md: { text: "text-sm", padding: "px-2 py-1" },
    lg: { text: "text-base", padding: "px-3 py-1.5" },
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 8) return "bg-blue-100 text-blue-700 border-blue-200";
    if (score >= 7) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };

  const { text: textSize, padding } = sizeConfig[size];

  return (
    <Badge
      variant="outline"
      className={cn(
        getScoreColor(score),
        padding,
        "inline-flex items-center gap-1 font-medium",
        className
      )}
    >
      <Star className="h-3 w-3 fill-current" />
      <span className={textSize}>
        {score.toFixed(1)}
        {showLabel && <span className="ml-1 opacity-75">trust</span>}
      </span>
    </Badge>
  );
};
