
export const calculateFees = (amount: number, feePercentage: number = 7) => {
  // Ensure we're working with valid numbers
  const safeAmount = Math.max(0, Number(amount) || 0);
  const safeFeePercentage = Math.max(0, Number(feePercentage) || 0);
  
  // Calculate platform fee: amount * (feePercentage / 100)
  const platformFee = (safeAmount * safeFeePercentage) / 100;
  
  // Creator earnings is the remaining amount after deducting platform fee
  const creatorEarnings = safeAmount - platformFee;
  
  return {
    platformFee: parseFloat(platformFee.toFixed(2)),
    creatorEarnings: parseFloat(creatorEarnings.toFixed(2))
  };
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const validateTransaction = (transaction: any): boolean => {
  const requiredFields = ['content_id', 'user_id', 'creator_id', 'amount'];
  return requiredFields.every(field => transaction[field] !== undefined);
};
