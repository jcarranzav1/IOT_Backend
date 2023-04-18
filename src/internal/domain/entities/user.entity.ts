import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { SignUpUserDto } from '../dto/user.dto'
import { ApiProperty } from '@nestjs/swagger'

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class User {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userID: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastname: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cellphone: string

  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty()
  @IsDateString()
  createdAt: Date

  @ApiProperty()
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
