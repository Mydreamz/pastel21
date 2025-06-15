
-- Create an enum type for application roles, if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user');
    END IF;
END$$;

-- Create a table to store user roles, if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on the user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a security definer function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

-- Create a helper function to check if the currently authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.has_role(auth.uid(), 'admin');
END;
$$;

-- Secure the platform_fees table so only admins can access it
ALTER TABLE public.platform_fees ENABLE ROW LEVEL SECURITY;

-- Drop the policy if it exists from a previous failed attempt
DROP POLICY IF EXISTS "Enable read access for admins" ON public.platform_fees;

-- Create a new policy that allows only admins to read platform_fees
CREATE POLICY "Enable read access for admins"
  ON public.platform_fees FOR SELECT
  TO authenticated
  USING (public.is_admin());
