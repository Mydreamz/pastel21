
-- ========= General Security: Enable RLS on all tables =========
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encryption_keys ENABLE ROW LEVEL SECURITY;

-- ========= Table: profiles =========
-- Policy: Authenticated users can view all profiles.
CREATE POLICY "Allow authenticated users to read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can update their own profile.
CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ========= Table: contents =========
-- Policy: Authenticated users can view published, non-deleted content.
CREATE POLICY "Allow authenticated read access to published content"
  ON public.contents FOR SELECT
  TO authenticated
  USING (status = 'published' AND is_deleted = false);

-- Policy: Users can create their own content.
CREATE POLICY "Allow users to create their own content"
  ON public.contents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Policy: Users can update their own content.
CREATE POLICY "Allow users to update their own content"
  ON public.contents FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Policy: Users can delete their own content.
CREATE POLICY "Allow users to delete their own content"
  ON public.contents FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- ========= Table: comments =========
-- Policy: Authenticated users can view non-deleted comments.
CREATE POLICY "Allow authenticated read access to comments"
  ON public.comments FOR SELECT
  TO authenticated
  USING (is_deleted = false);

-- Policy: Users can create comments for themselves.
CREATE POLICY "Allow users to create comments"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own comments.
CREATE POLICY "Allow users to update their own comments"
  ON public.comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
  
-- Policy: Users can delete their own comments.
CREATE POLICY "Allow users to delete their own comments"
  ON public.comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========= Table: transactions =========
-- Policy: Users can only view their own transactions (as buyer or seller).
-- INSERT/UPDATE/DELETE are blocked for users, only allowed via service_role.
CREATE POLICY "Allow users to view their own transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = creator_id);

-- ========= Table: withdrawal_requests =========
-- Policy: Users can view their own withdrawal requests.
CREATE POLICY "Allow user to see their withdrawal requests"
  ON public.withdrawal_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own withdrawal requests.
CREATE POLICY "Allow user to create withdrawal requests"
  ON public.withdrawal_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ========= Table: withdrawal_details =========
-- Policy: Users can fully manage their own withdrawal details.
CREATE POLICY "Allow user to manage their own withdrawal details"
  ON public.withdrawal_details FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========= Table: payment_sessions =========
-- Policy: Users can only view payment sessions they are part of.
CREATE POLICY "Allow users to see their own payment sessions"
  ON public.payment_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = creator_id);

-- ========= Table: content_views =========
-- Policy: Creators can view analytics for their own content.
CREATE POLICY "Allow creators to view their content's views"
  ON public.content_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.contents c
      WHERE c.id = content_views.content_id AND c.creator_id = auth.uid()
    )
  );

-- ========= Secure Internal Tables by Default =========
-- By enabling RLS on the tables below and NOT providing any policies,
-- we block all access from users by default. Access to these tables
-- should only be done via the backend with the service_role key
-- or through SECURITY DEFINER functions.
-- Tables secured: platform_fees, encryption_keys
