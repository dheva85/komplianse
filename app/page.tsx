'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Scroll reveal logic
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible')
          }, 80)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    reveals.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const supabase = createClient()
      const { error } = await supabase.from('waitlist').insert({ email })
      if (error) {
        if (error.code === '23505') {
          setMessage('You\'re already on the waitlist!')
        } else {
          throw error
        }
      } else {
        setMessage('You\'re on the list! We\'ll notify you when we launch.')
      }
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="landing-wrapper">
      {/* NAV */}
      <nav className="main-nav">
        <Link href="/" className="logo">Komplian<span>SE</span></Link>
        <ul className="nav-links">
          <li><a href="#problems">Problems</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><Link href="/login" style={{ marginRight: '16px' }}>Log In</Link></li>
          <li><Link href="/register" className="nav-cta">Register Now</Link></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>

        <div className="hero-badge">
          <span className="badge-dot"></span>
          Built for Malaysian SMEs
        </div>

        <h1>Stop drowning in<br/><em>compliance paperwork.</em></h1>

        <p>KomplianSE automates EPF, SOCSO, and LHDN registration, employee onboarding, and licence renewals — so you can focus on running your business.</p>

        <div className="hero-actions">
          <Link href="/register" className="btn-primary">Start Your Trial →</Link>
          <a href="#features" className="btn-ghost">See How It Works</a>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">RM 600K</div>
            <div className="stat-label">Max Cradle CIP Grant</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">1.2M+</div>
            <div className="stat-label">SMEs in Malaysia</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">3 hrs</div>
            <div className="stat-label">Saved per new hire</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">RM 50/mo</div>
            <div className="stat-label">Starting price</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          <span className="marquee-item">EPF Registration</span>
          <span className="marquee-item">SOCSO Compliance</span>
          <span className="marquee-item">LHDN Filing</span>
          <span className="marquee-item">Digital Contracts</span>
          <span className="marquee-item">Document Collection</span>
          <span className="marquee-item">Licence Renewal Alerts</span>
          <span className="marquee-item">Audit-Ready Records</span>
          <span className="marquee-item">Employee Onboarding</span>
          <span className="marquee-item">EPF Registration</span>
          <span className="marquee-item">SOCSO Compliance</span>
          <span className="marquee-item">LHDN Filing</span>
          <span className="marquee-item">Digital Contracts</span>
          <span className="marquee-item">Document Collection</span>
          <span className="marquee-item">Licence Renewal Alerts</span>
          <span className="marquee-item">Audit-Ready Records</span>
          <span className="marquee-item">Employee Onboarding</span>
        </div>
      </div>

      {/* PROBLEMS */}
      <section className="lp-section problem-section" id="problems">
        <div className="section-label reveal">The Problem</div>
        <h2 className="section-title reveal">Most SMEs manage compliance the hard way</h2>
        <p className="section-sub reveal">WhatsApp, Excel, and physical files — it's how thousands of Malaysian businesses track their most critical admin. Until something goes wrong.</p>

        <div className="problem-grid reveal">
          <div className="problem-card">
            <div className="problem-icon">📋</div>
            <h3>Manual paperwork</h3>
            <p>Every new hire triggers a mountain of forms — EPF, SOCSO, EIS, employment contracts. All done by hand, prone to errors.</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">⏰</div>
            <h3>Missed deadlines</h3>
            <p>Licence renewals, contribution payments, tax submissions — it's easy to forget until a penalty notice arrives.</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">📁</div>
            <h3>Disorganised records</h3>
            <p>Documents scattered across folders, WhatsApp chats, and email — impossible to find when auditors come knocking.</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">💸</div>
            <h3>Expensive consultants</h3>
            <p>Outsourcing to HR firms or consultants costs RM3,000–8,000 per year — way too much for a 5-person business.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-section" id="features">
        <div className="section-label reveal">How It Works</div>
        <h2 className="section-title reveal">Everything your business needs, in one place</h2>
        <p className="section-sub reveal">From day one of hiring to annual compliance — KomplianSE handles the admin so you don't have to.</p>

        <div className="features-grid">
          <div className="feature-card large reveal">
            <div>
              <div className="feature-icon">🧑💼</div>
              <h3>Smart Employee Onboarding</h3>
              <p>Add a new hire and KomplianSE automatically sends them a form to collect their IC, bank details, and emergency contacts. Then generates their employment contract, offer letter, and compliance registrations — ready to sign digitally.</p>
              <br/>
              <p style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 500 }}>Saves ~3 hours per new hire</p>
            </div>
            <div className="feature-visual">
              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>New hire checklist</div>
              <div className="checklist-item"><span className="check">✓</span> IC & personal details collected</div>
              <div className="checklist-item"><span className="check">✓</span> Employment contract generated</div>
              <div className="checklist-item"><span className="check">✓</span> EPF registration submitted</div>
              <div className="checklist-item"><span className="check">✓</span> SOCSO registration submitted</div>
              <div className="checklist-item"><span className="check pending"></span> EIS registration — pending</div>
              <div className="checklist-item"><span className="check pending"></span> Digital signature — pending</div>
            </div>
          </div>

          <div className="feature-card reveal">
            <div className="feature-number">02</div>
            <div className="feature-icon">🔔</div>
            <h3>Deadline & Renewal Alerts</h3>
            <p>Never miss an SSM renewal, EPF contribution deadline, or licence expiry again. Get reminders 30, 14, and 3 days before — via email or WhatsApp.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-number">03</div>
            <div className="feature-icon">📂</div>
            <h3>Audit-Ready Document Vault</h3>
            <p>All employee documents, contracts, and compliance records stored securely and organised. One-click export when auditors ask for records.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-number">04</div>
            <div className="feature-icon">📊</div>
            <h3>Compliance Dashboard</h3>
            <p>See the health of your business compliance at a glance — what's done, what's overdue, and what needs attention this month.</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="lp-section pricing-section" id="pricing">
        <div className="section-label reveal">Pricing</div>
        <h2 className="section-title reveal">Affordable for every SME</h2>
        <p className="section-sub reveal">No hidden fees. Cancel anytime. Less than the cost of one penalty notice.</p>

        <div className="pricing-grid reveal">
          <div className="pricing-card">
            <div className="plan-name">Spark</div>
            <div className="plan-price">RM 49 <span>/ mo</span></div>
            <div className="plan-desc">For solo traders & micro businesses</div>
            <ul className="plan-features">
              <li>Up to 5 employees</li>
              <li>Onboarding forms</li>
              <li>Contract generation</li>
              <li>Deadline alerts</li>
              <li>Document vault (2GB)</li>
            </ul>
            <Link href="/register" className="btn-ghost" style={{ display: 'block', textAlign: 'center' }}>Get Started</Link>
          </div>

          <div className="pricing-card featured">
            <div className="featured-tag">Most Popular</div>
            <div className="plan-name">Growth</div>
            <div className="plan-price">RM 129 <span>/ mo</span></div>
            <div className="plan-desc">For growing SMEs with a team</div>
            <ul className="plan-features">
              <li>Up to 30 employees</li>
              <li>All Spark features</li>
              <li>EPF/SOCSO auto-submission</li>
              <li>WhatsApp reminders</li>
              <li>Multi-branch support</li>
              <li>Compliance dashboard</li>
            </ul>
            <Link href="/register" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>Get Started</Link>
          </div>

          <div className="pricing-card">
            <div className="plan-name">Scale</div>
            <div className="plan-price">RM 299 <span>/ mo</span></div>
            <div className="plan-desc">For established businesses</div>
            <ul className="plan-features">
              <li>Unlimited employees</li>
              <li>All Growth features</li>
              <li>Dedicated account manager</li>
              <li>Custom contract templates</li>
              <li>API access</li>
              <li>Priority support</li>
            </ul>
            <Link href="/register" className="btn-ghost" style={{ display: 'block', textAlign: 'center' }}>Contact Us</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-section cta-section" id="cta">
        <h2 className="reveal">Ready to simplify<br/>your compliance?</h2>
        <p className="reveal">Join the waitlist and get 3 months free when we launch. No credit card needed.</p>
        <form onSubmit={handleWaitlist} className="reveal" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com" 
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '14px 20px',
              color: 'var(--text)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.95rem',
              width: '280px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }} 
            required
          />
          <button type="submit" disabled={status === 'loading'} className="btn-primary">
            {status === 'loading' ? 'Joining...' : 'Join Waitlist →'}
          </button>
        </form>
        {message && (
          <p className="reveal" style={{ marginTop: '16px', fontSize: '0.85rem', color: status === 'success' ? 'var(--accent)' : 'red' }}>
            {message}
          </p>
        )}
        <p style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--muted)' }} className="reveal">🔒 No spam. Unsubscribe anytime.</p>
      </section>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="logo">Komplian<span>SE</span></div>
        <p>© 2026 KomplianSE. Built for Malaysian businesses.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  )
}
