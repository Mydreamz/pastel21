
import { FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface ContentErrorProps {
  error: string | null;
}

const ContentError = ({ error }: ContentErrorProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-red-500 mb-4">
        <FileText className="h-12 w-12" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Content Not Found</h1>
      <p className="text-gray-400 mb-6">{error || "The content you are looking for does not exist."}</p>
      <Button onClick={() => navigate('/')} variant="outline">
        Return to Home
      </Button>
    </div>
  );
};

export default ContentError;
