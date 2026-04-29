import Link from 'next/link'

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const formatDaysRemaining = (value: string) => {
  const due = new Date(value)
  const today = new Date()
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return `Overdue by ${Math.abs(diff)}d`
  if (diff === 0) return 'Due today'
  return `${diff}d remaining`
}

export default function TestDashboardPage() {
  const totalEmployees = 12
  const pendingTasks = 5
  const upcomingDeadlines = [
    { id: '1', title: 'EPF Submission', due_date: '2026-05-15' },
    { id: '2', title: 'SOCSO Payment', due_date: '2026-05-15' },
    { id: '3', title: 'LHDN Tax Filing', due_date: '2026-06-01' },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] flex items-center justify-center text-[var(--color-background)] font-bold">
              K
            </div>
            <span className="font-bold text-xl font-[family-name:var(--font-heading)] text-[var(--color-text-primary)]">KomplianSE</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]">
            <span>📊</span> Overview
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer">
            <span>👥</span> Employees
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer">
            <span>📅</span> Deadlines
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer">
            <span>📁</span> Documents
          </div>
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="glass-card p-4">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">Signed in as</p>
            <p className="text-sm font-medium truncate">admin@mock.com</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Bar */}
        <header className="hidden lg:flex items-center justify-between px-10 py-6 border-b border-[var(--color-border)] bg-[var(--color-background)]">
          <div>
            <h2 className="text-sm text-[var(--color-text-secondary)] font-medium">Organization</h2>
            <p className="text-lg font-semibold">Mock Company Sdn Bhd</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-xl">
              🏢
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-12 max-w-6xl w-full">
          <section className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2">Dashboard</h1>
                <p className="text-[var(--color-text-secondary)]">
                  Welcome back! Here's what's happening with your company's compliance today.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="btn-primary flex items-center gap-2 !py-2.5 cursor-pointer">
                  <span>+</span> Add Employee
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="glass-card p-6 border-l-4 border-l-[var(--color-accent)]">
                <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-1">Total Employees</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-[var(--color-text-primary)]">{totalEmployees}</p>
                  <span className="text-xs text-[var(--color-accent)] bg-[var(--color-accent-glow)] px-2 py-0.5 rounded-full">Active</span>
                </div>
              </div>
              <div className="glass-card p-6 border-l-4 border-l-[var(--color-danger)]">
                <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold text-[var(--color-text-primary)]">{pendingTasks}</p>
              </div>
              <div className="glass-card p-6 border-l-4 border-l-[var(--color-warning)]">
                <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-1">Upcoming Deadlines</p>
                <p className="text-3xl font-bold text-[var(--color-text-primary)]">{upcomingDeadlines.length}</p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-[family-name:var(--font-heading)]">Upcoming Deadlines</h2>
                  <div className="text-sm text-[var(--color-accent)] hover:underline font-medium cursor-pointer">
                    View all deadlines →
                  </div>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="divide-y divide-[var(--color-border)]">
                    {upcomingDeadlines.map((deadline: any) => (
                      <div key={deadline.id} className="p-5 hover:bg-[var(--color-surface-hover)] transition-colors flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg">
                            📅
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--color-text-primary)]">{deadline.title}</p>
                            <p className="text-sm text-[var(--color-text-secondary)]">Due: {formatDate(deadline.due_date)}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          new Date(deadline.due_date).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000 
                            ? 'bg-[rgba(255,77,106,0.1)] text-[var(--color-danger)]'
                            : 'bg-[var(--color-accent-glow)] text-[var(--color-accent)]'
                        }`}>
                          {formatDaysRemaining(deadline.due_date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-bold font-[family-name:var(--font-heading)]">Quick Actions</h2>
                <div className="grid gap-4">
                  <div className="glass-card p-5 hover:border-[var(--color-accent)] group transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent-glow)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        👤
                      </div>
                      <div>
                        <p className="font-semibold">New Employee</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">Start onboarding process</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card p-5 hover:border-[var(--color-accent)] group transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-hover)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        📄
                      </div>
                      <div>
                        <p className="font-semibold">Generate Letter</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">Create offer/appointment letters</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
