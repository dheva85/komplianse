'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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

export default function DashboardPage() {
  const [data, setData] = useState<any>({ employees: [], tasks: [], deadlines: [], loading: true })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: company } = await supabase
          .from('companies')
          .select('id, company_name')
          .eq('owner_user_id', user.id)
          .single()

        const companyId = company?.id ?? null

        const [empRes, taskRes, deadRes] = await Promise.all([
          supabase.from('employees').select('*').eq('company_id', companyId),
          supabase.from('compliance_tasks').select('*').eq('company_id', companyId),
          supabase.from('deadlines').select('*').eq('company_id', companyId).order('due_date', { ascending: true }),
        ])

        setData({
          employees: empRes.data || [],
          tasks: taskRes.data || [],
          deadlines: deadRes.data || [],
          loading: false
        })
      }
    }
    loadData()
  }, [])

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const totalEmployees = data.employees.length
  const pendingTasks = data.tasks.filter((task: any) => task.status === 'pending').length
  const upcomingDeadlines = data.deadlines.filter((deadline: any) => new Date(deadline.due_date) >= new Date()).slice(0, 3)

  return (
    <section className="space-y-10 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-2 text-[var(--color-text-primary)]">Dashboard</h1>
          <p className="text-[var(--color-text-secondary)]">
            Welcome back! Here's what's happening with your company's compliance today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/employees/new" className="btn-primary flex items-center gap-2 py-2.5">
            <span>+</span> Add Employee
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-card p-6 border-l-4 border-l-[var(--color-accent)]">
          <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-1">Total Employees</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{totalEmployees}</p>
            <span className="text-xs text-[var(--color-accent)] bg-[rgba(0,229,160,0.1)] px-2 py-0.5 rounded-full border border-[rgba(0,229,160,0.2)]">Active</span>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-[#ff4d6a]">
          <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-1">Pending Tasks</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">{pendingTasks}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-[#ffab00]">
          <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-1">Upcoming Deadlines</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">{upcomingDeadlines.length}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-[var(--color-text-primary)]">Upcoming Deadlines</h2>
            <Link href="/dashboard/deadlines" className="text-sm text-[var(--color-accent)] hover:underline font-medium">
              View all deadlines →
            </Link>
          </div>

          <div className="glass-card overflow-hidden">
            {upcomingDeadlines.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-[var(--color-text-secondary)] mb-4 font-light">No upcoming deadlines found.</p>
                <Link href="/dashboard/employees/new" className="text-[var(--color-accent)] hover:underline font-medium">Add an employee to get started</Link>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {upcomingDeadlines.map((deadline: any) => (
                  <div key={deadline.id} className="p-5 hover:bg-[#1f2b29] transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-lg">
                        📅
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">{deadline.title}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">Due: {formatDate(deadline.due_date)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      new Date(deadline.due_date).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000 
                        ? 'bg-[rgba(255,77,106,0.1)] text-[#ff4d6a]'
                        : 'bg-[rgba(0,229,160,0.1)] text-[var(--color-accent)]'
                    }`}>
                      {formatDaysRemaining(deadline.due_date)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-[var(--color-text-primary)]">Quick Actions</h2>
          <div className="grid gap-4">
            <Link href="/dashboard/employees/new" className="glass-card p-5 hover:border-[var(--color-accent)] group transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[rgba(0,229,160,0.1)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  👤
                </div>
                <div>
                  <p className="font-semibold">New Employee</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Start onboarding process</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/documents" className="glass-card p-5 hover:border-[var(--color-accent)] group transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  📄
                </div>
                <div>
                  <p className="font-semibold">Generate Letter</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Create offer/appointment letters</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/deadlines" className="glass-card p-5 hover:border-[var(--color-accent)] group transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  🔔
                </div>
                <div>
                  <p className="font-semibold">Compliance Alerts</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Check SSM/LHDN deadlines</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
