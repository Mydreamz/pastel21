
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

type PasswordStrengthMeterProps = {
  password: string;
  passwordStrength: number;
};

const PasswordStrengthMeter = ({ password, passwordStrength }: PasswordStrengthMeterProps) => {
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-primary";
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Progress 
          value={passwordStrength} 
          className="h-2 shadow-neumorphic-inset rounded-full bg-cream-200" 
          indicatorClassName={getPasswordStrengthColor()} 
        />
        <div className="flex justify-between text-xs">
          <span className={passwordStrength >= 25 ? "text-primary" : "text-gray-500"}>Weak</span>
          <span className={passwordStrength >= 50 ? "text-primary" : "text-gray-500"}>Medium</span>
          <span className={passwordStrength >= 75 ? "text-primary" : "text-gray-500"}>Strong</span>
          <span className={passwordStrength >= 100 ? "text-primary" : "text-gray-500"}>Very Strong</span>
        </div>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1">
          <Check className={`h-3 w-3 ${password.length >= 8 ? "text-primary" : "text-gray-500"}`} />
          <span className={password.length >= 8 ? "text-primary" : "text-gray-500"}>At least 8 characters</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className={`h-3 w-3 ${/[A-Z]/.test(password) ? "text-primary" : "text-gray-500"}`} />
          <span className={/[A-Z]/.test(password) ? "text-primary" : "text-gray-500"}>Contains uppercase letter</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className={`h-3 w-3 ${/[0-9]/.test(password) ? "text-primary" : "text-gray-500"}`} />
          <span className={/[0-9]/.test(password) ? "text-primary" : "text-gray-500"}>Contains number</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className={`h-3 w-3 ${/[^A-Za-z0-9]/.test(password) ? "text-primary" : "text-gray-500"}`} />
          <span className={/[^A-Za-z0-9]/.test(password) ? "text-primary" : "text-gray-500"}>Contains special character</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
