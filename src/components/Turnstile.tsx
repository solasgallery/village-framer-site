'use client'

import Script from 'next/script'
import { useEffect, useId, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          action?: string
          appearance?: 'always' | 'execute' | 'interaction-only'
          callback: (token: string) => void
          'error-callback': () => void
          'expired-callback': () => void
        }
      ) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
  }
}

interface TurnstileProps {
  action: string
  onToken: (token: string) => void
  resetKey: number
}

export default function Turnstile({ action, onToken, resetKey }: TurnstileProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const reactId = useId()
  const containerId = `turnstile-${reactId.replace(/:/g, '')}`
  const widgetId = useRef<string | undefined>(undefined)

  function renderWidget() {
    if (!siteKey || !window.turnstile || widgetId.current) return

    widgetId.current = window.turnstile.render(`#${containerId}`, {
      sitekey: siteKey,
      action,
      appearance: 'interaction-only',
      callback: onToken,
      'error-callback': () => onToken(''),
      'expired-callback': () => onToken(''),
    })
  }

  useEffect(() => {
    if (resetKey > 0 && widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current)
      onToken('')
    }
  }, [onToken, resetKey])

  useEffect(() => {
    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current)
      }
    }
  }, [])

  if (!siteKey) {
    return (
      <p className="font-body text-xs text-red-500 text-center">
        This form is temporarily unavailable.
      </p>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderWidget}
        onReady={renderWidget}
      />
      <div id={containerId} className="flex min-h-16 justify-center" />
    </>
  )
}
