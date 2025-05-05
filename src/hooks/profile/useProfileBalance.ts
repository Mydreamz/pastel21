
import { useCallback } from 'react';
import { reconcileUserBalance } from '@/utils/balanceUtils';

/**
 * Hook for managing profile balance-related operations
 */
export const useProfileBalance = (user: any, session: any, toast: any) => {
  // Function to manually refresh balance
  const refreshBalance = useCallback(async () => {
    if (!user?.id) {
      console.log("Cannot refresh balance: No user ID available");
      return { success: false, error: "No user ID available" };
    }
    
    try {
      console.log("Manually refreshing balance for user:", user.id);
      const result = await reconcileUserBalance(user.id);
      
      if (result.success) {
        console.log("Balance refresh successful:", result);
        toast({
          title: "Balance Updated",
          description: "Your wallet balance has been refreshed",
        });
        return result;
      } else {
        console.error("Balance refresh failed:", result.error);
        toast({
          title: "Refresh Failed",
          description: "Could not refresh your balance. Please try again.",
          variant: "destructive"
        });
        return result;
      }
    } catch (error) {
      console.error("Error in refreshBalance:", error);
      toast({
        title: "Refresh Error",
        description: "An error occurred while refreshing your balance",
        variant: "destructive"
      });
      return { 
        success: false, 
        error: String(error) 
      };
    }
  }, [user?.id, toast]);

  return {
    refreshBalance
  };
};
