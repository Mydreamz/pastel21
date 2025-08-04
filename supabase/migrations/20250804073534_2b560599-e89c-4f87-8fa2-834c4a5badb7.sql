-- Clean up pending transactions with null payment methods that are duplicates
DELETE FROM public.transactions 
WHERE payment_status = 'pending' 
AND payment_method IS NULL 
AND razorpay_payment_id IS NULL
AND EXISTS (
  SELECT 1 FROM public.transactions t2 
  WHERE t2.content_id = transactions.content_id 
  AND t2.user_id = transactions.user_id 
  AND t2.payment_status = 'success'
  AND t2.payment_method = 'razorpay'
);