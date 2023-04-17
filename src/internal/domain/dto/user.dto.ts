import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'
import { UserRole } from '../entities/user.entity'

export class SignUpUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @IsString()
  @IsNotEmpty()
  readonly lastname: string

  @IsEmail()
  readonly email: string

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[a-zA-Z0-9!@#\$%\^&\*]+$/)
  @MinLength(6)
  password: string

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[a-zA-Z0-9!@#\$%\^&\*]+$/)
  @MinLength(6)
  readonly confirmPassword: string

  @IsOptional()
  @IsString()
  @Matches(/^\+(?:[0-9]●?){6,14}[0-9]$/)
  cellphone: string
}

export class LoginUserDto {
  @IsEmail()
  readonly email: string

  @IsString()
  password: string
}
