import { Injectable, NestMiddleware } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { NextFunction, Request, Response } from 'express'

export const CORRELATION_ID_HEADER = 'X-Correlation-Id'

@Injectable()
export class RequestCorrelationID implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = req[CORRELATION_ID_HEADER] || randomUUID()
    req[CORRELATION_ID_HEADER] = correlationId
    // req[CORRELATION_ID_HEADER] = id
    // res.set(CORRELATION_ID_HEADER, id)
    res.set(CORRELATION_ID_HEADER, correlationId)

    next()
  }
}
