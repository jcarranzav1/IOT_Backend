import {
  Body,
  Controller,
  Get,
  Inject,
  Next,
  Param,
  Post,
  Res,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { IUserAuthService } from 'src/internal/application/auth.user.service'
import {
  JwtAdminAuthGuard,
  JwtAnyRoleAuthGuard,
} from 'src/internal/application/auth/guards/jwt-auth.guard'
import { IUserService } from 'src/internal/application/user.service'
import {
  AllUsersResponseApi,
  UserAccountResponseApi,
  UserResponseApi,
} from 'src/internal/domain/dto/response/user.dto.response'
import { LoginUserDto, SignUpUserDto } from 'src/internal/domain/dto/user.dto'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserAuthService') private readonly authService: IUserAuthService,
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: () => UserAccountResponseApi,
  })
  @Post('auth/signup')
  async signup(
    @Res() res,
    @Next() next,
    @Body(ValidationPipe)
    createUserDto: SignUpUserDto,
  ): Promise<void> {
    try {
      const { user, token } = await this.authService.signup(createUserDto)
      const userResponse: UserAccountResponseApi = {
        data: user,
        meta: {
          statusCode: 201,
          token,
          message: `User created successfully`,
        },
      }
      res.status(201).json(userResponse)
    } catch (err) {
      next(err)
    }
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({
    description: 'User login successfully',
    type: () => UserAccountResponseApi,
  })
  @Post('auth/login')
  async login(
    @Res() res,
    @Next() next,
    @Body(ValidationPipe)
    loginUserDto: LoginUserDto,
  ): Promise<void> {
    try {
      const { user, token } = await this.authService.login(loginUserDto)
      const userResponse: UserAccountResponseApi = {
        data: user,
        meta: {
          statusCode: 200,
          token,
          message: `User login successfully`,
        },
      }
      res.status(200).json(userResponse)
    } catch (err) {
      next(err)
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile of the authenticated user' })
  @ApiOkResponse({
    description: 'Get your profile successfully',
    type: () => UserResponseApi,
  })
  @UseGuards(JwtAnyRoleAuthGuard)
  @Get('profile')
  async profile(@Res() res, @Request() req): Promise<void> {
    const userResponse: UserResponseApi = {
      data: req.user,
      meta: {
        statusCode: 200,
        message: 'Get your profile successfully',
      },
    }
    res.status(200).json(userResponse)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({
    description: 'Get the user with the specified ID successfully',
    type: () => UserResponseApi,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Get(':id')
  async findByID(@Res() res, @Next() next, @Param('id') id: string): Promise<void> {
    try {
      const user = await this.userService.findByID(id)
      const userResponse: UserResponseApi = {
        data: user,
        meta: {
          statusCode: 200,
          message: 'Get the user with the specified ID successfully',
        },
      }
      res.status(200).json(userResponse)
    } catch (err) {
      next(err)
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Get all users successfully',
    type: () => AllUsersResponseApi,
  })
  @UseGuards(JwtAdminAuthGuard)
  @Get()
  async findAllUsers(@Res() res, @Next() next): Promise<void> {
    try {
      const users = await this.userService.findAllUsers()
      const userResponse: AllUsersResponseApi = {
        data: users,
        meta: {
          statusCode: 200,
          message: 'Get all users successfully',
        },
      }
      res.status(200).json(userResponse)
    } catch (err) {
      next(err)
    }
  }
}
