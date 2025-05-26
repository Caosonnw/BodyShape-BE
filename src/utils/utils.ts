import { HttpStatus } from '@nestjs/common'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export interface ApiResponse<T> {
  data?: T | null
  message: string
  statusCode: HttpStatus
  date: string
}

export const Response = <T>(message: string, statusCode: HttpStatus, data?: T | null): ApiResponse<T> => {
  return {
    data: data ?? null,
    message,
    statusCode,
    date: format(new Date(), 'yyyy-MM-dd HH:mm:ss', { locale: vi })
  }
}
