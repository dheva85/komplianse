import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Dashboard — KomplianSE',
  description: 'Employee onboarding and compliance tracker dashboard for Malaysian SMEs.',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // In real Supabase, redirect to login if no user
  // In Demo Mode (placeholder URL), we handle this more leniently
  const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')
  
  if (!user && !isDemo) {
    redirect('/login')
  }

  const { data: company } = await supabase
    .from('companies')
    .select('company_name')
    .eq('owner_user_id', user.id)
    .single()

  const companyName = company?.company_name ?? 'Your company'

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] flex items-center justify-center text-[var(--color-background)] font-bold">
              K
            </div>
            <span className="font-bold text-xl font-[family-name:var(--font-heading)] text-[var(--color-text-primary)]">KomplianSE</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <span>📊</span> Overview
          </Link>
          <Link href="/dashboard/employees" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <span>👥</span> Employees
          </Link>
          <Link href="/dashboard/deadlines" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <span>📅</span> Deadlines
          </Link>
          <Link href="/dashboard/documents" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <span>📁</span> Documents
          </Link>
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="glass-card p-4">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">Signed in as</p>
            <p className="text-sm font-medium truncate">{user?.email ?? 'Demo User'}</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Nav */}
        <header className="lg:hidden sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-background)] font-bold">K</div>
              <span className="font-bold">KomplianSE</span>
            </Link>
            <button className="p-2 text-[var(--color-text-secondary)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:flex items-center justify-between px-10 py-6 border-b border-[var(--color-border)] bg-[var(--color-background)]">
          <div>
            <h2 className="text-sm text-[var(--color-text-secondary)] font-medium">Organization</h2>
            <p className="text-lg font-semibold">{companyName}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-xl">
              🏢
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-12 max-w-6xl w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
