export const isDemoMode = () => {
  if (typeof window !== 'undefined') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    return !url || url.includes('placeholder')
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')
}
