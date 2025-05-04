
-- Create functions to handle withdrawal operations
CREATE OR REPLACE FUNCTION public.get_user_withdrawal_details()
RETURNS SETOF jsonb
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT to_jsonb(wd) - 'id' - 'created_at' - 'updated_at'
  FROM withdrawal_details wd
  WHERE wd.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;

-- Function to create bank withdrawal request
CREATE OR REPLACE FUNCTION public.create_bank_withdrawal_request(
  user_id_param UUID,
  amount_param numeric,
  account_holder_name_param text,
  account_number_param text,
  ifsc_code_param text,
  bank_name_param text,
  pan_number_param text,
  pan_name_param text,
  phone_number_param text
)
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO withdrawal_requests (
    user_id, amount, payment_method, account_holder_name, account_number, 
    ifsc_code, bank_name, pan_number, pan_name, phone_number, status
  ) VALUES (
    user_id_param, amount_param, 'bank_transfer', account_holder_name_param,
    account_number_param, ifsc_code_param, bank_name_param, pan_number_param,
    pan_name_param, phone_number_param, 'pending'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create UPI withdrawal request
CREATE OR REPLACE FUNCTION public.create_upi_withdrawal_request(
  user_id_param UUID,
  amount_param numeric,
  upi_id_param text,
  pan_number_param text,
  pan_name_param text,
  phone_number_param text
)
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO withdrawal_requests (
    user_id, amount, payment_method, upi_id, 
    pan_number, pan_name, phone_number, status
  ) VALUES (
    user_id_param, amount_param, 'upi', upi_id_param,
    pan_number_param, pan_name_param, phone_number_param, 'pending'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to save user withdrawal details
CREATE OR REPLACE FUNCTION public.save_user_withdrawal_details(
  user_id_param UUID,
  details_param jsonb
)
RETURNS void
SECURITY DEFINER
AS $$
DECLARE
  existing_id UUID;
BEGIN
  -- Check if details already exist for this user
  SELECT id INTO existing_id FROM withdrawal_details WHERE user_id = user_id_param;
  
  IF existing_id IS NOT NULL THEN
    -- Update existing details
    UPDATE withdrawal_details
    SET 
      account_holder_name = COALESCE(details_param->>'account_holder_name', account_holder_name),
      account_number = COALESCE(details_param->>'account_number', account_number),
      ifsc_code = COALESCE(details_param->>'ifsc_code', ifsc_code),
      bank_name = COALESCE(details_param->>'bank_name', bank_name),
      upi_id = COALESCE(details_param->>'upi_id', upi_id),
      pan_number = COALESCE(details_param->>'pan_number', pan_number),
      pan_name = COALESCE(details_param->>'pan_name', pan_name),
      phone_number = COALESCE(details_param->>'phone_number', phone_number),
      updated_at = now()
    WHERE user_id = user_id_param;
  ELSE
    -- Insert new details
    INSERT INTO withdrawal_details (
      user_id, account_holder_name, account_number, ifsc_code, bank_name,
      upi_id, pan_number, pan_name, phone_number
    ) VALUES (
      user_id_param,
      details_param->>'account_holder_name',
      details_param->>'account_number',
      details_param->>'ifsc_code',
      details_param->>'bank_name',
      details_param->>'upi_id',
      details_param->>'pan_number',
      details_param->>'pan_name',
      details_param->>'phone_number'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;
