import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY || ''
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@solasgallery.com'

// Brevo list ID for website inquiries (create this list in Brevo, or use default)
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID) || 2

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, source } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      )
    }

    // 1. Create/update contact in Brevo
    const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name.split(' ')[0],
          LASTNAME: name.split(' ').slice(1).join(' ') || '',
          SMS: phone || '',
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    })

    // Contact creation might return 201 (created) or 204 (updated) — both are fine
    if (!contactRes.ok && contactRes.status !== 409) {
      console.error('Brevo contact error:', await contactRes.text())
    }

    // 2. Send notification email to Tim via Brevo transactional
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: 'Village Framer Website',
          email: 'noreply@saladovillageframer.com',
        },
        to: [{ email: NOTIFICATION_EMAIL, name: 'Tim Flanagan' }],
        subject: `New inquiry from ${name} — ${source || 'Website'}`,
        htmlContent: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="font-size: 24px; color: #1C1C1A; margin-bottom: 24px;">New Website Inquiry</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Name</td>
                <td style="padding: 8px 0; color: #1C1C1A;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                <td style="padding: 8px 0; color: #1C1C1A;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              ${phone ? `<tr>
                <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
                <td style="padding: 8px 0; color: #1C1C1A;"><a href="tel:${phone}">${phone}</a></td>
              </tr>` : ''}
              <tr>
                <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Source</td>
                <td style="padding: 8px 0; color: #1C1C1A;">${source || 'Website'}</td>
              </tr>
              ${message ? `<tr>
                <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Message</td>
                <td style="padding: 8px 0; color: #1C1C1A;">${message}</td>
              </tr>` : ''}
            </table>
            <hr style="border: none; border-top: 1px solid #C4AE8A; margin: 24px 0;" />
            <p style="font-size: 12px; color: #999;">This inquiry was submitted through saladovillageframer.com</p>
          </div>
        `,
      }),
    })

    if (!emailRes.ok) {
      console.error('Brevo email error:', await emailRes.text())
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inquiry API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
