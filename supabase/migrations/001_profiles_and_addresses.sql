-- ================================================================
-- ANUSHKAA KNITS WORLD — Database Migration
-- Run this ENTIRE script in: Supabase Dashboard → SQL Editor
-- ================================================================

-- ════════════════════════════════════════════════════════════════
-- SECTION 1: PROFILES TABLE
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id       UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT          NOT NULL CHECK (LENGTH(TRIM(full_name)) >= 2),
  mobile_number TEXT          UNIQUE CHECK (mobile_number ~ '^[6-9][0-9]{9}$'),
  email         TEXT          UNIQUE NOT NULL,
  role          TEXT          NOT NULL DEFAULT 'CUSTOMER'
                              CHECK (role IN ('SUPER_ADMIN', 'CUSTOMER')),
  status        TEXT          NOT NULL DEFAULT 'ACTIVE'
                              CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  last_login    TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email       ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_mobile      ON public.profiles(mobile_number);
CREATE INDEX IF NOT EXISTS idx_profiles_role        ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status      ON public.profiles(status);

-- ════════════════════════════════════════════════════════════════
-- SECTION 2: ADDRESSES TABLE
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.addresses (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT          NOT NULL,
  phone           TEXT          NOT NULL,
  address_line_1  TEXT          NOT NULL,
  address_line_2  TEXT,
  landmark        TEXT,
  city            TEXT          NOT NULL,
  district        TEXT          NOT NULL,
  state           TEXT          NOT NULL,
  country         TEXT          NOT NULL DEFAULT 'India',
  pincode         TEXT          NOT NULL,
  latitude        DECIMAL(10,8),
  longitude       DECIMAL(11,8),
  is_default      BOOLEAN       NOT NULL DEFAULT FALSE,
  address_type    TEXT          DEFAULT 'Home' CHECK (address_type IN ('Home','Office','College','Other')),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id    ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_default    ON public.addresses(user_id, is_default);

-- ════════════════════════════════════════════════════════════════
-- SECTION 3: AUTO-UPDATE TRIGGERS
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at  ON public.profiles;
DROP TRIGGER IF EXISTS addresses_updated_at ON public.addresses;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ════════════════════════════════════════════════════════════════
-- SECTION 4: AUTO-CREATE PROFILE TRIGGER ON USER SIGNUP
-- Handles the case when email confirmation is enabled — the trigger
-- creates a basic profile immediately upon auth user creation.
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'CUSTOMER',
    'ACTIVE'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ════════════════════════════════════════════════════════════════
-- SECTION 5: ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Drop old policies to allow re-running
DROP POLICY IF EXISTS "profiles_select_own"        ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"        ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"        ON public.profiles;
DROP POLICY IF EXISTS "profiles_super_admin_all"   ON public.profiles;
DROP POLICY IF EXISTS "addresses_select_own"       ON public.addresses;
DROP POLICY IF EXISTS "addresses_insert_own"       ON public.addresses;
DROP POLICY IF EXISTS "addresses_update_own"       ON public.addresses;
DROP POLICY IF EXISTS "addresses_delete_own"       ON public.addresses;
DROP POLICY IF EXISTS "addresses_super_admin_all"  ON public.addresses;

-- Profiles: Users can read their own
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Profiles: Users can insert their own (during registration when session is active)
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles: Users can update their own (name, mobile — role/status locked in app layer)
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Profiles: SUPER_ADMIN can read and manage all
CREATE POLICY "profiles_super_admin_all" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'SUPER_ADMIN'
    )
  );

-- Addresses: Users manage their own
CREATE POLICY "addresses_select_own" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "addresses_insert_own" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "addresses_update_own" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "addresses_delete_own" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "addresses_super_admin_all" ON public.addresses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'SUPER_ADMIN'
    )
  );

-- ════════════════════════════════════════════════════════════════
-- SECTION 6: REGISTRATION AVAILABILITY CHECK FUNCTION
-- Callable by anonymous users to verify uniqueness before signup.
-- This is the authoritative duplicate check (not user_metadata).
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.check_registration_availability(
  p_email   TEXT,
  p_mobile  TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email_taken  BOOLEAN := FALSE;
  v_mobile_taken BOOLEAN := FALSE;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE email = LOWER(TRIM(p_email))
  ) INTO v_email_taken;

  IF p_mobile IS NOT NULL AND TRIM(p_mobile) <> '' THEN
    SELECT EXISTS(
      SELECT 1 FROM public.profiles WHERE mobile_number = TRIM(p_mobile)
    ) INTO v_mobile_taken;
  END IF;

  RETURN jsonb_build_object(
    'email_taken',  v_email_taken,
    'mobile_taken', v_mobile_taken
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_registration_availability TO anon, authenticated;

-- ════════════════════════════════════════════════════════════════
-- SECTION 7: ENFORCE SINGLE DEFAULT ADDRESS PER USER
-- When setting a new default, unset all others for that user.
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.enforce_single_default_address()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.addresses
    SET is_default = FALSE
    WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS single_default_address ON public.addresses;
CREATE TRIGGER single_default_address
  BEFORE INSERT OR UPDATE ON public.addresses
  FOR EACH ROW
  WHEN (NEW.is_default = TRUE)
  EXECUTE FUNCTION public.enforce_single_default_address();

-- ════════════════════════════════════════════════════════════════
-- SECTION 8: SUPER ADMIN SEED
-- Creates the default ANUSHKAA ADMIN account with bcrypt-hashed
-- password. Run this after the tables above are created.
--
-- ⚠️  IMPORTANT NOTES:
--   1. Disable "Email Confirmations" in Supabase Dashboard →
--      Authentication → Settings → Enable email confirmations → OFF
--      (Recommended for e-commerce stores for immediate access)
--   2. The admin password is 'anushkaa123' (hashed with bcrypt bf/12)
--   3. After running this, the admin can log in immediately via /login
-- ════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_admin_id    UUID;
  v_instance_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  -- Check if admin auth user already exists
  SELECT id INTO v_admin_id
  FROM auth.users
  WHERE email = 'anushkaa@gmail.com';

  IF v_admin_id IS NULL THEN
    v_admin_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, aud, role,
      email, encrypted_password,
      email_confirmed_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      v_instance_id, v_admin_id, 'authenticated', 'authenticated',
      'anushkaa@gmail.com',
      crypt('anushkaa123', gen_salt('bf', 12)),
      NOW(), NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"ANUSHKAA ADMIN"}'::jsonb,
      NOW(), NOW(),
      '', '', '', ''
    );

    RAISE NOTICE '✅ Admin auth user created: %', v_admin_id;
  ELSE
    RAISE NOTICE 'ℹ️  Admin auth user already exists: %', v_admin_id;
  END IF;

  -- Upsert admin profile with SUPER_ADMIN role
  INSERT INTO public.profiles (
    user_id, full_name, mobile_number, email, role, status
  ) VALUES (
    v_admin_id,
    'ANUSHKAA ADMIN',
    '9566396667',
    'anushkaa@gmail.com',
    'SUPER_ADMIN',
    'ACTIVE'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    role       = 'SUPER_ADMIN',
    status     = 'ACTIVE',
    full_name  = 'ANUSHKAA ADMIN',
    updated_at = NOW();

  RAISE NOTICE '✅ Admin profile upserted with SUPER_ADMIN role.';
END;
$$;
