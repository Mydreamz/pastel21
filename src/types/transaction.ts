
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
  is_deleted?: boolean;
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
