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
import { IUserAuthService } from 'src/internal/application/auth.user.service'
import {
  JwtAdminAuthGuard,
  JwtAnyRoleAuthGuard,
} from 'src/internal/application/auth/guards/jwt-auth.guard'
import { IUserService } from 'src/internal/application/user.service'
import { LoginUserDto, SignUpUserDto } from 'src/internal/domain/dto/user.dto'

@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserAuthService') private readonly authService: IUserAuthService,
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @Post('auth/signup')
  async signup(
    @Res() res,
    @Next() next,
    @Body(ValidationPipe)
    createUserDto: SignUpUserDto,
  ): Promise<void> {
    try {
      const { user, token } = await this.authService.signup(createUserDto)
      res.status(201).json({
        data: user,
        meta: {
          statusCode: 201,
          token,
          message: `Account created successfully`,
        },
      })
    } catch (err) {
      next(err)
    }
  }

  @Post('auth/login')
  async login(
    @Res() res,
    @Next() next,
    @Body(ValidationPipe)
    loginUserDto: LoginUserDto,
  ): Promise<void> {
    try {
      const { user, token } = await this.authService.login(loginUserDto)
      res.status(200).json({
        data: user,
        meta: {
          statusCode: 200,
          token,
          message: `Account login successfully`,
        },
      })
    } catch (err) {
      next(err)
    }
  }

  @UseGuards(JwtAnyRoleAuthGuard)
  @Get('profile')
  async profile(@Res() res, @Request() req): Promise<void> {
    res.status(200).json({
      data: req.user,
      meta: {
        statusCode: 200,
        message: 'Get your profile successfully',
      },
    })
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get(':id')
  async findByID(@Res() res, @Next() next, @Param('id') id: string): Promise<void> {
    try {
      const user = await this.userService.findByID(id)
      res.status(200).json({
        data: user,
        meta: {
          statusCode: 200,
          message: `Get the user with id: ${id} successfully`,
        },
      })
    } catch (err) {
      next(err)
    }
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get()
  async findAllUsers(@Res() res, @Next() next): Promise<void> {
    try {
      const users = await this.userService.findAllUsers()
      res.status(200).json({
        data: users,
        meta: {
          statusCode: 200,
          message: 'Get all profiles successfully',
        },
      })
    } catch (err) {
      next(err)
    }
  }
}
