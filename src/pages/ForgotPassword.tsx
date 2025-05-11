import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get the actual domain the app is running on for redirectTo URL
      const origin = window.location.origin;
      const redirectTo = `${origin}/reset-password`;
      console.log(`Sending reset email with redirect to: ${redirectTo}`);
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo
      });
      if (error) {
        throw error;
      }
      toast({
        title: "Check your inbox",
        description: "We've sent you a password reset email if the address is registered."
      });
      setEmail("");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="glass-card w-full max-w-md p-8 rounded-lg border border-white/10 text-white">
        <h2 className="text-2xl font-bold mb-4 text-pastel-600">Forgot your password?</h2>
        <p className="mb-6 text-gray-400">Enter your email to receive a password reset link.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder="Email address" value={email} required onChange={e => setEmail(e.target.value)} className="bg-white/5 border-white/10 text-black" />
          <Button type="submit" disabled={loading} className="w-full bg-pastel-500 hover:bg-pastel-600 text-white">
            {loading ? <>
                <div className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </> : "Send reset link"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" className="text-pastel-400" onClick={() => navigate("/")} type="button">
            Back to login
          </Button>
        </div>
      </div>
    </div>;
};
export default ForgotPassword;