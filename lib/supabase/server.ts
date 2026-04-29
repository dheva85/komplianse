import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Demo Mode logic for server components
  if (!url || url.includes('placeholder')) {
    const demoUserCookie = cookieStore.get('demo-user')?.value
    let user = null
    
    if (demoUserCookie) {
      try {
        user = JSON.parse(decodeURIComponent(demoUserCookie))
      } catch (e) {
        console.error('Failed to parse demo user cookie', e)
      }
    }

    return {
      auth: {
        getUser: async () => ({ data: { user }, error: null }),
        getSession: async () => ({ data: { session: user ? { user } : null }, error: null }),
      },
      from: (table: string) => ({
        select: () => ({
          eq: () => ({
            single: async () => {
              if (table === 'companies' && user) {
                return { data: { id: 'demo-co-1', company_name: user.company_name || 'Demo Corp' }, error: null }
              }
              return { data: null, error: null }
            },
            order: () => ({
              async then(resolve: any) {
                resolve({ data: [], error: null })
              }
            })
          })
        })
      })
    } as any
  }

  return createServerClient(url, key!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      },
    },
  })
}
