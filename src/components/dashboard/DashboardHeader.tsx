
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

const DashboardHeader = () => {
  const navigate = useNavigate();
  
  const handleCreateContent = () => {
    navigate('/create');
  };
  
  return (
    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage and explore content</p>
      </div>
      
      <Button 
        onClick={handleCreateContent} 
        className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2"
      >
        <Plus size={18} />
        Create Content
      </Button>
    </div>
  );
};

export default DashboardHeader;
