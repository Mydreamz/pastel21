
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        className="border-gray-700 hover:border-gray-600 text-gray-300 h-9 order-2 sm:order-1"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 order-1 sm:order-2"
      >
        Create Content
      </Button>
    </div>
  );
};

export default FormActions;
