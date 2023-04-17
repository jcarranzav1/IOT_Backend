import { RequestMethod } from '@nestjs/common'
import { RequestCorrelationID } from './request-id'

export const middlewares = [
  {
    middleware: RequestCorrelationID,
    path: '*',
    method: RequestMethod.ALL,
  },
]
