import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { createMockClient } from './mock-client'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || url.includes('placeholder')) {
    return createMockClient()
  }

  return createBrowserClient(url, key!)
}
