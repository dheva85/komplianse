import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  const body = await request.json()
  const { employeeName, ownerEmail } = body as { employeeName?: string; ownerEmail?: string }

  if (!ownerEmail) {
    return NextResponse.json({ error: 'Missing owner email address.' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Resend API key is not configured.' }, { status: 500 })
  }

  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: 'KomplianSE <no-reply@komplianse.com>',
      to: ownerEmail,
      subject: `New employee added: ${employeeName ?? 'New hire'}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0b0f0e;">
          <h1>New employee onboarded</h1>
          <p>${employeeName ?? 'A new employee'} has been successfully added to your compliance dashboard.</p>
          <p>EPF, SOCSO, EIS, contract, and offer letter tasks were created automatically.</p>
          <p style="margin-top: 1rem;">Visit your <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://komplianse.vercel.app'}/dashboard">dashboard</a> to review the compliance checklist.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to send notification email.' }, { status: 500 })
  }
}
