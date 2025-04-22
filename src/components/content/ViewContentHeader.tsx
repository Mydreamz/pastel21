
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ViewContentHeaderProps {
  title: string;
  creatorName: string;
  createdAt: string;
  price: string;
}

const ViewContentHeader = ({ title, creatorName, createdAt, price }: ViewContentHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <button 
        onClick={() => navigate('/')} 
        className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </button>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-400 mb-6">
        <span>By {creatorName}</span>
        <span className="hidden sm:block">•</span>
        <span>Created {new Date(createdAt).toLocaleDateString()}</span>
        {parseFloat(price) > 0 && (
          <>
            <span className="hidden sm:block">•</span>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
              ${parseFloat(price).toFixed(2)}
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default ViewContentHeader;
