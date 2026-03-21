'use client'

import { useState } from 'react'

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

  const textColor = dark ? 'text-cream' : 'text-charcoal'
  const mutedColor = dark ? 'text-cream/40' : 'text-charcoal/40'
  const inputColor = dark ? 'text-cream' : 'text-charcoal'
  const borderColor = dark ? 'border-cream/20 focus:border-cream/60' : 'border-stone/30 focus:border-stone'
  const btnBorder = dark ? 'border-cream/40 hover:border-cream text-cream' : 'border-stone hover:border-charcoal text-charcoal'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement)?.value || '',
      message: (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || '',
      source,
    }

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
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
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={status === 'sending'}
            className={`font-display text-sm tracking-[0.12em] uppercase border-b ${btnBorder} pb-1 transition-colors disabled:opacity-50`}
          >
            {status === 'sending' ? 'Sending...' : 'Send inquiry →'}
          </button>
        </div>
        {status === 'error' && (
          <p className="font-body text-xs text-red-500 text-center mt-4">
            Something went wrong. Please email us directly at solasgallery@gmail.com
          </p>
        )}
      </form>
    </div>
  )
}
