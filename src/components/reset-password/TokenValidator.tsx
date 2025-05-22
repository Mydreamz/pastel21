
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ValidationLoader from "./ValidationLoader";
import InvalidToken from "./InvalidToken";
import PasswordResetForm from "./PasswordResetForm";

const TokenValidator = () => {
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const { toast } = useToast();

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

  if (validatingToken) {
    return <ValidationLoader />;
  }

  if (!tokenValid) {
    return <InvalidToken />;
  }

  return <PasswordResetForm />;
};

export default TokenValidator;
