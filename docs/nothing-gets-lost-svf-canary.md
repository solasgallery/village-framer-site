# Nothing Gets Lost — SVF Canary Operations

## Scope

This change applies only to the Salado Village Framer `/contact` form. It does
not migrate trade, HUB, Sister Wisdoms, Archive Access, Saturday Table, or Solas
forms. It does not change DNS, Google Workspace, nameservers, or production.

## Required pre-production configuration

Copy the names from `.env.example` into the Vercel preview environment only.
Do not place secret values in source control.

1. Create separate Turnstile test/preview and production widgets. The
   production widget must allow only `saladovillageframer.com` and
   `www.saladovillageframer.com`.
2. Attach one Upstash Redis database to the existing `village-framer-site`
   project. This is the only durable mechanism: it stores audit records,
   processing locks, rate-limit counters, and the retry set.
3. Confirm the immutable Nimble IDs:
   - Cherie's user ID;
   - `Solas Client Opportunities` pipeline ID;
   - `New inquiry` stage ID.
4. Nimble's current signed-in app bundle confirms task creation at
   `/api/v1/tasks` with `subject`, `notes`, `assigned_to`,
   `related_contacts`, `related_deals`, and a timezone-less `due_date`.
   Nimble's published API does not currently document this endpoint, so
   `NIMBLE_TASK_ENDPOINT` remains isolated and a preview test record must
   confirm the response ID and relationships before production approval.
5. Use the existing authenticated Solas sender
   `Salado Village Framer <cherie@solasgallery.com>` for the canary. This avoids
   any DNS work. Sender-domain changes require their own change sheet.
6. Generate a random `INTAKE_HASH_SECRET` and `CRON_SECRET`.

## Processing contract

The browser sends one UUID submission ID and never receives provider secrets.
The server:

1. validates fields, honeypot, minimum time, rate, disposable domains, source,
   and Turnstile;
2. creates a durable audit record;
3. exact-matches Nimble email and phone;
4. stops on ambiguity and never merges;
5. leaves matched contact identity untouched, or creates a new contact;
6. creates the opportunity, dated task, acknowledgment, and one internal
   notification;
7. returns success only after all five external steps have IDs.

Ordinary service inquiries are not added to a Brevo list.

## Retry and reconciliation

Every external step is saved immediately. A failed record is placed in the
`intake:retry` set. Repeating the browser request with the same submission ID,
or calling the protected endpoint below, skips confirmed steps:

```text
POST /api/intake/retry
Authorization: Bearer <CRON_SECRET>
```

The endpoint processes at most ten records per call. No production cron is
added by this PR; scheduling it is a separate deployment/configuration choice.

Audit retention:

- accepted submissions: 90 days;
- rejected attempts: 30 days;
- raw IP addresses are not stored; an HMAC hash is stored for abuse controls.

## Canary acceptance matrix

Run on a preview deployment with provider test records and Brevo sandbox mode
where applicable:

- valid new contact;
- exact email match;
- exact phone match;
- ambiguous/duplicate contact;
- missing required field;
- invalid and disposable email;
- honeypot;
- completion under three seconds;
- Turnstile failure, expiry, and hostname/action mismatch;
- six requests from one hashed IP within fifteen minutes;
- Nimble search, contact, opportunity, and task failures;
- Brevo acknowledgment and internal-notification failures;
- retry after each partial failure;
- mobile form layout;
- GTM/GA4/Meta/Brevo page tracker regression;
- exactly one opportunity, task, acknowledgment, and internal notification;
- no Brevo marketing-list membership change.

Do not promote the canary until the audit record, Nimble objects, task due date,
Brevo message IDs, on-page confirmation, and analytics are all verified.

## Rollback

Application rollback is one Vercel deployment rollback to the immediately
preceding production deployment, or a revert of this PR. No DNS rollback is
needed because this change contains no DNS changes.

After rollback:

1. leave the audit database intact;
2. disable any retry schedule before reverting code;
3. export all `processing` and `retry_pending` records;
4. reconcile their submission IDs manually against Nimble and Brevo;
5. do not delete provider records created by successful steps;
6. restore the previous deployment and confirm `/contact` loads;
7. communicate the temporary fallback path to Cherie.

The pre-change production deployment observed during discovery was
`5HW4ZbSYv6eDiaXMDk6iYVbLSzFe`; confirm the current production deployment again
before using any rollback target.

## Proposed production change sheet — not yet authorized

- Repository/PR commit approved and green.
- Exact Vercel environment-variable names added; secret values omitted from the
  review record.
- One Turnstile production widget enabled for the two SVF hostnames.
- One existing-project Redis attachment.
- No DNS records.
- No nameserver changes.
- No Google Workspace changes.
- Canary deployment window and observer.
- Previous production deployment ID verified immediately before deployment.
- Rollback owner and reconciliation owner named.
