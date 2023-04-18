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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  AllThingsResponseApi,
  ThingCeredentialsResponseApi,
  ThingResponseApi,
} from 'src/internal/domain/dto/response/thing.dto.response'

@ApiTags('Things')
@Controller('things')
export class ThingController {
  constructor(
    @Inject('IThingService') private readonly thingService: IThingService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new thing' })
  @ApiCreatedResponse({
    description: 'Thing created successfully',
    type: () => ThingResponseApi,
  })
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
      const thingResponse: ThingResponseApi = {
        data: thing,
        meta: {
          statusCode: 201,
          message: `Thing created successfully`,
        },
      }
      res.status(201).json(thingResponse)
    } catch (err) {
      next(err)
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all things of the user by userID' })
  @ApiCreatedResponse({
    description: 'Get the all things by user with that id successfully',
    type: () => AllThingsResponseApi,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Get('user/:userID')
  async getAllThingsByUserID(
    @Res() res,
    @Next() next,
    @Param('userID') userID: string,
  ): Promise<void> {
    try {
      const thing = await this.thingService.findAllByUserID(userID)
      const thingsResponse: AllThingsResponseApi = {
        data: thing,
        meta: {
          statusCode: 200,
          message: 'Get the all things by user with that id successfully',
        },
      }
      res.status(200).json(thingsResponse)
    } catch (err) {
      next(err)
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my all things' })
  @ApiCreatedResponse({
    description: 'Get the my all things successfully',
    type: () => AllThingsResponseApi,
  })
  @UseGuards(JwtUserAuthGuard)
  @Get('mythings')
  async getMyAllDevices(@Req() req, @Res() res, @Next() next): Promise<void> {
    try {
      const thing = await this.thingService.findAllByUserID(req.user.userID)
      const thingsResponse: AllThingsResponseApi = {
        data: thing,
        meta: {
          statusCode: 200,
          message: 'Get the my all things successfully',
        },
      }
      res.status(200).json(thingsResponse)
    } catch (err) {
      next(err)
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the thing credentials by ID' })
  @ApiCreatedResponse({
    description: 'Get the thing credentials with that id successfully',
    type: () => ThingCeredentialsResponseApi,
  })
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
      const thingsResponse: ThingCeredentialsResponseApi = {
        data: thing,
        meta: {
          statusCode: 200,
          message: 'Get the thing credentials with that id successfully',
        },
      }
      res.status(200).json(thingsResponse)
    } catch (err) {
      next(err)
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the thing by ID' })
  @ApiCreatedResponse({
    description: 'Get the thing with that id successfully',
    type: () => ThingResponseApi,
  })
  @UseGuards(JwtAnyRoleAuthGuard)
  @UseInterceptors(ThingAccessInterceptor)
  @Get(':id')
  async getByID(@Res() res, @Next() next, @Param('id') id: string): Promise<void> {
    try {
      const thing = await this.thingService.findByID(id)
      const thingResponse: ThingResponseApi = {
        data: thing,
        meta: {
          statusCode: 200,
          message: 'Get the thing with that id successfully',
        },
      }
      res.status(200).json(thingResponse)
    } catch (err) {
      next(err)
    }
  }
}
