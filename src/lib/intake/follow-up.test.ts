import { describe, expect, it } from 'vitest'
import { calculateFollowUpDue } from './follow-up'

describe('calculateFollowUpDue', () => {
  it('sets a two-hour follow-up during Tuesday-Saturday shop hours', () => {
    const submitted = new Date('2026-07-25T16:00:00.000Z') // Saturday 11am CDT
    expect(calculateFollowUpDue(submitted).toISOString()).toBe(
      '2026-07-25T18:00:00.000Z'
    )
  })

  it('sets Tuesday at 10am after Saturday closing', () => {
    const submitted = new Date('2026-07-25T23:00:00.000Z') // Saturday 6pm CDT
    expect(calculateFollowUpDue(submitted).toISOString()).toBe(
      '2026-07-28T15:00:00.000Z'
    )
  })

  it('sets Tuesday at 10am for a Monday inquiry', () => {
    const submitted = new Date('2026-07-27T17:00:00.000Z')
    expect(calculateFollowUpDue(submitted).toISOString()).toBe(
      '2026-07-28T15:00:00.000Z'
    )
  })
})
