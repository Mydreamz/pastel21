
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

type ContentFormActionsProps = {
  isPrimary?: boolean;
  isSubmitting?: boolean;
  primaryText?: string;
  secondaryText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  navigateTo?: string;
};

const ContentFormActions = ({ 
  isPrimary = true, 
  isSubmitting = false, 
  primaryText = "Save", 
  secondaryText = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  navigateTo
}: ContentFormActionsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleSecondaryClick = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else if (navigateTo) {
      navigate(navigateTo);
    }
  };
  
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'} gap-4 pt-4`}>
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleSecondaryClick}
        className={`${isMobile ? 'w-full' : ''} border-pastel-200 hover:bg-pastel-100 text-gray-700`}
      >
        {secondaryText}
      </Button>
      {isPrimary && (
        <Button 
          type="submit" 
          className={`${isMobile ? 'w-full' : ''} bg-pastel-500 hover:bg-pastel-600 text-white`}
          disabled={isSubmitting}
          onClick={onPrimaryAction}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {primaryText === "Save" ? "Saving..." : "Processing..."}
            </>
          ) : primaryText}
        </Button>
      )}
    </div>
  );
};

export default ContentFormActions;
