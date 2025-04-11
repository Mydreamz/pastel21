
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lock, DollarSign, Info } from 'lucide-react';

interface ContentPreviewProps {
  title: string;
  teaser: string;
  price: number;
  type: 'text' | 'link' | 'image' | 'video' | 'audio' | 'document';
  expiryDate?: string;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  title,
  teaser,
  price,
  type,
  expiryDate
}) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formattedExpiry = formatExpiryDate(expiryDate);
  
  return (
    <Card className="glass-card border-white/10 text-white overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lock className="h-5 w-5 text-emerald-500" /> {title}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {teaser}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative">
        {/* Blurred preview */}
        <div className="h-48 flex items-center justify-center bg-white/5 rounded-md backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center p-6">
            <Lock className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-80" />
            <p className="text-white font-semibold">This content is locked</p>
            <p className="text-gray-300 text-sm mt-2">Unlock to view the full content</p>
          </div>
        </div>
        
        {/* Price tag */}
        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          {price.toFixed(2)}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button 
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" 
          onClick={() => setShowPaymentDialog(true)}
        >
          Unlock Now
        </Button>
        
        {formattedExpiry && (
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Expires: {formattedExpiry}
          </div>
        )}
      </CardFooter>
      
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="glass-card border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unlock Premium Content</DialogTitle>
            <DialogDescription className="text-gray-300">
              Complete your payment to access "{title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4 p-4 bg-white/5 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span>Content Price</span>
                <span className="font-semibold">${price.toFixed(2)}</span>
              </div>
              {/* Payment method would be integrated here */}
            </div>
            
            <p className="text-xs text-gray-400">
              By proceeding with payment, you agree to our terms of service and privacy policy.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentDialog(false)}
              className="border-gray-700 hover:border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Pay ${price.toFixed(2)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ContentPreview;
