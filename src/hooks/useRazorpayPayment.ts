import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateFees } from '@/utils/paymentUtils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export const useRazorpayPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (contentId: string, amount: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          contentId,
          amount,
          currency: 'INR'
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature
        }
      });

      if (error) {
        throw new Error(error.message || 'Payment verification failed');
      }

      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const initiatePayment = async (
    contentId: string,
    amount: number,
    contentTitle: string,
    userEmail?: string,
    userName?: string,
    onSuccess?: () => void
  ) => {
    setIsProcessing(true);

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order
      const orderData = await createOrder(contentId, amount);
      console.log('Order created:', orderData);

      // Calculate fees for display
      const { platformFee, creatorEarnings } = calculateFees(amount);

      // Razorpay options
      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Monitize',
        description: `Purchase: ${contentTitle}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            console.log('Payment successful:', response);
            
            // Verify payment
            const verificationResult = await verifyPayment(response);
            console.log('Payment verified:', verificationResult);

            if (verificationResult.success) {
              toast({
                title: "Payment Successful!",
                description: `You have successfully purchased "${contentTitle}"`,
              });
              
              if (onSuccess) {
                onSuccess();
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "There was an issue verifying your payment. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: userName || '',
          email: userEmail || '',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            setIsProcessing(false);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return {
    initiatePayment,
    isProcessing,
  };
};