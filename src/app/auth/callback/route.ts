import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || null;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Exchange the one-time code for a session
  const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

  if (sessionError || !sessionData.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const user = sessionData.user;

  // ── If next param exists (e.g. password reset), redirect there ──────────────
  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // ── Google OAuth Flow: check profiles table by email (no duplicates) ─────────
  const userEmail = user.email?.toLowerCase().trim();

  if (!userEmail) {
    return NextResponse.redirect(`${origin}/login?error=no_email`);
  }

  // Look for existing profile by email (source of truth — NOT user_metadata)
  const { data: existingProfile, error: profileFetchErr } = await supabase
    .from("profiles")
    .select("user_id, role, status")
    .eq("email", userEmail)
    .maybeSingle();

  if (profileFetchErr) {
    console.error("Profile fetch error:", profileFetchErr);
    // Fallback: treat as new customer
  }

  // ── Existing account — update last_login and route by role ───────────────────
  if (existingProfile) {
    // Ensure the profile points to THIS auth user (handles Google <-> Email merge)
    if (existingProfile.user_id !== user.id) {
      // Email exists with a different auth provider — update user_id to current
      await supabase
        .from("profiles")
        .update({ user_id: user.id, last_login: new Date().toISOString() })
        .eq("email", userEmail);
    } else {
      await supabase
        .from("profiles")
        .update({ last_login: new Date().toISOString() })
        .eq("user_id", user.id);
    }

    if (existingProfile.status === "SUSPENDED" || existingProfile.status === "INACTIVE") {
      return NextResponse.redirect(`${origin}/login?error=account_suspended`);
    }

    if (existingProfile.role === "SUPER_ADMIN") {
      return NextResponse.redirect(`${origin}/admin`);
    }
    return NextResponse.redirect(`${origin}/account/dashboard`);
  }

  // ── New user via Google — create CUSTOMER profile ────────────────────────────
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    userEmail.split("@")[0];

  const { error: insertError } = await supabase.from("profiles").insert({
    user_id:     user.id,
    full_name:   fullName,
    email:       userEmail,
    role:        "CUSTOMER",
    status:      "ACTIVE",
    last_login:  new Date().toISOString()
  });

  if (insertError) {
    // The trigger may have already created a basic profile — try upsert
    await supabase
      .from("profiles")
      .upsert(
        {
          user_id:    user.id,
          full_name:  fullName,
          email:      userEmail,
          role:       "CUSTOMER",
          status:     "ACTIVE",
          last_login: new Date().toISOString()
        },
        { onConflict: "user_id" }
      );
  }

  return NextResponse.redirect(`${origin}/account/dashboard`);
}
