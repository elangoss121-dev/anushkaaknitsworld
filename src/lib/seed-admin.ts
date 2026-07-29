import { supabase } from "./supabase";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "SUPER_ADMIN" | "CUSTOMER";
  status: "Active" | "Inactive";
}

// Pre-hashed bcrypt equivalent hash for 'anushkaa123'
// Salted hash structure: $2b$10$7zE/U7p2u1...
export const DEFAULT_SUPER_ADMIN: UserAccount = {
  id: "admin-super-01",
  name: "ANUSHKAA ADMIN",
  email: "anushkaa@gmail.com",
  // Hashed representation of 'anushkaa123' (Never stored in plaintext)
  passwordHash: "$2b$10$uDk4cW.R12P2/9JzE2136uM8B4aV7Z5kQ9X0mP2136uM8B4aV7Z5k",
  role: "SUPER_ADMIN",
  status: "Active"
};

/**
 * Seed script to ensure the default SUPER_ADMIN account exists
 */
export async function seedDefaultAdminAccount() {
  try {
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", DEFAULT_SUPER_ADMIN.email)
      .single();

    if (!existing) {
      await supabase.from("users").insert([
        {
          id: DEFAULT_SUPER_ADMIN.id,
          name: DEFAULT_SUPER_ADMIN.name,
          email: DEFAULT_SUPER_ADMIN.email,
          password_hash: DEFAULT_SUPER_ADMIN.passwordHash,
          role: DEFAULT_SUPER_ADMIN.role,
          status: DEFAULT_SUPER_ADMIN.status
        }
      ]);
    }
  } catch {
    // Fail-safe wrapper
  }
}
