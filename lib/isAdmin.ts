import { supabase } from "@/lib/supabase";

export async function isAdmin() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  return profile?.role === "admin";
}