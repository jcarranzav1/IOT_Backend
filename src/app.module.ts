import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import config from './config/config'
import logger from './config/logger'
import { ApplicationModule } from './internal/application/application.module'
import { UserController } from './internal/infra/controllers/user.controller'
import { ThingController } from './internal/infra/controllers/thing.controller'
import { middlewares } from './internal/infra/middleware/middlewares'

@Module({
  imports: [
    logger,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ApplicationModule,
  ],
  controllers: [UserController, ThingController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    middlewares.forEach(({ middleware, path, method }) => {
      consumer.apply(middleware).forRoutes({ path, method })
    })
  }
}
