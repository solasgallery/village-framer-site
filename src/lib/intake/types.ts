export type IntakeStep =
  | 'nimble_contact'
  | 'nimble_opportunity'
  | 'nimble_task'
  | 'brevo_acknowledgment'
  | 'brevo_notification'

export type StepState = {
  status: 'pending' | 'completed' | 'failed'
  externalId?: string
  detail?: string
  completedAt?: string
}

export interface Inquiry {
  submissionId: string
  submittedAt: string
  startedAt: number
  brand: 'Salado Village Framer'
  formName: 'SVF contact'
  inquiryType: 'Framing inquiry'
  sourceChannel: 'website'
  sourceUrl: string
  name: string
  email: string
  phone: string
  message: string
  marketingConsent: false
  utmSource: string
  utmMedium: string
  utmCampaign: string
}

export interface AuditRecord {
  submissionId: string
  status: 'processing' | 'retry_pending' | 'completed'
  inquiry: Inquiry
  ipHash: string
  turnstile: {
    success: true
    hostname?: string
    action?: string
  }
  createdAt: string
  updatedAt: string
  attempts: number
  followUpDue: string
  steps: Record<IntakeStep, StepState>
  lastError?: string
}

export interface RejectedAuditRecord {
  submissionId: string
  status: 'rejected'
  reason: string
  ipHash: string
  emailHash?: string
  createdAt: string
}

export interface ParsedInquiry {
  inquiry?: Inquiry
  honeypot: string
  turnstileToken: string
  errors: string[]
}

export interface NimbleResult {
  contactId: string
  match: 'email' | 'phone' | 'email_and_phone' | 'created'
}

export class IntakeError extends Error {
  constructor(
    message: string,
    readonly retryable: boolean,
    readonly publicMessage = 'We could not confirm your inquiry. Please try again.'
  ) {
    super(message)
    this.name = 'IntakeError'
  }
}
