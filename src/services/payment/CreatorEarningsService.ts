
import { supabase } from "@/integrations/supabase/client";

/**
 * Update creator's earnings total
 */
export async function updateCreatorEarnings(creatorId: string, earnings: number) {
  try {
    // First get current creator profile
    const { data: creatorProfile, error } = await supabase
      .from('profiles')
      .select('id, total_earnings, available_balance')
      .eq('id', creatorId)
      .single();

    // Initialize values, handling the case where fields might not exist yet
    let currentTotalEarnings = 0;
    let currentAvailableBalance = 0;
    
    if (error) {
      console.log("Fetching profile data error:", error);
    } else if (creatorProfile) {
      // Access properties safely
      const profile = creatorProfile as any;
      currentTotalEarnings = profile.total_earnings ? 
        parseFloat(profile.total_earnings) : 0;
      currentAvailableBalance = profile.available_balance ? 
        parseFloat(profile.available_balance) : 0;
    }
    
    // Update existing profile with new values
    const newTotalEarnings = currentTotalEarnings + earnings;
    const newAvailableBalance = currentAvailableBalance + earnings;
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          total_earnings: newTotalEarnings.toFixed(2),
          available_balance: newAvailableBalance.toFixed(2),
          updated_at: new Date().toISOString()
        })
        .eq('id', creatorId);
        
      if (updateError) {
        console.error("Error updating creator earnings:", updateError);
      }
    } catch (updateException) {
      console.error("Exception during profile update:", updateException);
    }
  } catch (error) {
    console.error("Error updating creator earnings:", error);
    // We don't throw here to prevent transaction failure
  }
}
