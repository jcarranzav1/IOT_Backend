import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
  Inject,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { IThingService } from 'src/internal/application/thing.service'
import { User } from 'src/internal/domain/entities/user.entity'

@Injectable()
export class ThingAccessInterceptor implements NestInterceptor {
  constructor(
    @Inject('IThingService') private readonly thingService: IThingService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user

    if (user.role === 'admin') {
      return next.handle()
    }

    const thingId = request.params.id
    const thing = await this.thingService.findByID(thingId)

    if (!thing) {
      throw new ForbiddenException('Access to this Thing is not allowed')
    }

    if (user.email === thing.email) {
      return next.handle()
    }

    throw new ForbiddenException('Access to this Thing is not allowed')
  }
}
