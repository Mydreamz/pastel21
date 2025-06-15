
-- Secure the search_path for the insert_platform_fee function
CREATE OR REPLACE FUNCTION public.insert_platform_fee()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.platform_fees (transaction_id, amount)
  VALUES (NEW.id, NEW.platform_fee);
  RETURN NEW;
END;
$function$;

-- Secure the search_path for the get_pending_withdrawals function
CREATE OR REPLACE FUNCTION public.get_pending_withdrawals(user_id_param uuid)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  total_pending DECIMAL;
BEGIN
  SELECT COALESCE(SUM(amount), 0)
  INTO total_pending
  FROM withdrawal_requests 
  WHERE user_id = user_id_param 
  AND status IN ('pending', 'processing');
  
  RETURN total_pending;
END;
$function$;

-- Secure the search_path for the update_timestamp function
CREATE OR REPLACE FUNCTION public.update_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Secure the search_path for the encrypt_data function
CREATE OR REPLACE FUNCTION public.encrypt_data(data text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  encryption_key TEXT;
BEGIN
  -- Get the default encryption key
  SELECT key_value INTO encryption_key FROM public.encryption_keys WHERE key_name = 'default_encryption_key';
  
  -- Return encrypted data using AES-256-CBC
  RETURN encode(
    pgp_sym_encrypt(
      data,
      encryption_key,
      'cipher-algo=aes256'
    )::bytea,
    'base64'
  );
END;
$function$;

-- Secure the search_path for the decrypt_data function
CREATE OR REPLACE FUNCTION public.decrypt_data(encrypted_data text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  encryption_key TEXT;
  decrypted_result TEXT;
BEGIN
  -- Get the default encryption key
  SELECT key_value INTO encryption_key FROM public.encryption_keys WHERE key_name = 'default_encryption_key';
  
  -- Attempt to decrypt the data
  BEGIN
    decrypted_result := pgp_sym_decrypt(
      decode(encrypted_data, 'base64'),
      encryption_key,
      'cipher-algo=aes256'
    );
    RETURN decrypted_result;
  EXCEPTION
    WHEN OTHERS THEN
      -- Return NULL if decryption fails
      RETURN NULL;
  END;
END;
$function$;

-- Secure the search_path for the reencrypt_column function
CREATE OR REPLACE FUNCTION public.reencrypt_column(table_name text, column_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  query TEXT;
BEGIN
  query := format(
    'UPDATE %I SET %I = encrypt_data(decrypt_data(%I))',
    table_name,
    column_name,
    column_name
  );
  EXECUTE query;
END;
$function$;
