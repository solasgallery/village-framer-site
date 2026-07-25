'use client'

import { useCallback, useRef, useState } from 'react'
import Turnstile from '@/components/Turnstile'

interface InquiryFormProps {
  source: string
  dark?: boolean
  headline?: string
  subtext?: string
  messagePlaceholder?: string
}

export default function InquiryForm({
  source,
  dark = false,
  headline = 'Begin here.',
  subtext,
  messagePlaceholder = 'Tell us what you have in mind.',
}: InquiryFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const submissionId = useRef(crypto.randomUUID())
  const startedAt = useRef(Date.now())
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), [])

  const textColor = dark ? 'text-cream' : 'text-charcoal'
  const mutedColor = dark ? 'text-cream/40' : 'text-charcoal/40'
  const inputColor = dark ? 'text-cream' : 'text-charcoal'
  const borderColor = dark ? 'border-cream/20 focus:border-cream/60' : 'border-stone/30 focus:border-stone'
  const btnBorder = dark ? 'border-cream/40 hover:border-cream text-cream' : 'border-stone hover:border-charcoal text-charcoal'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage('')

    if (!turnstileToken) {
      setStatus('error')
      setErrorMessage('Please complete the verification and try again.')
      return
    }

    setStatus('sending')

    const form = e.currentTarget
    const data = {
      submission_id: submissionId.current,
      submitted_at: new Date().toISOString(),
      started_at: startedAt.current,
      brand: 'Salado Village Framer',
      form_name: 'SVF contact',
      inquiry_type: 'Framing inquiry',
      source_channel: 'website',
      source_url: window.location.href,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement)?.value || '',
      message: (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || '',
      website: (form.elements.namedItem('website') as HTMLInputElement)?.value || '',
      turnstile_token: turnstileToken,
      marketing_consent: false,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
      source,
    }

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json().catch(() => ({}))

      if (res.ok && result.success === true && result.submission_id === submissionId.current) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
        setErrorMessage(
          typeof result.error === 'string'
            ? result.error
            : 'We could not confirm your inquiry. Please try again.'
        )
        setTurnstileResetKey((key) => key + 1)
      }
    } catch {
      setStatus('error')
      setErrorMessage('We could not confirm your inquiry. Please try again.')
      setTurnstileResetKey((key) => key + 1)
    }
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-12">
        <h3 className={`font-display text-2xl ${textColor} mb-4`}>Thank you.</h3>
        <p className={`font-body text-sm ${dark ? 'text-cream/50' : 'text-charcoal/50'}`}>
          We received your inquiry and will be in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      {headline && (
        <h2 className={`font-display text-3xl ${textColor} text-center mb-4`}>
          {headline}
        </h2>
      )}
      {subtext && (
        <p className={`font-body text-sm ${dark ? 'text-cream/50' : 'text-charcoal/50'} text-center mb-10`}>
          {subtext}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="absolute left-[-10000px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div>
          <label className={`font-body text-xs ${mutedColor} tracking-[0.1em] uppercase block mb-2`}>
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            className={`w-full bg-transparent border-b ${borderColor} outline-none py-3 font-body text-sm ${inputColor} transition-colors`}
          />
        </div>
        <div>
          <label className={`font-body text-xs ${mutedColor} tracking-[0.1em] uppercase block mb-2`}>
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className={`w-full bg-transparent border-b ${borderColor} outline-none py-3 font-body text-sm ${inputColor} transition-colors`}
          />
        </div>
        <div>
          <label className={`font-body text-xs ${mutedColor} tracking-[0.1em] uppercase block mb-2`}>
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            className={`w-full bg-transparent border-b ${borderColor} outline-none py-3 font-body text-sm ${inputColor} transition-colors`}
          />
        </div>
        <div>
          <label className={`font-body text-xs ${mutedColor} tracking-[0.1em] uppercase block mb-2`}>
            {messagePlaceholder}
          </label>
          <textarea
            name="message"
            rows={4}
            className={`w-full bg-transparent border-b ${borderColor} outline-none py-3 font-body text-sm ${inputColor} transition-colors resize-none`}
          />
        </div>
        <Turnstile
          action="svf_contact"
          onToken={handleTurnstileToken}
          resetKey={turnstileResetKey}
        />
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={status === 'sending' || !turnstileToken}
            className={`font-display text-sm tracking-[0.12em] uppercase border-b ${btnBorder} pb-1 transition-colors disabled:opacity-50`}
          >
            {status === 'sending' ? 'Sending...' : 'Send inquiry →'}
          </button>
        </div>
        {status === 'error' && (
          <p className="font-body text-xs text-red-500 text-center mt-4">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  )
}
