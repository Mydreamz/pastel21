
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContentHeader = () => {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate('/')} 
      className="mb-6 flex items-center text-gray-600 hover:text-primary transition-colors shadow-neumorphic-sm hover:shadow-neumorphic rounded-lg px-3 py-2 duration-200"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Home
    </button>
  );
};

export default ContentHeader;
