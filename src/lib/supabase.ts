import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bkfwoubhonatgpvabzky.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_mu-Qs18ZqKMjr0XbhNHcbQ_1X34136w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
