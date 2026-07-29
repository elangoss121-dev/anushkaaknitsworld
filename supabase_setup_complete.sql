-- ================================================================
-- ANUSHKAA KNITS WORLD — COMPLETE DATABASE SETUP
-- Copy ALL of this and paste into Supabase SQL Editor, then Run.
-- Dashboard → https://supabase.com/dashboard/project/bkfwoubhonatgpvabzky/sql/new
-- ================================================================

-- ════════════════════════════════════════════════════════════════
-- PART A: PRODUCTS, ORDERS, CATEGORIES TABLES
-- ════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.products (
  id                TEXT          PRIMARY KEY,
  sku               TEXT          UNIQUE NOT NULL,
  barcode           TEXT,
  name              TEXT          NOT NULL,
  slug              TEXT          NOT NULL,
  category          TEXT          NOT NULL,
  gender            TEXT          NOT NULL,
  brand             TEXT          NOT NULL,
  price             NUMERIC       NOT NULL,
  original_price    NUMERIC       NOT NULL,
  is_new_arrival    BOOLEAN       DEFAULT FALSE,
  is_trending       BOOLEAN       DEFAULT FALSE,
  is_best_seller    BOOLEAN       DEFAULT FALSE,
  is_export_surplus BOOLEAN       DEFAULT FALSE,
  rating            NUMERIC       DEFAULT 5.0,
  review_count      INTEGER       DEFAULT 0,
  stock             INTEGER       DEFAULT 10,
  sizes             JSONB         DEFAULT '[]'::jsonb,
  colors            JSONB         DEFAULT '[]'::jsonb,
  images            JSONB         DEFAULT '[]'::jsonb,
  short_description TEXT,
  description       TEXT,
  fabric_specs      JSONB         DEFAULT '{}'::jsonb,
  size_guide        JSONB         DEFAULT '[]'::jsonb,
  reviews           JSONB         DEFAULT '[]'::jsonb,
  created_at        TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id          TEXT          PRIMARY KEY,
  name        TEXT          NOT NULL,
  slug        TEXT          NOT NULL,
  image       TEXT,
  description TEXT,
  item_count  INTEGER       DEFAULT 0,
  is_special  BOOLEAN       DEFAULT FALSE,
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id               TEXT          PRIMARY KEY,
  user_id          UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  date             TEXT          NOT NULL,
  items            JSONB         NOT NULL,
  subtotal         NUMERIC       NOT NULL,
  discount         NUMERIC       DEFAULT 0,
  gst              NUMERIC       DEFAULT 0,
  shipping         NUMERIC       DEFAULT 0,
  total            NUMERIC       NOT NULL,
  status           TEXT          DEFAULT 'Confirmed',
  tracking_number  TEXT,
  shipping_address JSONB         NOT NULL,
  payment_method   TEXT          NOT NULL,
  payment_status   TEXT          DEFAULT 'Paid',
  created_at       TIMESTAMPTZ   DEFAULT NOW()
);

-- RLS for store tables
ALTER TABLE public.products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders     ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_read"  ON public.products;
DROP POLICY IF EXISTS "products_public_write" ON public.products;
DROP POLICY IF EXISTS "categories_public_read"  ON public.categories;
DROP POLICY IF EXISTS "categories_public_write" ON public.categories;
DROP POLICY IF EXISTS "orders_public_read"  ON public.orders;
DROP POLICY IF EXISTS "orders_public_write" ON public.orders;
-- Also drop old-style policy names
DROP POLICY IF EXISTS "Public Read Products"           ON public.products;
DROP POLICY IF EXISTS "Public Insert/Update Products"  ON public.products;
DROP POLICY IF EXISTS "Public Write Products"          ON public.products;
DROP POLICY IF EXISTS "Public Read Categories"         ON public.categories;
DROP POLICY IF EXISTS "Public Insert/Update Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Write Categories"        ON public.categories;
DROP POLICY IF EXISTS "Public Read Orders"             ON public.orders;
DROP POLICY IF EXISTS "Public Insert/Update Orders"    ON public.orders;
DROP POLICY IF EXISTS "Public Write Orders"            ON public.orders;

CREATE POLICY "products_public_read"  ON public.products   FOR SELECT USING (TRUE);
CREATE POLICY "products_public_write" ON public.products   FOR ALL    USING (TRUE);
CREATE POLICY "categories_public_read"  ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "categories_public_write" ON public.categories FOR ALL    USING (TRUE);
CREATE POLICY "orders_public_read"  ON public.orders FOR SELECT USING (TRUE);
CREATE POLICY "orders_public_write" ON public.orders FOR ALL    USING (TRUE);

-- ════════════════════════════════════════════════════════════════
-- PART B: PROFILES TABLE (Auth source of truth)
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

CREATE INDEX IF NOT EXISTS idx_profiles_email  ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_mobile ON public.profiles(mobile_number);
CREATE INDEX IF NOT EXISTS idx_profiles_role   ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- ════════════════════════════════════════════════════════════════
-- PART C: ADDRESSES TABLE (Multiple addresses per customer)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.addresses (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      TEXT          NOT NULL,
  phone          TEXT          NOT NULL,
  address_line_1 TEXT          NOT NULL,
  address_line_2 TEXT,
  landmark       TEXT,
  city           TEXT          NOT NULL,
  district       TEXT          NOT NULL,
  state          TEXT          NOT NULL,
  country        TEXT          NOT NULL DEFAULT 'India',
  pincode        TEXT          NOT NULL,
  latitude       DECIMAL(10,8),
  longitude      DECIMAL(11,8),
  is_default     BOOLEAN       NOT NULL DEFAULT FALSE,
  address_type   TEXT          DEFAULT 'Home'
                               CHECK (address_type IN ('Home','Office','College','Other')),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_default  ON public.addresses(user_id, is_default);

-- ════════════════════════════════════════════════════════════════
-- PART D: TRIGGERS
-- ════════════════════════════════════════════════════════════════

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at  ON public.profiles;
DROP TRIGGER IF EXISTS addresses_updated_at ON public.addresses;
CREATE TRIGGER profiles_updated_at  BEFORE UPDATE ON public.profiles  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile when auth user is created (safety net)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

-- Enforce single default address per user
CREATE OR REPLACE FUNCTION public.enforce_single_default_address()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.addresses SET is_default = FALSE
    WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS single_default_address ON public.addresses;
CREATE TRIGGER single_default_address
  BEFORE INSERT OR UPDATE ON public.addresses
  FOR EACH ROW WHEN (NEW.is_default = TRUE)
  EXECUTE FUNCTION public.enforce_single_default_address();

-- ════════════════════════════════════════════════════════════════
-- PART E: ROW LEVEL SECURITY — PROFILES & ADDRESSES
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own"       ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"       ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"       ON public.profiles;
DROP POLICY IF EXISTS "profiles_super_admin_all"  ON public.profiles;
DROP POLICY IF EXISTS "addresses_select_own"      ON public.addresses;
DROP POLICY IF EXISTS "addresses_insert_own"      ON public.addresses;
DROP POLICY IF EXISTS "addresses_update_own"      ON public.addresses;
DROP POLICY IF EXISTS "addresses_delete_own"      ON public.addresses;
DROP POLICY IF EXISTS "addresses_super_admin_all" ON public.addresses;

CREATE POLICY "profiles_select_own"      ON public.profiles FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own"      ON public.profiles FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own"      ON public.profiles FOR UPDATE  USING (auth.uid() = user_id);
CREATE POLICY "profiles_super_admin_all" ON public.profiles FOR ALL     USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'SUPER_ADMIN'));

CREATE POLICY "addresses_select_own"      ON public.addresses FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "addresses_insert_own"      ON public.addresses FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_update_own"      ON public.addresses FOR UPDATE  USING (auth.uid() = user_id);
CREATE POLICY "addresses_delete_own"      ON public.addresses FOR DELETE  USING (auth.uid() = user_id);
CREATE POLICY "addresses_super_admin_all" ON public.addresses FOR ALL     USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'SUPER_ADMIN'));

-- ════════════════════════════════════════════════════════════════
-- PART F: REGISTRATION AVAILABILITY CHECK FUNCTION
-- Called by the app before signup to check email + mobile uniqueness.
-- Uses SECURITY DEFINER so anonymous users can call it safely.
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.check_registration_availability(
  p_email  TEXT,
  p_mobile TEXT DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email_taken  BOOLEAN := FALSE;
  v_mobile_taken BOOLEAN := FALSE;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE email = LOWER(TRIM(p_email))) INTO v_email_taken;
  IF p_mobile IS NOT NULL AND TRIM(p_mobile) <> '' THEN
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE mobile_number = TRIM(p_mobile)) INTO v_mobile_taken;
  END IF;
  RETURN jsonb_build_object('email_taken', v_email_taken, 'mobile_taken', v_mobile_taken);
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_registration_availability TO anon, authenticated;

-- ════════════════════════════════════════════════════════════════
-- PART G: SUPER ADMIN SEED
-- Creates anushkaa@gmail.com with bcrypt-hashed password anushkaa123
-- and SUPER_ADMIN role. Safe to re-run (ON CONFLICT handles duplicates).
-- ════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_admin_id    UUID;
  v_instance_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  -- Check if admin auth user already exists
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'anushkaa@gmail.com';

  IF v_admin_id IS NULL THEN
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role,
      email, encrypted_password,
      email_confirmed_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      v_instance_id, v_admin_id, 'authenticated', 'authenticated',
      'anushkaa@gmail.com',
      crypt('anushkaa123', gen_salt('bf', 12)),
      NOW(), NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"ANUSHKAA ADMIN"}'::jsonb,
      NOW(), NOW(), '', '', '', ''
    );
    RAISE NOTICE 'Admin auth user created with ID: %', v_admin_id;
  ELSE
    RAISE NOTICE 'Admin auth user already exists with ID: %', v_admin_id;
  END IF;

  -- Upsert admin profile with SUPER_ADMIN role (profiles table is source of truth)
  INSERT INTO public.profiles (user_id, full_name, mobile_number, email, role, status)
  VALUES (v_admin_id, 'ANUSHKAA ADMIN', '9566396667', 'anushkaa@gmail.com', 'SUPER_ADMIN', 'ACTIVE')
  ON CONFLICT (user_id) DO UPDATE SET
    role          = 'SUPER_ADMIN',
    status        = 'ACTIVE',
    full_name     = 'ANUSHKAA ADMIN',
    mobile_number = '9566396667',
    updated_at    = NOW();

  RAISE NOTICE 'Admin profile ready — role: SUPER_ADMIN, status: ACTIVE';
END;
$$;

-- ════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES (auto-run after migration)
-- ════════════════════════════════════════════════════════════════

-- Show all tables created
SELECT tablename, rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'addresses', 'products', 'categories', 'orders')
ORDER BY tablename;

-- Show admin profile
SELECT user_id, email, role, status, mobile_number, created_at
FROM public.profiles
WHERE email = 'anushkaa@gmail.com';

-- Test availability check function
SELECT public.check_registration_availability('new@example.com', '9876543210') AS availability;
