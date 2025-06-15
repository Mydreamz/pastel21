
export interface Transaction {
  id: string;
  content_id: string;
  user_id: string;
  creator_id: string;
  amount: string; // Changed to string to match Supabase
  platform_fee: string; // Changed to string to match Supabase
  creator_earnings: string; // Changed to string to match Supabase
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method?: string; // Added payment method
  gateway_transaction_id?: string; // Added gateway transaction ID
  gateway_response?: any; // Added gateway response
  is_deleted?: boolean;
}

export interface PaymentSession {
  id: string;
  user_id: string;
  content_id: string;
  creator_id: string;
  amount: number;
  payment_method: string;
  session_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  gateway_order_id?: string;
  gateway_transaction_id?: string;
  gateway_response?: any;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface EarningsSummary {
  total_earnings: number;
  pending_withdrawals: number;
  available_balance: number;
  total_transactions: number;
}

export interface WithdrawalRequest {
  id?: string;
  user_id: string;
  amount: number;
  payment_method: 'bank_transfer' | 'upi';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  account_holder_name?: string;
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  upi_id?: string;
  pan_number: string;
  pan_name: string;
  phone_number: string;
  created_at?: string;
}

// Standardized transaction result type with additional fields
export interface TransactionResult {
  success: boolean;
  alreadyPurchased?: boolean;
  message?: string;
  error?: string;
  platformFee?: number;
  creatorEarnings?: number;
  transactionId?: string; // Added transactionId field
  paymentMethod?: string; // Added payment method
  redirectUrl?: string; // Added redirect URL for gateway payments
}

// Updated interface for saved user withdrawal details
export interface SavedUserDetails {
  account_holder_name?: string;
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  upi_id?: string;
  pan_number?: string;
  pan_name?: string;
  phone_number?: string;
  is_verified?: boolean;
}
