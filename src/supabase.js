import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey)

if (!hasSupabaseConfig) {
  console.error(
    "Missing Supabase config. Add a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server."
  )
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null
