
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContentHeader = () => {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate('/dashboard')} 
      className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Dashboard
    </button>
  );
};

export default ContentHeader;
