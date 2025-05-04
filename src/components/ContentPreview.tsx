import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, IndianRupee, Info, Check, LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AuthDialog from '@/components/auth/AuthDialog';
import { calculateFees } from '@/utils/paymentUtils';
import { useAuth } from '@/contexts/AuthContext';

interface ContentPreviewProps {
  title: string;
  teaser: string;
  price: number;
  type: 'text' | 'link' | 'image' | 'video' | 'audio' | 'document';
  expiryDate?: string;
  scheduledFor?: Date;
  onPaymentSuccess?: () => void;
  contentId?: string;
  onPurchase?: () => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  title,
  teaser,
  price,
  type,
  expiryDate,
  scheduledFor,
  onPaymentSuccess,
  contentId,
  onPurchase
}) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Calculate platform fee and creator earnings - memoized to prevent recalculations
  const feeInfo = useMemo(() => calculateFees(price), [price]);
  
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
  
  const formattedExpiry = useMemo(() => formatExpiryDate(expiryDate), [expiryDate]);

  const handlePayment = () => {
    // Check for auth first
    if (!user) {
      setAuthTab('login');
      setShowAuthDialog(true);
      setShowPaymentDialog(false);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentDialog(false);
      
      // Process successful payment
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
      
      toast({
        title: "Payment successful!",
        description: "You now have access to the full content",
      });
    }, 1500);
  };

  const handleDirectPurchase = () => {
    if (!user) {
      setAuthTab('login');
      setShowAuthDialog(true);
      return;
    }
    
    if (onPurchase) {
      onPurchase();
    } else {
      setShowPaymentDialog(true);
    }
  };
  
  // Prevent unnecessary renders in child components
  const priceDisplay = useMemo(() => price.toFixed(2), [price]);
  const dialogFeeInfo = useMemo(() => ({
    platformFee: feeInfo.platformFee.toFixed(2),
    creatorEarnings: feeInfo.creatorEarnings.toFixed(2)
  }), [feeInfo]);

  return (
    <>
      <Card className="glass-card border-white/10 text-white overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5 text-emerald-500" /> {title}
            {scheduledFor && (
              <span className="text-sm font-normal text-gray-400">
                (Scheduled for {formatExpiryDate(scheduledFor.toISOString())})
              </span>
            )}
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
            <IndianRupee className="h-3 w-3" />
            {priceDisplay}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button 
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" 
            onClick={handleDirectPurchase}
          >
            {user ? (
              <>
                <IndianRupee className="mr-2 h-4 w-4" />
                Unlock Now (₹{priceDisplay})
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In to Unlock
              </>
            )}
          </Button>
          
          {formattedExpiry && (
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Expires: {formattedExpiry}
            </div>
          )}
        </CardFooter>
      </Card>
      
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="glass-card border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unlock Premium Content</DialogTitle>
            <DialogDescription className="text-gray-300">
              Complete your payment to access "{title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4 p-4 bg-black/20 rounded-md border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span>Content Price</span>
                <span className="font-semibold">₹{priceDisplay}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400 border-t border-white/10 pt-2 mt-2">
                <span>Platform Fee (7%)</span>
                <span>₹{dialogFeeInfo.platformFee}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-emerald-400 border-t border-white/10 pt-2 mt-2">
                <span>Creator Earnings</span>
                <span>₹{dialogFeeInfo.creatorEarnings}</span>
              </div>
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
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">●</span>
                  Processing...
                </>
              ) : (
                <>
                  <IndianRupee className="mr-2 h-4 w-4" />
                  Pay ₹{priceDisplay}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AuthDialog 
        showAuthDialog={showAuthDialog}
        setShowAuthDialog={setShowAuthDialog}
        authTab={authTab}
        setAuthTab={setAuthTab}
      />
    </>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(ContentPreview);
