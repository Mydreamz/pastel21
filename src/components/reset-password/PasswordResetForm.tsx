
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Key } from "lucide-react";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const PasswordResetForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100">
      <div className="glass-card w-full max-w-md p-8 rounded-lg border border-cream-200/50 text-gray-800">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-pastel-500/20 rounded-full">
            <Key className="h-8 w-8 text-pastel-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h2>
        <p className="mb-6 text-center text-gray-600">
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
              className="bg-cream-50/80 border-cream-300 text-gray-800"
            />
            
            <PasswordStrengthMeter password={password} passwordStrength={passwordStrength} />
          </div>

          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-cream-50/80 border-cream-300 text-gray-800"
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
          <Button variant="link" className="text-pastel-600" onClick={() => navigate("/")} type="button">
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;
