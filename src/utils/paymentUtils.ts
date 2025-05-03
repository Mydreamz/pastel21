
export const calculateFees = (amount: number, feePercentage: number = 7) => {
  const platformFee = (amount * feePercentage) / 100;
  const creatorEarnings = amount - platformFee;
  
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
