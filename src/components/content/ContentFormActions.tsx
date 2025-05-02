
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

type ContentFormActionsProps = {
  isSubmitting?: boolean;
};

const ContentFormActions = ({ isSubmitting }: ContentFormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate('/profile')} 
        className="border-pastel-200 hover:bg-pastel-100 text-gray-700"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-pastel-500 hover:bg-pastel-600 text-white"
        disabled={isSubmitting}
      >
        Update Content
      </Button>
    </div>
  );
};

export default ContentFormActions;
