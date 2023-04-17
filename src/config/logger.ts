import { Request, Response } from 'express'
import { LoggerModule } from 'nestjs-pino'
import { CORRELATION_ID_HEADER } from 'src/internal/infra/middleware/request-id'

export default LoggerModule.forRoot({
  pinoHttp: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        timestampKey: 'time',
        singleLine: true,
      },
    },
    customProps(req: Request) {
      return {
        correlationId: req[CORRELATION_ID_HEADER],
      }
    },
    serializers: {
      req: (req: Request) => ({
        method: req.method,
        url: req.url,
        headers: {
          host: req.headers.host,
          'content-type': req.headers['content-type'],
        },
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
    },
  },
})
