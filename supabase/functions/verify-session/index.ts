import { fromSupabaseUrl, withSupabase } from "npm:@supabase/server";

const supabaseUrl = Deno.env.get("SUPABASE_URL");

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing from the Edge Function environment.");
}

Deno.serve(
  withSupabase(
    {
      auth: "user",
      issuer: fromSupabaseUrl(supabaseUrl),
    },
    async (_request, { supabase }) => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      return Response.json({ authenticated: true, userId: data.user.id });
    },
  ),
);