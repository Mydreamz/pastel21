
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw, AlertCircle, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hashError, setHashError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for error in URL hash
    const hash = window.location.hash;
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const errorParam = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");
      
      if (errorParam) {
        setHashError(errorDescription ? errorDescription.replace(/\+/g, ' ') : errorParam);
        // Clear the URL hash
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, [location]);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setError(null);
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      toast({
        title: "Password reset successfully",
        description: "Your password has been reset. You can now log in with your new password.",
        variant: "default",
      });
      
      setTimeout(() => {
        navigate("/");
      }, 3000);
      
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "Failed to reset password. Please request a new password reset link.");
      toast({
        title: "Reset failed",
        description: error.message || "Failed to reset your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If there was an error in the URL hash
  if (hashError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="glass-card w-full max-w-md p-8 rounded-lg border border-white/10 text-white">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5 mr-2" />
            <AlertDescription>{hashError}</AlertDescription>
          </Alert>
          
          <h2 className="text-2xl font-bold mb-4">Password Reset Link Invalid</h2>
          <p className="mb-6 text-gray-400">The password reset link has expired or is invalid. Please request a new password reset link.</p>
          
          <Button 
            onClick={() => navigate("/forgot-password")} 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Request New Reset Link
          </Button>
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="text-emerald-400"
              onClick={() => navigate("/")}
              type="button"
            >
              Back to login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If the password has been successfully reset
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="glass-card w-full max-w-md p-8 rounded-lg border border-white/10 text-white">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">Password Reset Successful</h2>
          <p className="mb-6 text-gray-400 text-center">
            Your password has been updated successfully. Redirecting to login page...
          </p>
          <Button 
            onClick={() => navigate("/")} 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="glass-card w-full max-w-md p-8 rounded-lg border border-white/10 text-white">
        <h2 className="text-2xl font-bold mb-4">Reset your password</h2>
        <p className="mb-6 text-gray-400">Enter your new password below.</p>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <Input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {loading ? (
              <>
                <span className="inline-block mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                Resetting...
              </>
            ) : "Reset Password"}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Button
            variant="link"
            className="text-emerald-400"
            onClick={() => navigate("/")}
            type="button"
          >
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
