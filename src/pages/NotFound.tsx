
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-red-500 mb-4">
        <FileText className="h-16 w-16" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-gray-400 mb-6">Page not found</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => navigate('/')} variant="outline" className="border-gray-700">
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
        
        <Button onClick={() => navigate(-1)} className="bg-emerald-500 hover:bg-emerald-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
