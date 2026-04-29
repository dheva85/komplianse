'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const complianceTasks = ['EPF', 'SOCSO', 'EIS', 'Contract', 'Offer Letter']

export default function NewEmployeePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    icNumber: '',
    position: '',
    startDate: '',
    monthlySalary: '',
    bankDetails: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const createDeadline = (startDate: string, offsetDays: number) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + offsetDays)
    return date.toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData.user) {
        throw new Error('Could not verify your session. Please log in again.')
      }

      let { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_user_id', authData.user.id)
        .single()

      // Self-healing: If no company exists, create one automatically
      if (!company) {
        const { data: newCompany, error: createError } = await supabase
          .from('companies')
          .insert({
            owner_user_id: authData.user.id,
            company_name: 'My Company', // Default name
            owner_name: authData.user.user_metadata?.owner_name || 'Owner',
          })
          .select()
          .single()

        if (createError) throw new Error('Failed to create company profile: ' + createError.message)
        company = newCompany
      }

      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .insert([
          {
            company_id: company.id,
            full_name: form.fullName,
            ic_number: form.icNumber,
            position: form.position,
            start_date: form.startDate,
            monthly_salary: Number(form.monthlySalary),
            bank_details: form.bankDetails,
          },
        ])
        .select()
        .single()

      if (employeeError || !employee) {
        throw employeeError || new Error('Failed to create employee')
      }

      await supabase.from('compliance_tasks').insert(
        complianceTasks.map((taskName: any) => ({
          company_id: company.id,
          employee_id: employee.id,
          task_name: taskName,
          status: 'pending',
        }))
      )

      await supabase.from('deadlines').insert([
        {
          company_id: company.id,
          title: 'EPF registration',
          due_date: createDeadline(form.startDate, 14),
          status: 'pending',
        },
        {
          company_id: company.id,
          title: 'SOCSO registration',
          due_date: createDeadline(form.startDate, 21),
          status: 'pending',
        },
        {
          company_id: company.id,
          title: 'SSM filing reminder',
          due_date: createDeadline(form.startDate, 30),
          status: 'pending',
        },
      ])

      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeName: form.fullName,
            ownerEmail: authData.user.email,
          }),
        })
      } catch {
        // Ignore notification failures for onboarding flow.
      }

      setMessage('Employee added successfully. Compliance checklist created.')
      router.push('/dashboard/employees')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while adding the employee.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">New hire</p>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)]">Add employee</h1>
        <p className="text-[var(--color-text-secondary)]">Capture onboarding details and generate an automatic compliance checklist.</p>
      </div>

      <div className="glass-card p-8">
        {error && <div className="mb-4 rounded-2xl border border-[var(--color-danger)] bg-[rgba(255,77,106,0.1)] p-4 text-sm text-[var(--color-danger)]">{error}</div>}
        {message && <div className="mb-4 rounded-2xl border border-[var(--color-accent)] bg-[rgba(0,229,160,0.12)] p-4 text-sm text-[var(--color-accent)]">{message}</div>}

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Ali bin Abu"
            />
          </div>

          <div>
            <label htmlFor="icNumber" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              IC number
            </label>
            <input
              id="icNumber"
              name="icNumber"
              value={form.icNumber}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="920101-01-1234"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Position
            </label>
            <input
              id="position"
              name="position"
              value={form.position}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="HR Executive"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Start date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="monthlySalary" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Monthly salary (RM)
            </label>
            <input
              id="monthlySalary"
              name="monthlySalary"
              type="number"
              step="0.01"
              min="0"
              value={form.monthlySalary}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="3000"
            />
          </div>

          <div>
            <label htmlFor="bankDetails" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Bank details
            </label>
            <textarea
              id="bankDetails"
              name="bankDetails"
              value={form.bankDetails}
              onChange={handleChange}
              required
              className="input-field min-h-[120px] resize-none"
              placeholder="Maybank 1234567890"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Saving employee…' : 'Add employee'}
          </button>
        </form>
      </div>
    </section>
  )
}
