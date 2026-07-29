/**
 * Seed Admin Utility
 *
 * Verifies the SUPER_ADMIN profile exists in the `profiles` table.
 * The actual admin auth user + profile are created by the SQL migration:
 *   supabase/migrations/001_profiles_and_addresses.sql
 *
 * This script is a safety check only — it does NOT hardcode passwords.
 */

import { supabase } from "./supabase";

export async function verifySuperAdminProfile(): Promise<void> {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("user_id, role, status")
      .eq("email", "anushkaa@gmail.com")
      .maybeSingle();

    if (error) {
      // profiles table may not exist yet — migration not run
      if (error.code === "42P01") {
        console.warn(
          "[AKW] ⚠️  profiles table not found. " +
          "Please run: supabase/migrations/001_profiles_and_addresses.sql " +
          "in your Supabase SQL Editor."
        );
      }
      return;
    }

    if (!profile) {
      console.warn(
        "[AKW] ⚠️  SUPER_ADMIN profile not found. " +
        "Please run the SQL migration in your Supabase SQL Editor to seed the admin account."
      );
      return;
    }

    if (profile.role !== "SUPER_ADMIN") {
      console.warn(
        "[AKW] ⚠️  anushkaa@gmail.com exists but role is not SUPER_ADMIN. " +
        "Update via: UPDATE profiles SET role = 'SUPER_ADMIN' WHERE email = 'anushkaa@gmail.com';"
      );
      return;
    }

    console.info("[AKW] ✅ SUPER_ADMIN profile verified.");
  } catch {
    // Non-critical — silently fail in production
  }
}
