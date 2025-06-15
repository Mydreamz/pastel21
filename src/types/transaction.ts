
export interface Transaction {
  id: string;
  content_id: string;
  user_id: string;
  creator_id: string;
  amount: number;
  platform_fee: number;
  creator_earnings: number;
  timestamp: string;
  is_deleted?: boolean;
}
