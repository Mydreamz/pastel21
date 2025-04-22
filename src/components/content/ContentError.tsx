
import { FileText, ArrowLeft, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';

interface ContentErrorProps {
  error: string | null;
}

const ContentError = ({ error }: ContentErrorProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-red-500 mb-4">
        <FileText className="h-12 w-12" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Content Not Found</h1>
      <p className="text-gray-400 mb-6">{error || "The content you are looking for does not exist."}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
        
        {id && (
          <Button 
            onClick={() => navigate(`/preview/${id}`)} 
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Eye className="mr-2 h-4 w-4" />
            Try Preview
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentError;
