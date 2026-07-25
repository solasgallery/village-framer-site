import { fetchJson } from './http'
import { IntakeError, type Inquiry, type NimbleResult } from './types'
import { normalizePhone, splitName } from './validation'

interface NimbleContact {
  id: string
}

interface NimbleContactSearch {
  resources?: NimbleContact[]
}

interface NimbleContactCreate {
  id?: string
}

interface NimbleDealCreate {
  deal_id?: string
  id?: string
}

interface NimbleDealSearch {
  resources?: Array<{
    deal_id?: string
    id?: string
  }>
}

interface NimblePipeline {
  pipeline_id?: string
  name?: string
  stages?: Array<{ stage_id?: string; name?: string }>
}

interface NimbleTaskCreate {
  task_id?: string
  id?: string
}

interface BrevoSend {
  messageId?: string
}

function nimbleHeaders(accessToken: string): HeadersInit {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

async function searchNimble(
  accessToken: string,
  field: 'email' | 'phone',
  value: string
) {
  const query = JSON.stringify({
    and: [
      { [field]: { is: value } },
      { 'record type': { is: 'person' } },
    ],
  })
  const url = new URL('https://app.nimble.com/api/v1/contacts')
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', '10')
  url.searchParams.set('fields', 'email,phone,first name,last name')
  const result = await fetchJson<NimbleContactSearch>(
    url.toString(),
    { headers: nimbleHeaders(accessToken), cache: 'no-store' },
    `Nimble exact ${field} search`
  )
  return (result.resources || []).map((contact) => contact.id)
}

export async function findOrCreateNimbleContact(input: {
  inquiry: Inquiry
  accessToken: string
  ownerId: string
}): Promise<NimbleResult> {
  const emailIds = await searchNimble(input.accessToken, 'email', input.inquiry.email)
  const phoneIds = input.inquiry.phone
    ? await searchNimble(
        input.accessToken,
        'phone',
        normalizePhone(input.inquiry.phone)
      )
    : []
  const ids = new Set([...emailIds, ...phoneIds])

  if (emailIds.length > 1 || phoneIds.length > 1 || ids.size > 1) {
    throw new IntakeError(
      `Ambiguous Nimble contact match for submission ${input.inquiry.submissionId}`,
      false,
      'We received your inquiry but need to review an existing record. Please call (254) 613-6123 if your request is urgent.'
    )
  }

  if (ids.size === 1) {
    return {
      contactId: Array.from(ids)[0],
      match:
        emailIds.length && phoneIds.length
          ? 'email_and_phone'
          : emailIds.length
            ? 'email'
            : 'phone',
    }
  }

  const { firstName, lastName } = splitName(input.inquiry.name)
  const fields: Record<string, Array<{ value: string; modifier: string }>> = {
    'first name': [{ value: firstName, modifier: '' }],
    email: [{ value: input.inquiry.email, modifier: 'other' }],
  }
  if (lastName) fields['last name'] = [{ value: lastName, modifier: '' }]
  if (input.inquiry.phone) {
    fields.phone = [
      { value: normalizePhone(input.inquiry.phone), modifier: 'mobile' },
    ]
  }

  const result = await fetchJson<NimbleContactCreate>(
    'https://app.nimble.com/api/v1/contact',
    {
      method: 'POST',
      headers: nimbleHeaders(input.accessToken),
      body: JSON.stringify({
        record_type: 'person',
        owner_id: input.ownerId,
        fields,
        tags: 'SVF inquiry',
      }),
    },
    'Nimble contact creation'
  )
  if (!result.id) {
    throw new IntakeError('Nimble contact creation returned no contact ID', true)
  }
  return { contactId: result.id, match: 'created' }
}

export async function createNimbleOpportunity(input: {
  inquiry: Inquiry
  contactId: string
  accessToken: string
  ownerId: string
  pipelineId: string
  stageId: string
}): Promise<string> {
  const pipeline = await fetchJson<NimblePipeline>(
    `https://app.nimble.com/api/v2/deals/pipelines/${encodeURIComponent(input.pipelineId)}`,
    { headers: nimbleHeaders(input.accessToken), cache: 'no-store' },
    'Nimble pipeline verification'
  )
  const stage = (pipeline.stages || []).find(
    (candidate) => candidate.stage_id === input.stageId
  )
  if (
    pipeline.pipeline_id !== input.pipelineId ||
    pipeline.name !== 'Solas Client Opportunities' ||
    !stage ||
    stage.name !== 'New inquiry'
  ) {
    throw new IntakeError(
      'Configured Nimble pipeline or stage does not match the approved names',
      false
    )
  }

  const existingUrl = new URL('https://app.nimble.com/api/v2/deals')
  existingUrl.searchParams.set('keyword', input.inquiry.submissionId)
  existingUrl.searchParams.set('per_page', '10')
  const existing = await fetchJson<NimbleDealSearch>(
    existingUrl.toString(),
    { headers: nimbleHeaders(input.accessToken), cache: 'no-store' },
    'Nimble opportunity idempotency search'
  )
  const existingIds = (existing.resources || [])
    .map((deal) => deal.deal_id || deal.id)
    .filter((id): id is string => Boolean(id))
  if (existingIds.length > 1) {
    throw new IntakeError(
      `Multiple Nimble opportunities contain submission ${input.inquiry.submissionId}`,
      false
    )
  }
  if (existingIds.length === 1) return existingIds[0]

  const campaign = [
    input.inquiry.utmSource,
    input.inquiry.utmMedium,
    input.inquiry.utmCampaign,
  ]
    .filter(Boolean)
    .join(' / ')
  const description = [
    `Brand: ${input.inquiry.brand}`,
    `Inquiry type: ${input.inquiry.inquiryType}`,
    `Form: ${input.inquiry.formName}`,
    `Source: ${input.inquiry.sourceUrl}`,
    `Submission ID: ${input.inquiry.submissionId}`,
    `Submitted: ${input.inquiry.submittedAt}`,
    `Marketing consent: no`,
    campaign ? `Campaign: ${campaign}` : '',
    '',
    input.inquiry.message || '(No message supplied)',
  ]
    .filter((line) => line !== '')
    .join('\n')

  const result = await fetchJson<NimbleDealCreate>(
    'https://app.nimble.com/api/v2/deals',
    {
      method: 'POST',
      headers: nimbleHeaders(input.accessToken),
      body: JSON.stringify({
        owner_id: input.ownerId,
        pipeline_id: input.pipelineId,
        stage_id: input.stageId,
        fields_values: {
          deal_name: [
            {
              value: `SVF framing inquiry — ${input.inquiry.name} — ${input.inquiry.submissionId}`,
            },
          ],
          description: [{ value: description }],
        },
        related_contacts: [
          {
            contact_id: input.contactId,
            note: `Website inquiry ${input.inquiry.submissionId}`,
          },
        ],
        tags: ['Salado Village Framer', 'Website inquiry'],
      }),
    },
    'Nimble opportunity creation'
  )
  const id = result.deal_id || result.id
  if (!id) throw new IntakeError('Nimble opportunity returned no ID', true)
  return id
}

export async function createNimbleTask(input: {
  inquiry: Inquiry
  contactId: string
  opportunityId: string
  followUpDue: string
  accessToken: string
  ownerId: string
  endpoint: string
}): Promise<string> {
  const result = await fetchJson<NimbleTaskCreate>(
    input.endpoint,
    {
      method: 'POST',
      headers: nimbleHeaders(input.accessToken),
      body: JSON.stringify({
        subject: `Respond to ${input.inquiry.name} — SVF framing inquiry`,
        notes: `Submission ${input.inquiry.submissionId}\n${input.inquiry.sourceUrl}`,
        due_date: input.followUpDue,
        assigned_to: input.ownerId,
        related_contacts: [input.contactId],
        related_deals: [input.opportunityId],
      }),
    },
    'Nimble follow-up task creation'
  )
  const id = result.task_id || result.id
  if (!id) throw new IntakeError('Nimble task returned no ID', true)
  return id
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

async function sendBrevo(input: {
  apiKey: string
  idempotencyKey: string
  senderEmail: string
  senderName: string
  to: { email: string; name?: string }
  replyTo: { email: string; name?: string }
  subject: string
  htmlContent: string
  textContent: string
  tags: string[]
}) {
  const result = await fetchJson<BrevoSend>(
    'https://api.brevo.com/v3/smtp/email',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': input.apiKey,
      },
      body: JSON.stringify({
        sender: { email: input.senderEmail, name: input.senderName },
        to: [input.to],
        replyTo: input.replyTo,
        subject: input.subject,
        htmlContent: input.htmlContent,
        textContent: input.textContent,
        tags: input.tags,
        headers: { 'Idempotency-Key': input.idempotencyKey },
      }),
    },
    'Brevo transactional email'
  )
  if (!result.messageId) {
    throw new IntakeError('Brevo returned no message ID', true)
  }
  return result.messageId
}

export async function sendAcknowledgment(input: {
  inquiry: Inquiry
  followUpDue: string
  apiKey: string
  senderEmail: string
  senderName: string
}): Promise<string> {
  const firstName = splitName(input.inquiry.name).firstName
  const due = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(input.followUpDue))
  const text = `Hello ${firstName},\n\nThank you for writing to Salado Village Framer. Your note has reached Cherie, and she will be in touch by ${due}.\n\nSalado Village Framer\n(254) 613-6123`

  return sendBrevo({
    apiKey: input.apiKey,
    idempotencyKey: `${input.inquiry.submissionId}-ack`,
    senderEmail: input.senderEmail,
    senderName: input.senderName,
    to: { email: input.inquiry.email, name: input.inquiry.name },
    replyTo: { email: 'cherie@solasgallery.com', name: 'Cherie Flanagan' },
    subject: 'We received your Salado Village Framer inquiry',
    textContent: text,
    htmlContent: `<div style="font-family:Georgia,serif;max-width:600px;margin:auto;padding:32px;color:#1c1c1a"><p>Hello ${escapeHtml(firstName)},</p><p>Thank you for writing to Salado Village Framer. Your note has reached Cherie, and she will be in touch by ${escapeHtml(due)}.</p><p style="margin-top:28px">Salado Village Framer<br><a href="tel:+12546136123">(254) 613-6123</a></p></div>`,
    tags: ['svf-inquiry-ack'],
  })
}

export async function sendInternalNotification(input: {
  inquiry: Inquiry
  followUpDue: string
  opportunityId: string
  apiKey: string
  senderEmail: string
  senderName: string
  notificationEmail: string
}): Promise<string> {
  const summary = [
    `New SVF framing inquiry`,
    `Name: ${input.inquiry.name}`,
    `Email: ${input.inquiry.email}`,
    input.inquiry.phone ? `Phone: ${input.inquiry.phone}` : '',
    `Follow-up due: ${input.followUpDue}`,
    `Submission: ${input.inquiry.submissionId}`,
    `Nimble opportunity: ${input.opportunityId}`,
    input.inquiry.message ? `Message: ${input.inquiry.message}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return sendBrevo({
    apiKey: input.apiKey,
    idempotencyKey: `${input.inquiry.submissionId}-notify`,
    senderEmail: input.senderEmail,
    senderName: input.senderName,
    to: { email: input.notificationEmail, name: 'Cherie Flanagan' },
    replyTo: { email: input.inquiry.email, name: input.inquiry.name },
    subject: `New SVF inquiry — ${input.inquiry.name}`,
    textContent: summary,
    htmlContent: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;white-space:pre-wrap">${escapeHtml(summary)}</div>`,
    tags: ['svf-inquiry-internal'],
  })
}
