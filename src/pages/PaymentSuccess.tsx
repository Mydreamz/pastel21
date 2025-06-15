
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentService } from '@/services/payment/PaymentService';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const result = await PaymentService.handlePaymentReturn('paytm', searchParams);
        setVerificationResult(result);
        
        if (result.success) {
          toast({
            title: "Payment Successful!",
            description: "Your content has been unlocked successfully.",
            variant: "default"
          });
        } else {
          toast({
            title: "Payment Verification Failed",
            description: result.error || "Please contact support if you were charged.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: "Verification Error",
          description: "Unable to verify payment status. Please contact support.",
          variant: "destructive"
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, toast]);

  const txnId = searchParams.get('txnId');
  const contentId = searchParams.get('contentId');

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-50 to-white">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-pastel-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Verifying Payment</h3>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {verificationResult?.success ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-2xl">✕</span>
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {verificationResult?.success ? 'Payment Successful!' : 'Payment Verification Failed'}
          </CardTitle>
          <CardDescription>
            {verificationResult?.success 
              ? 'Your content has been unlocked and is ready to access.'
              : 'We could not verify your payment. Please contact support if you were charged.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {txnId && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Transaction ID:</p>
              <p className="font-mono text-sm font-medium">{txnId}</p>
            </div>
          )}
          
          <div className="flex flex-col space-y-3">
            {verificationResult?.success && contentId && (
              <Button
                onClick={() => navigate(`/view/${contentId}`)}
                className="w-full"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                View Content
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
