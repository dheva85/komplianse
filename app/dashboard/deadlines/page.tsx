import { createClient } from '@/lib/supabase/server'

const badgeClass = (status: string) =>
  status === 'done'
    ? 'badge badge-done'
    : status === 'pending'
    ? 'badge badge-pending'
    : 'badge badge-overdue'

const formatDaysRemaining = (value: string) => {
  const due = new Date(value)
  const today = new Date()
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return `Overdue by ${Math.abs(diff)}d`
  if (diff === 0) return 'Due today'
  return `${diff}d remaining`
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export default async function DeadlinesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_user_id', user.id)
    .single()

  const companyId = company?.id ?? null

  const { data: deadlines } = await supabase
    .from('deadlines')
    .select('*')
    .eq('company_id', companyId)
    .order('due_date', { ascending: true })

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">Deadlines</p>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)]">Upcoming statutory dates</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl">Keep an eye on EPF, SOCSO and SSM due dates so your company stays compliant.</p>
      </div>

      {deadlines?.length ? (
        <div className="grid gap-4">
          {deadlines.map((deadline: any) => (
            <div key={deadline.id} className="glass-card p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{deadline.title}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{formatDate(deadline.due_date)}</p>
                </div>
                <div className={badgeClass(deadline.status)}>{deadline.status}</div>
              </div>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{formatDaysRemaining(deadline.due_date)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 text-center text-[var(--color-text-secondary)]">
          No deadlines found yet. Add employees to generate compliance reminders automatically.
        </div>
      )}
    </section>
  )
}
