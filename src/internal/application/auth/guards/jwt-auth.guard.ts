import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { UserRole } from 'src/internal/domain/entities/user.entity'

@Injectable()
export class JwtUserAuthGuard extends AuthGuard('jwt-user') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const canActivate = await super.canActivate(context)
    if (!canActivate) throw new UnauthorizedException('Invalid token')

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (user && user.role === UserRole.USER) {
      return true
    } else {
      throw new ForbiddenException(
        'You do not have permission to permon this action',
      )
    }
  }
}

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwt-user') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const canActivate = await super.canActivate(context)
    if (!canActivate) throw new UnauthorizedException('Invalid token')

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (user && user.role === UserRole.ADMIN) {
      return true
    } else {
      throw new ForbiddenException(
        'You do not have permission to permon this action',
      )
    }
  }
}

@Injectable()
export class JwtAnyRoleAuthGuard extends AuthGuard('jwt-user') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const canActivate = await super.canActivate(context)
    if (!canActivate) throw new UnauthorizedException('Invalid token')

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (user && (user.role === UserRole.USER || user.role === UserRole.ADMIN)) {
      return true
    } else {
      throw new ForbiddenException(
        'You do not have permission to permon this action',
      )
    }
  }
}
