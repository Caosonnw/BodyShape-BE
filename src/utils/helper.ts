export function parseStringToNumber(value: string): number {
  const parsedNumber = Number(value)
  if (isNaN(parsedNumber)) {
    throw new Error('Invalid number format')
  }
  return parsedNumber
}

export function generateRandomString(length: number): string {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

import { formatISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export function newDate() {
  const now = new Date()
  const timeZone = 'Asia/Saigon'
  const vnTime = toZonedTime(now, timeZone)

  const formattedDate = formatISO(vnTime)
  return formattedDate
}
