'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    companyName: '',
    ownerName: '',
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            company_name: form.companyName,
            owner_name: form.ownerName,
          },
        },
      })

      if (authError) throw authError

      // Create company record
      if (authData.user) {
        const { error: companyError } = await supabase.from('companies').insert({
          owner_user_id: authData.user.id,
          company_name: form.companyName,
          owner_name: form.ownerName,
          plan: 'Growth', // Default to Growth as in user's popular plan
        })
        if (companyError) throw companyError
      }

      router.push('/dashboard')
    } catch (err: unknown) {
      console.error('Registration Error:', err)
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message + '. Please try refreshing or resetting the demo.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('This will clear all mock data in your browser. Continue?')) {
      localStorage.clear()
      document.cookie = "demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-[var(--bg)]">
      {/* Background decoration */}
      <div className="hero-glow"></div>
      <div className="hero-glow2"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        {/* Logo */}
        <Link href="/" className="logo block text-center mb-10 text-3xl">
          Komplian<span>SE</span>
        </Link>

        <div className="glass-card p-10">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-2 text-center tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-[var(--muted)] text-center mb-8 font-light">
            Start managing compliance in under 5 minutes
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[rgba(255,77,106,0.1)] border border-[rgba(255,77,106,0.2)] text-[#ff4d6a] text-sm">
              <p>{error}</p>
              <button 
                onClick={handleReset}
                className="mt-2 text-xs underline font-semibold hover:text-[#ff3d5a]"
              >
                Reset Demo Data
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="companyName" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={form.companyName}
                onChange={handleChange}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-5 py-3.5 text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="e.g. Syarikat Ali Sdn Bhd"
              />
            </div>
            <div>
              <label htmlFor="ownerName" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Owner / Admin Name
              </label>
              <input
                id="ownerName"
                name="ownerName"
                type="text"
                required
                value={form.ownerName}
                onChange={handleChange}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-5 py-3.5 text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="e.g. Ali bin Abu"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-5 py-3.5 text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="ali@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-5 py-3.5 text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="Minimum 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 justify-center py-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0b0f0e] border-t-transparent rounded-full animate-spin"></span>
                  Creating account...
                </span>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--muted)] font-light">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--accent)] hover:underline font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
