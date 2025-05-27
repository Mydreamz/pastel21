
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const InvalidToken = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100">
      <div className="glass-card w-full max-w-md p-8 rounded-lg border border-cream-200/50 text-gray-800">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-500/20 rounded-full">
            <AlertCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Invalid Reset Link</h2>
        <p className="mb-6 text-center text-gray-600">
          This password reset link is invalid or has expired. Please request a new password reset.
        </p>
        <Button onClick={() => navigate("/forgot-password")} className="w-full bg-green-500 hover:bg-green-600 text-white">
          Request New Reset Link
        </Button>
      </div>
    </div>
  );
};

export default InvalidToken;
