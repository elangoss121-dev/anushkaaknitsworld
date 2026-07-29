import { redirect } from "next/navigation";

// /register always redirects to the unified auth page with Register tab pre-selected
export default function RegisterRedirectPage() {
  redirect("/login?tab=register");
}
