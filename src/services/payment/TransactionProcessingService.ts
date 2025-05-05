
import { supabase } from "@/integrations/supabase/client";
import { calculateFees } from "@/utils/paymentUtils";
import { TransactionResult } from "@/types/transaction";

/**
 * Process a purchase transaction
 */
export async function processPurchaseTransaction(
  contentId: string, 
  userId: string, 
  creatorId: string, 
  amount: number,
  feePercentage: number
): Promise<TransactionResult> {
  try {
    // Check if transaction already exists (prevent duplicate purchases)
    const { data: existingTransactions, error: checkError } = await supabase
      .from('transactions')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .limit(1);
    
    if (checkError) {
      console.error("Error checking for existing transactions:", checkError);
      return {
        success: false,
        error: "Failed to validate transaction uniqueness"
      };
    }
    
    // If transaction already exists, prevent duplicate purchase
    if (existingTransactions && existingTransactions.length > 0) {
      console.log("Transaction already exists, returning success as already purchased");
      return {
        success: true,
        alreadyPurchased: true,
        message: "Content already purchased"
      };
    }

    // Calculate fee distribution
    const { platformFee, creatorEarnings } = calculateFees(amount, feePercentage);

    console.log(`Processing payment - Amount: ${amount}, Platform fee: ${platformFee}, Creator earnings: ${creatorEarnings}`);

    // Create transaction record
    const result = await createTransactionRecord(
      contentId,
      userId,
      creatorId,
      amount,
      platformFee,
      creatorEarnings
    );

    return result;
  } catch (error: any) {
    console.error("Transaction processing error:", error);
    return {
      success: false,
      error: error.message || "Unknown transaction error"
    };
  }
}

/**
 * Create the transaction record in the database
 */
async function createTransactionRecord(
  contentId: string,
  userId: string,
  creatorId: string,
  amount: number,
  platformFee: number,
  creatorEarnings: number
): Promise<TransactionResult> {
  try {
    // Create the basic transaction object first (required fields only)
    const baseTransactionData = {
      content_id: contentId,
      user_id: userId,
      creator_id: creatorId,
      amount: amount.toString(),
      timestamp: new Date().toISOString(),
      is_deleted: false
    };
    
    // Handle potential schema cache issues by inserting in two stages if needed
    try {
      // First attempt: Try inserting with all fields including fee distribution
      const fullTransactionData = {
        ...baseTransactionData,
        platform_fee: platformFee.toString(),
        creator_earnings: creatorEarnings.toString(),
        status: 'completed'
      };
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(fullTransactionData)
        .select();
        
      if (error) {
        // If schema cache error, throw to trigger fallback
        if (error.message?.includes("column") || error.message?.includes("schema cache")) {
          console.warn("Schema cache issue detected, trying fallback insertion:", error);
          throw new Error("Schema cache error");
        }
        
        // If the error indicates a duplicate purchase
        if (error.code === '23505' || error.message?.includes("duplicate")) {
          console.log("Duplicate transaction detected via error, treating as success");
          return {
            success: true,
            alreadyPurchased: true,
            message: "Content already purchased"
          };
        }
        
        throw error;
      }
      
      console.log("Transaction recorded successfully with full data:", data);
      return {
        success: true,
        platformFee,
        creatorEarnings
      };
      
    } catch (schemaError: any) {
      // Fallback: Try inserting with just the base fields if there was a schema error
      const { data: baseData, error: baseError } = await supabase
        .from('transactions')
        .insert(baseTransactionData)
        .select();
        
      if (baseError) {
        // If this also fails with a duplicate error, treat as success
        if (baseError.code === '23505' || baseError.message?.includes("duplicate")) {
          return {
            success: true,
            alreadyPurchased: true,
            message: "Content already purchased"
          };
        }
        
        throw baseError;
      }
      
      console.log("Transaction recorded successfully with basic data:", baseData);
      return {
        success: true,
        platformFee,
        creatorEarnings
      };
    }
  } catch (insertError: any) {
    console.error("Exception during transaction insert:", insertError);
    
    // One last check before failing - see if the transaction was actually created
    const { data: finalCheck } = await supabase
      .from('transactions')
      .select('id')
      .eq('content_id', contentId)
      .eq('user_id', userId)
      .limit(1);
      
    if (finalCheck && finalCheck.length > 0) {
      console.log("Transaction exists after error check, treating as success");
      return {
        success: true,
        alreadyPurchased: true,
        message: "Content already purchased"
      };
    }
    
    return {
      success: false,
      error: "Failed to process payment: " + (insertError.message || "Unknown error")
    };
  }
}
