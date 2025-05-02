
import { ArrowLeft, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface ViewContentHeaderProps {
  title: string;
  creatorName: string;
  createdAt: string;
  price: string;
  creatorId: string;
  contentId: string;
}

const ViewContentHeader = ({ title, creatorName, createdAt, price, creatorId, contentId }: ViewContentHeaderProps) => {
  const navigate = useNavigate();
  const auth = localStorage.getItem('auth');
  const userData = auth ? JSON.parse(auth).user : null;
  const isCreator = userData && userData.id === creatorId;

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>
        
        {isCreator && (
          <Button
            onClick={() => navigate(`/edit/${contentId}`)}
            variant="outline"
            className="border-gray-300 hover:bg-pastel-100 hover:border-pastel-300 rounded-xl"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Content
          </Button>
        )}
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">{title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-500 mb-6">
        <span>By {creatorName}</span>
        <span className="hidden sm:block">•</span>
        <span>Created {new Date(createdAt).toLocaleDateString()}</span>
        {parseFloat(price) > 0 && (
          <>
            <span className="hidden sm:block">•</span>
            <span className="px-2 py-1 bg-pastel-500/20 text-pastel-700 rounded-full text-xs">
              ₹{parseFloat(price).toFixed(2)}
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default ViewContentHeader;
