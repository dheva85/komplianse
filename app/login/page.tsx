'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        console.log('User already logged in, redirecting...')
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router])

  const handleDemoLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: 'demo@komplianse.com',
        password: 'password123',
        options: {
          data: {
            company_name: 'Demo Corporation',
            owner_name: 'Demo Admin',
          }
        }
      })
      
      if (error && error.code === '23505') {
        await supabase.auth.signInWithPassword({
          email: 'demo@komplianse.com',
          password: 'password123'
        })
      }
      
      router.push('/dashboard')
    } catch (err) {
      setError('Demo login failed. Please try resetting the demo data.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (err: unknown) {
      console.error('Login Error:', err)
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message + '. Please check your credentials or reset the demo.')
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
            Welcome Back
          </h1>
          <p className="text-sm text-[var(--muted)] text-center mb-8 font-light">
            Log in to your compliance dashboard
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
              <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Email Address
              </label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-5 py-3.5 text-[var(--text)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="Enter your password"
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
                  Processing...
                </span>
              ) : (
                'Log In →'
              )}
            </button>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn-ghost w-full justify-center py-4 text-xs tracking-widest uppercase font-bold"
            >
              Quick Login (Demo Mode)
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--muted)] font-light">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[var(--accent)] hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
