
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ContentErrorProps {
  error: string;
}

const ContentError = ({ error }: ContentErrorProps) => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Alert variant="destructive" className="glass-card border border-[#7FB069]/30 mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-[#7FB069]">Error Loading Content</AlertTitle>
        <AlertDescription className="text-[#6A9A56]">
          {error}
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center mt-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          Back to Dashboard
        </Button>
        <Button 
          variant="default"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ContentError);
