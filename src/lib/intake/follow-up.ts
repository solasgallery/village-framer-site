const BUSINESS_TIME_ZONE = 'America/Chicago'

function parts(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIME_ZONE,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )
}

function dateAtCentral(year: number, month: number, day: number, hour: number) {
  const guess = new Date(Date.UTC(year, month - 1, day, hour + 6))
  const local = parts(guess)
  const correctionHours = hour - Number(local.hour)
  return new Date(guess.getTime() + correctionHours * 60 * 60 * 1000)
}

function nextBusinessMorning(date: Date) {
  const local = parts(date)
  let cursor = dateAtCentral(
    Number(local.year),
    Number(local.month),
    Number(local.day) + 1,
    10
  )

  while (['Sun', 'Mon'].includes(parts(cursor).weekday)) {
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000)
  }
  return cursor
}

export function calculateFollowUpDue(submittedAt: Date): Date {
  const local = parts(submittedAt)
  const hour = Number(local.hour)
  const minute = Number(local.minute)
  const duringBusinessHours =
    !['Sun', 'Mon'].includes(local.weekday) &&
    hour >= 10 &&
    (hour < 17 || (hour === 17 && minute === 0))

  if (duringBusinessHours) {
    return new Date(submittedAt.getTime() + 2 * 60 * 60 * 1000)
  }

  return nextBusinessMorning(submittedAt)
}
