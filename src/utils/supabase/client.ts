import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Ces variables doivent être dans ton fichier .env.local
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_PUBLISHABLE_KEY!
  )
}