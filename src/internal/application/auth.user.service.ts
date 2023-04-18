import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcrypt'
import { LoginUserDto, SignUpUserDto } from 'src/internal/domain/dto/user.dto'

import { User } from '../domain/entities/user.entity'
import { IUserRepository } from '../domain/ports/user.port'
import {
  UserAccountResponse,
  omitPassword,
  UserResponse,
} from '../domain/dto/response/user.dto.response'

export interface IUserAuthService {
  signup: (createUser: SignUpUserDto) => Promise<UserAccountResponse>
  login: (loginDTO: LoginUserDto) => Promise<UserAccountResponse>
  validateUser: (email: string) => Promise<UserResponse>
}

@Injectable()
export class UserAuthService implements IUserAuthService {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: SignUpUserDto): Promise<UserAccountResponse> {
    try {
      const userEmail = await this.userRepository.findByEmail(createUserDto.email)

      if (userEmail !== null) {
        throw new BadRequestException(
          'There is already an account registered with this email',
        )
      }

      if (createUserDto.confirmPassword !== createUserDto.password) {
        throw new BadRequestException('Password and confirm password do not match')
      }
      createUserDto.password = await hash(createUserDto.password, 10)

      const newUser = new User(createUserDto)
      const user = await this.userRepository.createUser(newUser)
      const token = this.jwtService.sign({ email: user.email })
      return {
        user: omitPassword(user),
        token,
      }
    } catch (err) {
      throw err
    }
  }

  async login({ email, password }: LoginUserDto): Promise<UserAccountResponse> {
    try {
      const user = await this.userRepository.findByEmail(email)

      if (user === null) {
        throw new UnauthorizedException('The email or password are incorrect')
      }

      const passwordCompare = await compare(password, user.password)
      if (passwordCompare === false) {
        throw new UnauthorizedException('The email or password are incorrect')
      }

      const token = this.jwtService.sign({ email: user.email })

      return {
        user: omitPassword(user),
        token,
      }
    } catch (err) {
      throw err
    }
  }

  async validateUser(email: string): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findByEmail(email)
      if (user === null) {
        throw new UnauthorizedException('user not exist or token invalid')
      }
      return omitPassword(user)
    } catch (err) {
      throw err
    }
  }
}
