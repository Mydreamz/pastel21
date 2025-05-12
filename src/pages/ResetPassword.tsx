
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Check, Key } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validate reset token from URL on page load
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const type = hashParams.get("type");
    
    const validateToken = async () => {
      setValidatingToken(true);
      try {
        if (!accessToken || type !== "recovery") {
          setTokenValid(false);
          toast({
            title: "Invalid reset link",
            description: "This password reset link is invalid or has expired.",
            variant: "destructive",
          });
          return;
        }
        
        // Try to get user with the token to validate it
        const { data, error } = await supabase.auth.getUser(accessToken);
        
        if (error || !data.user) {
          setTokenValid(false);
          toast({
            title: "Invalid reset link",
            description: "This password reset link is invalid or has expired.",
            variant: "destructive",
          });
          return;
        }
        
        // Token is valid
        setTokenValid(true);
      } catch (error) {
        console.error("Error validating token:", error);
        setTokenValid(false);
        toast({
          title: "Error",
          description: "Failed to validate reset token. Please try again.",
          variant: "destructive",
        });
      } finally {
        setValidatingToken(false);
      }
    };
    
    validateToken();
    // Clean URL after validation for security
    if (accessToken) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);
  
  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 25; // Has uppercase
    if (/[0-9]/.test(password)) strength += 25; // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Has special char
    
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenValid) {
      toast({
        title: "Invalid reset link",
        description: "This password reset link has expired. Please request a new one.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordStrength < 75) {
      toast({
        title: "Password not strong enough",
        description: "Please choose a stronger password with uppercase letters, numbers, and special characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated."
      });
      
      // Redirect to login
      navigate("/");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="glass-card w-full max-w-md p-8 rounded-lg border border-white/10 text-white text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="glass-card w-full max-w-md p-8 rounded-lg border border-white/10 text-white">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-500/20 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">Invalid Reset Link</h2>
          <p className="mb-6 text-center text-gray-400">
            This password reset link is invalid or has expired. Please request a new password reset.
          </p>
          <Button onClick={() => navigate("/forgot-password")} className="w-full bg-pastel-500 hover:bg-pastel-600 text-white">
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="glass-card w-full max-w-md p-8 rounded-lg border border-white/10 text-white">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-pastel-500/20 rounded-full">
            <Key className="h-8 w-8 text-pastel-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h2>
        <p className="mb-6 text-center text-gray-400">
          Please enter a new password for your account. Use a strong, unique password to better protect your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/5 border-pastel-300 text-white"
            />
            
            <div className="space-y-1">
              <Progress value={passwordStrength} className="h-2" indicatorClassName={getPasswordStrengthColor()} />
              <div className="flex justify-between text-xs">
                <span className={passwordStrength >= 25 ? "text-pastel-400" : "text-gray-500"}>Weak</span>
                <span className={passwordStrength >= 50 ? "text-pastel-400" : "text-gray-500"}>Medium</span>
                <span className={passwordStrength >= 75 ? "text-pastel-400" : "text-gray-500"}>Strong</span>
                <span className={passwordStrength >= 100 ? "text-pastel-400" : "text-gray-500"}>Very Strong</span>
              </div>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1">
                <Check className={`h-3 w-3 ${password.length >= 8 ? "text-green-500" : "text-gray-500"}`} />
                <span className={password.length >= 8 ? "text-green-500" : "text-gray-500"}>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className={`h-3 w-3 ${/[A-Z]/.test(password) ? "text-green-500" : "text-gray-500"}`} />
                <span className={/[A-Z]/.test(password) ? "text-green-500" : "text-gray-500"}>Contains uppercase letter</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className={`h-3 w-3 ${/[0-9]/.test(password) ? "text-green-500" : "text-gray-500"}`} />
                <span className={/[0-9]/.test(password) ? "text-green-500" : "text-gray-500"}>Contains number</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className={`h-3 w-3 ${/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-gray-500"}`} />
                <span className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-gray-500"}>Contains special character</span>
              </div>
            </div>
          </div>

          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white/5 border-pastel-300 text-white"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-pastel-500 hover:bg-pastel-600 text-white"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button variant="link" className="text-pastel-400" onClick={() => navigate("/")} type="button">
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
