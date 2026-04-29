'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const badgeClass = (status: string) =>
  status === 'done'
    ? 'badge badge-done'
    : status === 'pending'
    ? 'badge badge-pending'
    : 'badge badge-overdue'

export default function EmployeesPage() {
  const [data, setData] = useState<any>({ employees: [], tasks: [], loading: true })
  const [updating, setUpdating] = useState<string | null>(null)

  const loadData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_user_id', user.id)
        .single()

      const companyId = company?.id ?? null

      const [empRes, taskRes] = await Promise.all([
        supabase.from('employees').select('*').eq('company_id', companyId).order('start_date', { ascending: false }),
        supabase.from('compliance_tasks').select('*').eq('company_id', companyId),
      ])

      setData({
        employees: empRes.data || [],
        tasks: taskRes.data || [],
        loading: false
      })
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleTask = async (taskId: string, currentStatus: string) => {
    setUpdating(taskId)
    const supabase = createClient()
    const newStatus = currentStatus === 'done' ? 'pending' : 'done'
    
    await supabase
      .from('compliance_tasks')
      .update({ status: newStatus })
      .eq('id', taskId)
    
    await loadData()
    setUpdating(null)
  }

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const employeesWithProgress = data.employees.map((employee: any) => {
    const employeeTasks = data.tasks.filter((task: any) => task.employee_id === employee.id) ?? []
    const completedCount = employeeTasks.filter((task: any) => task.status === 'done').length
    const progress = employeeTasks.length ? Math.round((completedCount / employeeTasks.length) * 100) : 0
    return { employee, tasks: employeeTasks, taskCount: employeeTasks.length, completedCount, progress }
  })

  return (
    <section className="space-y-8 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">Employee roster</p>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-[var(--color-text-primary)]">Employees</h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl font-light">Review onboarding progress and compliance completion for every hire.</p>
        </div>
        <Link href="/dashboard/employees/new" className="btn-primary w-full sm:w-auto">
          Add Employee
        </Link>
      </div>

      {employeesWithProgress.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-[var(--color-text-secondary)] mb-6 font-light">No employees added yet.</p>
          <Link href="/dashboard/employees/new" className="btn-primary">
            Add your first employee
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {employeesWithProgress.map(({ employee, tasks, taskCount, completedCount, progress }: any) => (
            <div key={employee.id} className="glass-card overflow-hidden group hover:border-[var(--color-accent)] transition-all duration-300">
              <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Employee Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">{employee.full_name}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">{employee.position}</p>
                    </div>
                    <span className={badgeClass(taskCount === completedCount ? 'done' : 'pending')}>
                      {taskCount === completedCount ? 'Fully Compliant' : 'Onboarding'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)] font-light">
                    <div className="flex items-center gap-2">
                      <span>📅</span> Joined {new Date(employee.start_date).toLocaleDateString('en-MY')}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💰</span> RM {employee.monthly_salary?.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full lg:w-48 xl:w-64">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-[var(--color-text-secondary)] font-medium uppercase tracking-tighter">Compliance Progress</span>
                    <span className="text-[var(--color-accent)] font-bold">{progress}%</span>
                  </div>
                  <div className="w-full rounded-full bg-[var(--color-border)] h-1.5 overflow-hidden">
                    <div 
                      style={{ width: `${progress}%` }} 
                      className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500 shadow-[0_0_10px_rgba(0,229,160,0.4)]"
                    ></div>
                  </div>
                </div>

                {/* Task Checklist */}
                <div className="lg:border-l border-[var(--color-border)] lg:pl-8 flex flex-wrap gap-2">
                  {tasks.map((task: any) => (
                    <button
                      key={task.id}
                      disabled={updating === task.id}
                      onClick={() => toggleTask(task.id, task.status)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                        task.status === 'done' 
                        ? 'bg-[rgba(0,229,160,0.1)] text-[var(--color-accent)] border border-[rgba(0,229,160,0.2)]' 
                        : 'bg-[var(--surface)] text-[var(--color-text-secondary)] border border-[var(--border)] hover:border-[var(--color-accent)]'
                      } ${updating === task.id ? 'opacity-50' : ''}`}
                    >
                      {updating === task.id ? '...' : (task.status === 'done' ? '✓ ' : '') + task.task_name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
