import {
  Controller,
  Inject,
  Next,
  Post,
  Res,
  Request,
  UseGuards,
  ValidationPipe,
  Body,
  Get,
  Param,
  Req,
  UseInterceptors,
} from '@nestjs/common'
import {
  JwtAdminAuthGuard,
  JwtAnyRoleAuthGuard,
  JwtUserAuthGuard,
} from 'src/internal/application/auth/guards/jwt-auth.guard'
import { IThingService } from 'src/internal/application/thing.service'
import { CreateThingDTO } from 'src/internal/domain/dto/thing.dto'
import { ThingAccessInterceptor } from '../../application/auth/interceptor/thing-access.interceptor'

@Controller('things')
export class ThingController {
  constructor(
    @Inject('IThingService') private readonly thingService: IThingService,
  ) {}

  @UseGuards(JwtAdminAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Res() res,
    @Next() next,
    @Body(ValidationPipe) createThingDTO: CreateThingDTO,
  ): Promise<void> {
    try {
      const thing = await this.thingService.create(createThingDTO)
      res.status(200).json({
        data: thing,
        meta: {
          statusCode: 200,
          message: `Thing created successfully`,
        },
      })
    } catch (err) {
      next(err)
    }
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('user/:userID')
  async getAllThingsByUserID(
    @Res() res,
    @Next() next,
    @Param('userID') userID: string,
  ): Promise<void> {
    try {
      const thing = await this.thingService.findAllByUserID(userID)
      res.status(200).json({
        data: thing,
        meta: {
          statusCode: 200,
          message: `Get the all things by user with id: ${userID} successfully`,
        },
      })
    } catch (err) {
      next(err)
    }
  }

  @UseGuards(JwtUserAuthGuard)
  @Get('mydevices')
  async getMyAllDevices(@Req() req, @Res() res, @Next() next): Promise<void> {
    try {
      const thing = await this.thingService.findAllByUserID(req.user.userID)
      res.status(200).json({
        data: thing,
        meta: {
          statusCode: 200,
          message: `Get the my all things successfully`,
        },
      })
    } catch (err) {
      next(err)
    }
  }

  @UseGuards(JwtAnyRoleAuthGuard)
  @UseInterceptors(ThingAccessInterceptor)
  @Get('credentials/:id')
  async getCredentialsByID(
    @Res() res,
    @Next() next,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      const thing = await this.thingService.getCredentialsByID(id)
      res.status(200).json({
        data: thing,
        meta: {
          statusCode: 200,
          message: `Get the thing credentials with id: ${id} successfully`,
        },
      })
    } catch (err) {
      next(err)
    }
  }

  @UseGuards(JwtAnyRoleAuthGuard)
  @UseInterceptors(ThingAccessInterceptor)
  @Get(':id')
  async getByID(@Res() res, @Next() next, @Param('id') id: string): Promise<void> {
    try {
      const thing = await this.thingService.findByID(id)
      res.status(200).json({
        data: thing,
        meta: {
          statusCode: 200,
          message: `Get the thing with id: ${id} successfully`,
        },
      })
    } catch (err) {
      next(err)
    }
  }
}
