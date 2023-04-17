import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { SignUpUserDto } from '../dto/user.dto'

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class User {
  @IsNotEmpty()
  @IsString()
  userID: string

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  lastname: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  cellphone: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date

  constructor(createUserDto?: SignUpUserDto) {
    if (createUserDto) {
      this.name = createUserDto.name
      this.lastname = createUserDto.lastname
      this.email = createUserDto.email
      this.cellphone = createUserDto.cellphone
      this.password = createUserDto.password
      this.role = createUserDto.role || UserRole.USER
    }
  }
}
