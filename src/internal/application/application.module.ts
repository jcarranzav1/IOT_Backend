import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import InfraModule from '../infra/infra.module'
import { UserAuthService } from './auth.user.service'
import { JwtStrategyUser } from './auth/stategies/jwt.strategy'
import { UserService } from './user.service'
import { ThingService } from './thing.service'

@Module({
  imports: [
    InfraModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expires') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'IUserAuthService',
      useClass: UserAuthService,
    },
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IThingService',
      useClass: ThingService,
    },
    JwtStrategyUser,
  ],
  exports: [
    {
      provide: 'IUserAuthService',
      useClass: UserAuthService,
    },
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IThingService',
      useClass: ThingService,
    },
  ],
})
export class ApplicationModule {}
