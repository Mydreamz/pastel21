
import React from "react";

const ValidationLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100">
      <div className="glass-card w-full max-w-md p-8 rounded-lg border border-cream-200/50 text-gray-800 text-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full mx-auto mb-4"></div>
        <p>Validating reset link...</p>
      </div>
    </div>
  );
};

export default ValidationLoader;
