import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JWTPayload } from 'src/internal/domain/dto/token.dto'
import { IUserAuthService } from '../../../application/auth.user.service'

@Injectable()
export class JwtStrategyUser extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(
    @Inject('IUserAuthService') private readonly authService: IUserAuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.secret'),
    })
  }

  async validate({ email }: JWTPayload) {
    try {
      const user = await this.authService.validateUser(email)
      return user
    } catch (err) {
      throw new UnauthorizedException('Error al validar el token.')
    }
  }
}
