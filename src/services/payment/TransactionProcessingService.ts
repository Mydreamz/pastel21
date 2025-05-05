
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
    console.log(`Starting transaction processing - Content: ${contentId}, User: ${userId}, Creator: ${creatorId}, Amount: ${amount}`);
    
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

    if (result.success && !result.alreadyPurchased) {
      // Log successful transaction
      console.log(`Transaction completed successfully - ID: ${result.transactionId}, Creator: ${creatorId}, Earnings: ${creatorEarnings}`);
    }

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
      platform_fee: platformFee.toString(),
      creator_earnings: creatorEarnings.toString(),
      timestamp: new Date().toISOString(),
      status: 'completed',
      is_deleted: false
    };
    
    console.log("Creating transaction with data:", baseTransactionData);
    
    // Insert the transaction record
    const { data, error } = await supabase
      .from('transactions')
      .insert(baseTransactionData)
      .select();
        
    if (error) {
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
    
    const transactionId = data?.[0]?.id;
    console.log("Transaction recorded successfully with ID:", transactionId);
      
    return {
      success: true,
      platformFee,
      creatorEarnings,
      transactionId
    };
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
